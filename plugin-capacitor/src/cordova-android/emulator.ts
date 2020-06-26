import { spawn } from '../utils';
import Adb from './Adb';
import logger from '../logger';

const shelljs = require('shelljs');
const { realpathSync } = require('fs');
const androidVersions = require('android-versions');

const delay = (interval: number) => new Promise(resolve => setTimeout(resolve, interval));

const versionToApiLevel = {
  '4.0': 14,
  '4.0.3': 15,
  4.1: 16,
  4.2: 17,
  4.3: 18,
  4.4: 19,
  '4.4W': 20,
  '5.0': 21,
  5.1: 22,
  '6.0': 23,
  '7.0': 24,
  '7.1.1': 25,
  '8.0': 26,
};

function forgivingWhichSync(cmd) {
  try {
    return realpathSync(shelljs.which(cmd));
  } catch (e) {
    return '';
  }
}

export const listImagesUsingAvdmanager = async () => {
  const output = await spawn('avdmanager', ['list', 'avd'], { stdio: 'pipe' });
  const response = output.split('\n');
  const emulatorList: any[] = [];
  for (let i = 1; i < response.length; i += 1) {
    // To return more detailed information use img_obj
    const imgObj: any = {};
    if (response[i].match(/Name:\s/)) {
      imgObj.name = response[i].split('Name: ')[1].replace('\r', '');
      if (response[i + 1].match(/Device:\s/)) {
        i += 1;
        imgObj.device = response[i].split('Device: ')[1].replace('\r', '');
      }
      if (response[i + 1].match(/Path:\s/)) {
        i += 1;
        imgObj.path = response[i].split('Path: ')[1].replace('\r', '');
      }
      if (response[i + 1].match(/Target:\s/)) {
        i += 1;
        if (response[i + 1].match(/ABI:\s/)) {
          imgObj.abi = response[i + 1].split('ABI: ')[1].replace('\r', '');
        }
        // This next conditional just aims to match the old output of `android list avd`
        // We do so so that we don't have to change the logic when parsing for the
        // best emulator target to spawn (see below in `best_image`)
        // This allows us to transitionally support both `android` and `avdmanager` binaries,
        // depending on what SDK version the user has
        if (response[i + 1].match(/Based\son:\s/)) {
          [, imgObj.target] = response[i + 1].split('Based on:');
          if (imgObj.target.match(/Tag\/ABI:\s/)) {
            imgObj.target = imgObj.target.split('Tag/ABI:')[0].replace('\r', '').trim();
            if (imgObj.target.indexOf('(') > -1) {
              imgObj.target = imgObj.target.substr(0, imgObj.target.indexOf('(') - 1).trim();
            }
          }
          const versionString = imgObj.target.replace(/Android\s+/, '');

          const apiLevel = versionToApiLevel[versionString];
          if (apiLevel) {
            imgObj.target += ` (API level ${apiLevel})`;
          }
        }
      }
      if (response[i + 1].match(/Skin:\s/)) {
        i += 1;
        imgObj.skin = response[i].split('Skin: ')[1].replace('\r', '');
      }

      emulatorList.push(imgObj);
    }

    /* To just return a list of names use this
            if (response[i].match(/Name:\s/)) {
                emulator_list.push(response[i].split('Name: ')[1].replace('\r', '');
            } */
  }
  return emulatorList;
};

export const listImagesUsingAndroid = async () => {
  const output = await spawn('android', ['list', 'avd'], { stdio: 'pipe' });
  const response = output.split('\n');
  const emulatorList: any[] = [];
  for (let i = 1; i < response.length; i += 1) {
    // To return more detailed information use img_obj
    const imgObj: any = {};
    if (response[i].match(/Name:\s/)) {
      imgObj.name = response[i].split('Name: ')[1].replace('\r', '');
      if (response[i + 1].match(/Device:\s/)) {
        i += 1;
        imgObj.device = response[i].split('Device: ')[1].replace('\r', '');
      }
      if (response[i + 1].match(/Path:\s/)) {
        i += 1;
        imgObj.path = response[i].split('Path: ')[1].replace('\r', '');
      }
      if (response[i + 1].match(/\(API\slevel\s/) || (response[i + 2] && response[i + 2].match(/\(API\slevel\s/))) {
        i += 1;
        const secondLine = response[i + 1].match(/\(API\slevel\s/) ? response[i + 1] : '';
        imgObj.target = (response[i] + secondLine).split('Target: ')[1].replace('\r', '');
      }
      if (response[i + 1].match(/ABI:\s/)) {
        i += 1;
        imgObj.abi = response[i].split('ABI: ')[1].replace('\r', '');
      }
      if (response[i + 1].match(/Skin:\s/)) {
        i += 1;
        imgObj.skin = response[i].split('Skin: ')[1].replace('\r', '');
      }

      emulatorList.push(imgObj);
    }

    /* To just return a list of names use this
          if (response[i].match(/Name:\s/)) {
              emulator_list.push(response[i].split('Name: ')[1].replace('\r', '');
          } */
  }
  return emulatorList;
};

/**
 * Returns a Promise for a list of emulator images in the form of objects
 * {
      name   : <emulator_name>,
      device : <device>,
      path   : <path_to_emulator_image>,
      target : <api_target>,
      abi    : <cpu>,
      skin   : <skin>
   }
 */
export const listImages = async () => {
  let avds: any[] = [];
  if (forgivingWhichSync('avdmanager')) {
    avds = await listImagesUsingAvdmanager();
  } else if (forgivingWhichSync('android')) {
    avds = await listImagesUsingAvdmanager();
  } else {
    return Promise.reject(
      new Error(
        'Could not find either `android` or `avdmanager` on your $PATH! Are you sure the Android SDK is installed and available?',
      ),
    );
  }
  // In case we're missing the Android OS version string from the target description, add it.
  return avds.map((avd: any) => {
    if (avd.target && avd.target.indexOf('Android API') > -1 && avd.target.indexOf('API level') < 0) {
      const apiLevel = avd.target.match(/\d+/);
      if (apiLevel) {
        const level = androidVersions.get(apiLevel);
        if (level) {
          avd.target = `Android ${level.semver} (API level ${apiLevel})`;
        }
      }
    }
    return avd;
  });
};

export const listStarted = async function () {
  return Adb.devices({ emulators: true });
};

export const getAvailablePort = async function () {
  const emulators = await listStarted();
  for (let p = 5584; p >= 5554; p -= 2) {
    if (emulators.indexOf(`emulator-${p}`) === -1) {
      logger.debug(`Found available port: ${p}`);
      return p;
    }
  }
  throw new Error('Could not find an available avd port');
};

export const bestImage = async () => {
  const images = await listImages();
  if (images.length > 0) {
    return images[0];
  }
  return undefined;
};

export const waitForEmulator = async function (port) {
  const emulatorId = `emulator-${port}`;

  try {
    const output = await Adb.shell(emulatorId, 'getprop dev.bootcomplete');

    if (output.indexOf('1') >= 0) {
      return emulatorId;
    }
    await delay(1000);
    return waitForEmulator(port);
  } catch (error) {
    logger.error(error.message);
    if (
      (error && error.message && error.message.indexOf('not found') > -1) ||
      error.message.indexOf('device offline') > -1 ||
      error.message.indexOf('device still connecting') > -1 ||
      error.message.indexOf('device still authorizing') > -1
    ) {
      // emulator not yet started, continue waiting
      await delay(1000);
      return waitForEmulator(port);
    }
    // something unexpected has happened
    throw error;
  }
};

export const waitForBoot = async function (emulatorId: string, timeRemaining: number = 10000) {
  const output = await Adb.shell(emulatorId, 'ps');
  if (output.match(/android\.process\.acore/)) {
    return true;
  }
  if (timeRemaining === 0) {
    return false;
  }
  process.stdout.write('.');

  return new Promise((resolve) => {
    const interval = Math.min(timeRemaining, 3000);

    setTimeout(() => {
      const updatedTime = timeRemaining >= 0 ? Math.max(timeRemaining - 3000, 0) : timeRemaining;
      resolve(waitForBoot(emulatorId, updatedTime));
    }, interval);
  });
};
