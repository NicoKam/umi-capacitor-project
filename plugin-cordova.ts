import address from 'address';
import { IApi } from 'umi';
import fs from 'fs';
import { promisify } from 'util';
import { resolve } from 'path';
import spawn from 'cross-spawn';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);

async function changeCordovaConfigContent(configPath: string, url: string): Promise<string | undefined> {
  const configExists = await exists(configPath);
  if (!configExists) {
    return 'config.xml not exists.';
  }
  const contentRegex = /<content (.*)src="[^"]*"(.*)\/>/;
  const configContent = await readFile(configPath);
  await writeFile(configPath, configContent.toString().replace(contentRegex, `<content $1src="${url}"$2/>`));
  return undefined;
}

export default (api: IApi) => {
  const logger = {
    info(...args: any[]) {
      api.logger.info('[plugin-cordova]', ...args);
    },
    log(...args: any[]) {
      api.logger.log('[plugin-cordova]', ...args);
    },
    error(...args: any[]) {
      api.logger.error('[plugin-cordova]', ...args);
    },
  };
  api.describe({
    key: 'cordova',
    config: {
      schema(joi) {
        return joi.object({});
      },
    },
  });

  /* change default config */
  api.modifyDefaultConfig((config) => {
    return {
      ...config,
      outputPath: 'www',
      history: { type: 'hash' },
      base: './',
      publicPath: './',
    };
  });

  let first = true;

  api.onDevCompileDone(async () => {
    const { android, ios } = api.args;
    if (!android && !ios) {
      return;
    }
    if (first) {
      first = false;
      const url = `http://${address.ip()}:${api.getPort()}`;
      logger.info(`Setting url(${url}) to content.src in config.xml`);
      const err = await changeCordovaConfigContent(resolve(<string>api.paths.cwd, 'config.xml'), url);
      if (err) {
        logger.error(err);
      } else {
        const { cordova = {} } = api.config;
        const { cmdStartAndroid = 'cordova run android', cmdStartIos = 'cordova run ios' } = cordova;
        let cmd;
        if (android) {
          logger.info('Starting platform android...');
          cmd = cmdStartAndroid;
        } else {
          logger.info('Starting platform ios...');
          cmd = cmdStartIos;
        }
        logger.info(`Running cmd: ${cmd}`);
        const [program, ...args] = cmd.split(' ');
        const ps = spawn(program, args, { cwd: api.paths.cwd, stdio: 'inherit', detached: true });
        ps.on('error', (err1) => {
          logger.error(err1);
        });
        ps.unref();
      }
    }
  });

  api.modifyRendererPath(() => {
    return resolve(__dirname, 'customRenderer/clientRender.tsx');
  });
};
