/* copy from cordova-android */
/**
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/

import logger from '../logger';
import { spawn } from '../utils';

const os = require('os');

function isDevice(line: string) {
  return line.match(/\w+\tdevice/) && !line.match(/emulator/);
}

function isEmulator(line: string) {
  return line.match(/device/) && line.match(/emulator/);
}

const Adb = {

  /**
   * Lists available/connected devices and emulators
   *
   * @param   {Object}   opts            Various options
   * @param   {Boolean}  opts.emulators  Specifies whether this method returns
   *   emulators only
   *
   * @return  {Promise<String[]>}        list of available/connected
   *   devices/emulators
   */
  async devices(opts: any = {}) {
    const output = await spawn('adb', ['devices'], { cwd: os.tmpdir(), stdio: 'pipe' });
    return output
      .split('\n')
      .filter((line) => {
        // Filter out either real devices or emulators, depending on options
        return line && opts && opts.emulators ? isEmulator(line) : isDevice(line);
      })
      .map((line) => {
        return line.replace(/\tdevice/, '').replace('\r', '');
      });
  },

  async install(target: string, packagePath: string, opts: any = {}) {
    logger.debug(`Installing apk ${packagePath} on target ${target}...`);
    const args = ['-s', target, 'install'];
    if (opts && opts.replace) args.push('-r');
    let output = await spawn('adb', args.concat(packagePath), { cwd: os.tmpdir(), stdio: 'pipe' });
    // 'adb install' seems to always returns no error, even if installation fails
    // so we catching output to detect installation failure
    if (output.match(/Failure/)) {
      if (output.match(/INSTALL_PARSE_FAILED_NO_CERTIFICATES/)) {
        output +=
          '\n\n' +
          "Sign the build using '-- --keystore' or '--buildConfig'" +
          ' or sign and deploy the unsigned apk manually using Android tools.';
      } else if (output.match(/INSTALL_FAILED_VERSION_DOWNGRADE/)) {
        output +=
          '\n\n' +
          "You're trying to install apk with a lower versionCode that is already installed." +
          '\nEither uninstall an app or increment the versionCode.';
      }

      const errMsg = `Failed to install apk to device: ${output}`;
      throw new Error(errMsg);
    }
    return output;
  },

  async uninstall(target: string, packageId: string) {
    logger.debug(`Uninstalling package ${packageId} from target:string ${target}...`);
    return spawn('adb', ['-s', target, 'uninstall', packageId], { cwd: os.tmpdir(), stdio: 'pipe' });
  },

  async shell(target: string, shellCommand: string) {
    logger.debug(`Running adb shell command "${shellCommand}" on target ${target}...`);
    const args = ['-s', target, 'shell'];
    const cmd = shellCommand.split(/\s+/);
    return spawn('adb', args.concat(cmd), { cwd: os.tmpdir(), stdio: 'pipe' }).catch((error) => {
      const errMsg = `Failed to execute shell command "${shellCommand}"" on device: ${error}`;
      logger.debug(errMsg);
      return error.message;
    });
  },

  async start(target: string, activityName: string) {
    logger.debug(`Starting application "${activityName}" on target ${target}...`);
    return Adb.shell(target, `am start -W -a android.intent.action.MAIN -n${activityName}`).catch((output) => {
      const errMsg = `Failed to start application "${activityName}"" on device: ${output}`;
      throw new Error(errMsg);
    });
  },
};

export default Adb;
