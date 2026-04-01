import type { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig } from 'homebridge';
import { SpaClient } from './spaClient';
/**
 * SpaHomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
export declare class SpaHomebridgePlatform implements DynamicPlatformPlugin {
    readonly log: Logger;
    readonly config: PlatformConfig;
    readonly api: API;
    readonly Service: typeof import("homebridge").Service;
    readonly Characteristic: typeof import("homebridge").Characteristic;
    readonly accessories: PlatformAccessory[];
    spa: (SpaClient | undefined);
    devices: any[];
    deviceObjects: any[];
    name: string;
    connectionProblem: Error;
    constructor(log: Logger, config: PlatformConfig, api: API);
    haveAddressOfSpa(devMode: boolean, ipAddress: string): void;
    /**
     * This function is invoked when homebridge restores cached accessories from disk at startup.
     * It should be used to setup event handlers for characteristics and update respective values.
     */
    configureAccessory(accessory: PlatformAccessory): void;
    /**
     * Called once we have received a message from the spa containing the
     * accurate configuration of number of pumps (and their speed ranges),
     * lights, etc.
     */
    spaConfigurationKnown(): void;
    private scheduleId;
    /**
     * This is a callback which is triggered when the Spa code discovers that something has changed in
     * the spa state, where that change might have happened outside of Home. In such a case we need to
     * make sure all accessories are resynced. This resync operation is lightweight (no spa communication
     * needed) and fast. It may lead to Home's knowledge of the state of each accessory changing.
     *
     * The only challenge is that this call might be triggered while changes are already
     * being sent to the spa, so we want to wait for any changes to play out before
     * checking the spa's state and updating everything.
     */
    updateStateOfAccessories(): void;
    private reallyUpdateStateOfAccessories;
    status(): "(connected)" | "(not currently connected)";
    isCurrentlyConnected(): boolean;
    recordedActions: CallableFunction[];
    recordAction(func: CallableFunction): void;
    executeAllRecordedActions(): void;
    /**
     * We get all accessories either from the spa itself or from the config.json file.
      */
    discoverDevices(): void;
    /**
     * Accessories must only be registered once, previously created accessories
     * must not be registered again to prevent "duplicate UUID" errors.
     */
    private makeDevice;
    makeAccessory(accessory: PlatformAccessory): void;
}
//# sourceMappingURL=platform.d.ts.map