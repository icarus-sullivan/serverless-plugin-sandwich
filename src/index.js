const bPromise = require('bluebird');
const fs = require('fs-extra');
const path = require('path');
const { pipe, get } = require('./utils');
const { createTemplateEngine } = require('./hbs');

const PLUGIN = 'sandwich';
const BUILD_DIR = 'sandwich';

class PipelinePlugin {
  constructor(serverless) {
    this.serverless = serverless;
    this.servicePath = get(serverless, 'config.servicePath');
    this.runtime = get(serverless, 'service.provider.runtime');
    this.templateEngine = createTemplateEngine(this.runtime);

    this.commands = {
      [PLUGIN]: {
        usage: 'Nests a lambda call between two others',
        lifecycleEvents: [PLUGIN],
        commands: {
          order: {
            usage: 'Builds sandwiched lambdas',
            lifecycleEvents: ['order'],
          },
        },
      },
    };

    const requestOrders = pipe(bPromise.bind(this), () =>
      this.serverless.pluginManager.spawn(`${PLUGIN}:order`),
    );

    this.hooks = {
      'after:deploy:deploy': pipe(bPromise.bind(this), this.cleanUp.bind(this)),
      'before:package:createDeploymentArtifacts': requestOrders,
      'before:deploy:function:packageFunction': requestOrders,
      'before:invoke:local:invoke': requestOrders,
      'before:deploy:deploy': requestOrders,
      'before:run:run': requestOrders,
      [`${PLUGIN}:order:order`]: pipe(
        bPromise.bind(this),
        this.processOrders.bind(this),
        this.createSandwiches.bind(this),
      ),
    };
  }

  processOrders() {
    const functions = get(this.serverless, 'service.functions', {});
    return Object.keys(functions).reduce((o, name) => {
      const config = get(functions[name], 'sandwich');
      if (config) {
        o.push({
          name,
          handler: get(functions[name], 'handler'),
          ...config,
        });
      }

      return o;
    }, []);
  }

  createSandwiches(orders) {
    if (!orders || orders.length === 0) {
      return;
    }

    console.log('createSandwiches');
    fs.mkdirSync(BUILD_DIR, { recursive: true });

    const { createFilename, createTemplate } = this.templateEngine;
    for (const order of orders) {
      const { name, ...config } = order;
      const filename = createFilename({ buildDir: BUILD_DIR, name });
      const content = createTemplate(config);
      const newHandler = path.join(BUILD_DIR, `${name}.default`);

      fs.writeFileSync(filename, content);
      this.serverless.cli.consoleLog(`[${name}] - ${newHandler}`);
      this.serverless.service.functions[name].handler = newHandler;
    }
  }

  cleanUp() {
    fs.rmdirSync(BUILD_DIR);
  }
}

module.exports = PipelinePlugin;
