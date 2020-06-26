export declare const listImagesUsingAvdmanager: () => Promise<any[]>;
export declare const listImagesUsingAndroid: () => Promise<any[]>;
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
export declare const listImages: () => Promise<any[]>;
export declare const listStarted: () => Promise<string[]>;
export declare const getAvailablePort: () => Promise<number>;
export declare const bestImage: () => Promise<any>;
export declare const waitForEmulator: (port: any) => any;
export declare const waitForBoot: (emulatorId: string, timeRemaining?: number) => Promise<unknown>;
