declare enum LoggerLevel {
    VERBOSE = 0,
    INFO = 1,
    ERROR = 2
}
export interface LoggerProps {
    level?: LoggerLevel;
    prefix?: string;
}
export declare class Logger {
    level: LoggerLevel;
    prefix: string;
    constructor(props?: LoggerProps);
    getPrefix: () => string;
    debug: (msg: string) => void;
    info: (msg: string) => void;
    error: (msg: string) => void;
}
declare const _default: Logger;
export default _default;
