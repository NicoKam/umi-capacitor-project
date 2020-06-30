import { resolve } from 'path';
import Adb from './cordova-android/Adb';
import { bestImage, getAvailablePort, waitForBoot, waitForEmulator } from './cordova-android/emulator';
import logger from './logger';
import { readFileJson, spawn } from './utils';

export const build = async (root = process.cwd()) => {
  const gradleCmd = resolve(root, './android/gradlew');
  const args = ['assembleDebug', '-b', resolve(root, './android/build.gradle')];
  await spawn(gradleCmd, args);
};

export const getActiveDevice = async (): Promise<string | void> => {
  const avd = await bestImage();
  if (!avd) {
    return undefined;
  }
  const port = await getAvailablePort();
  spawn('emulator', ['-avd', avd.name, '-port', port], { detached: true }).catch(() => {
    logger.error('Emulator start failed.');
    process.exit(-2);
  });
  logger.info('Waiting for emulator...');
  const emulatorId = await waitForEmulator(port);
  if (!emulatorId) {
    throw new Error('Emulator start failed.');
  }
  logger.info(`Emulator${emulatorId} started`);

  const success = await waitForBoot(emulatorId);
  if (success) {
    logger.info('BOOT COMPLETE');
    // unlock screen
    await Adb.shell(emulatorId, 'input keyevent 82');
    // return the new emulator id for the started emulators
    return emulatorId;
  }
  return undefined;
};

export const start = async (root = process.cwd()) => {
  const devices = [...(await Adb.devices()), ...(await Adb.devices({ emulators: true }))];
  let emulatorId;
  if (devices.length === 0) {
    emulatorId = await getActiveDevice();
  } else {
    [emulatorId] = devices;
  }

  if (emulatorId == null) {
    logger.error('No avaliable target.');
    throw new Error('No avaliable target.');
  }

  logger.info('Installing app...');
  await Adb.install(emulatorId, resolve(root, './android/app/build/outputs/apk/debug/app-debug.apk'));
  logger.info('Install compoleted. Starting App');
  const config = await readFileJson(resolve(process.cwd(), 'capacitor.config.json'));
  await Adb.start(emulatorId, `${config.appId}/.MainActivity`);
};

export async function run() {
  logger.info('build project');
  await spawn(resolve(process.cwd(), 'node_modules/.bin/cap'), ['copy', 'android']);
  await build();
  await start();
}
