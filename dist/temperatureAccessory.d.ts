import type { PlatformAccessory, CharacteristicGetCallback } from 'homebridge';
import { SpaHomebridgePlatform } from './platform';
/**
 * A read-only temperature sensor for the Spa.
 */
export declare class TemperatureAccessory {
    private readonly platform;
    private readonly accessory;
    private service;
    constructor(platform: SpaHomebridgePlatform, accessory: PlatformAccessory);
    /**
     * Handle the "GET" requests from HomeKit
     * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
     *
     * GET requests should return as fast as possbile. A long delay here will result in
     * HomeKit being unresponsive and a bad user experience in general.
     *
     * If your device takes time to respond you should update the status of your device
     * asynchronously instead using the `updateCharacteristic` method instead.
  
     * @example
     * this.service.updateCharacteristic(this.platform.Characteristic.get, true)
     */
    get(callback: CharacteristicGetCallback): void;
    spaConfigurationKnown(): void;
    updateCharacteristics(): void;
}
//# sourceMappingURL=temperatureAccessory.d.ts.map