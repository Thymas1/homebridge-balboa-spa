import type { PlatformAccessory, CharacteristicValue, CharacteristicSetCallback, CharacteristicGetCallback } from 'homebridge';
import { SpaHomebridgePlatform } from './platform';
/**
 * Control a 1- or 2- speed pump as a homekit "fan". If 3 speed pumps exist,
 * this should also work.
 */
export declare class PumpAccessory {
    private readonly platform;
    private readonly accessory;
    private readonly pumpNumber;
    private service;
    /**
     * Remember the last speed so that flipping the pump on/off will use the same
     * speed as last time.
     */
    lastNonZeroSpeed: number;
    numSpeedSettings: number;
    name: string;
    constructor(platform: SpaHomebridgePlatform, accessory: PlatformAccessory, pumpNumber: number);
    /**
     * Handle "SET" requests from HomeKit
     * Turns the device on or off.
     * It is possible that the Spa rejects this change, if the user is trying to turn the pump off, if it
     * is during a filter cycle. In that case the 'updateCharacteristics' callback below will end up
     * being called and that will discover the correct new value.
     */
    setOn(value: CharacteristicValue, callback: CharacteristicSetCallback): void;
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
     * this.service.updateCharacteristic(this.platform.Characteristic.On, true)
     */
    getOn(callback: CharacteristicGetCallback): void;
    /**
     * Handle "SET" requests from HomeKit
     * These are sent when the user changes the state of an accessory, for example, changing the Brightness
     * It is possible that the Spa rejects this change, if the user is trying to turn the pump off, if it
     * is during a filter cycle. In that case the 'updateCharacteristics' callback below will end up
     * being called and that will discover the correct new value.
     */
    setRotationSpeed(value: CharacteristicValue, callback: CharacteristicSetCallback): void;
    /**
     * Handle "GET" requests from HomeKit
     * These are sent when the user changes the state of an accessory, for example, changing the Brightness
     */
    getRotationSpeed(callback: CharacteristicSetCallback): void;
    spaConfigurationKnown(): void;
    updateCharacteristics(): void;
    private getSpeed;
    private scheduleId;
    /**
     * When the pump is turned on, we receive both an on setting (which triggers setting
     * the speed) and will usually also (depending on the user's actions) also receive
     * an immediate follow-on setting of the speed as well.  We want to reconcile multiple
     * rapid speed settings to just a single set of the spa to avoid confusion.
     */
    private scheduleSetSpeed;
    private setSpeed;
}
//# sourceMappingURL=pumpAccessory.d.ts.map