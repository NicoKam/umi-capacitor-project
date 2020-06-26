import chalk from 'chalk';

const argv = require('minimist')(process.argv.slice(2));

enum LoggerLevel {
  VERBOSE = 0,
  INFO = 1,
  ERROR = 2,
}

export interface LoggerProps {
  level?: LoggerLevel;
  prefix?: string;
}

export class Logger {
  level: LoggerLevel;

  prefix: string;

  constructor(props: LoggerProps = {}) {
    const { level = LoggerLevel.INFO, prefix = '' } = props;
    this.level = level;
    this.prefix = prefix;
  }

  getPrefix = () => {
    if (this.prefix) {
      return `[${this.prefix}] `;
    }
    return '';
  };

  debug = (msg: string) => {
    if (this.level <= LoggerLevel.VERBOSE) {
      console.log(chalk.gray(this.getPrefix() + msg));
    }
  };

  info = (msg: string) => {
    if (this.level <= LoggerLevel.INFO) {
      console.log(this.getPrefix() + msg);
    }
  };

  error = (msg: string) => {
    if (this.level <= LoggerLevel.ERROR) {
      console.log(chalk.red(this.getPrefix() + msg));
    }
  };
}

let level = LoggerLevel.INFO;

if (argv.verbose) {
  level = LoggerLevel.VERBOSE;
}

export default new Logger({
  level,
  prefix: 'umi-plugin-capacitor',
});
