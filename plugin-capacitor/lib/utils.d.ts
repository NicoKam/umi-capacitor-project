/// <reference types="node" />
import { SpawnOptions } from 'child_process';
import fs from 'fs';
export declare const spawn: (command: string, args?: readonly string[] | undefined, options?: SpawnOptions | undefined) => Promise<string>;
export declare function readFileJson(path: string): Promise<any>;
export declare function writeFileJson(path: string, json: any, options?: string | (fs.BaseEncodingOptions & {
    mode?: string | number | undefined;
    flag?: string | undefined;
}) | null | undefined): Promise<void>;
