import { SpawnOptions } from 'child_process';
import crossSpawn from 'cross-spawn';
import fs from 'fs';
import { promisify } from 'util';
import logger from './logger';

const cwd = process.cwd();

export const spawn = (
  command: string,
  args?: readonly string[] | undefined,
  options?: SpawnOptions | undefined,
): Promise<string> => {
  return new Promise((r, reject) => {
    logger.debug(`Running cmd: ${[command, ...(args || [])].join(' ')}`);
    const ps = crossSpawn(command, args, { cwd, stdio: 'inherit', ...options });
    let stdout = '';
    // eslint-disable-next-line no-unused-expressions
    ps.stdout?.on('data', (chunk) => {
      stdout += chunk;
    });
    let stderr = '';
    // eslint-disable-next-line no-unused-expressions
    ps.stderr?.on('data', (chunk) => {
      stderr += chunk;
    });
    ps.on('close', (code) => {
      if (code !== 0) {
        const errMsg = `Execute error(${code}): [${[command, ...(args || [])].join(' ')}]`;
        logger.debug(`${errMsg} ${stderr}`);
        reject(new Error(stderr));
        return;
      }
      r(stdout);
    });
  });
};

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
// const exists = promisify(fs.exists);

export async function readFileJson(path: string) {
  try {
    const buffer = await readFile(path);
    const json = JSON.parse(buffer.toString());
    return json;
  } catch (error) {
    return undefined;
  }
}

export async function writeFileJson(
  path: string,
  json: any,
  options?:
    | string
    | (fs.BaseEncodingOptions & { mode?: string | number | undefined; flag?: string | undefined })
    | null
    | undefined,
) {
  await writeFile(path, JSON.stringify(json, null, '  '), options);
}
