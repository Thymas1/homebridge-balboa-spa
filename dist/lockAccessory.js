"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockAccessory = void 0;
const settings_1 = require("./settings");
/**
 * LockAccessory
 *
 * Lock the spa settings (useful to avoid anyone messing with anything beyond basic
 * control of pumps, lights, etc) and/or the entire spa panel of controls (which stops anyone
 * from doing anything with the panel, unless they know how to unlock it).
 */
class LockAccessory {
    constructor(platform, accessory, entireSpa) {
        var _a;
        this.platform = platform;
        this.accessory = accessory;
        this.entireSpa = entireSpa;
        // set accessory information
        this.accessory.getService(this.platform.Service.AccessoryInformation)
            .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Balboa')
            .setCharacteristic(this.platform.Characteristic.Model, this.platform.name)
            .setCharacteristic(this.platform.Characteristic.SerialNumber, settings_1.VERSION);
        this.service = (_a = this.accessory.getService(this.platform.Service.LockMechanism)) !== null && _a !== void 0 ? _a : this.accessory.addService(this.platform.Service.LockMechanism);
        // set the service name, this is what is displayed as the default name on the Home app
        // in this example we are using the name we stored in the `accessory.context` in the `discoverDevices` method.
        this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.name);
        // each service must implement at-minimum the "required characteristics" for the given service type
        // see https://developers.homebridge.io/#/service/LockMechanism
        // register handlers for the Lock characteristics
        this.service.getCharacteristic(this.platform.Characteristic.LockTargetState)
            .on("set" /* CharacteristicEventTypes.SET */, this.setLockedOn.bind(this))
            .on("get" /* CharacteristicEventTypes.GET */, this.getLockedOn.bind(this));
        this.service.getCharacteristic(this.platform.Characteristic.LockCurrentState)
            .on("get" /* CharacteristicEventTypes.GET */, this.getLockedOn.bind(this));
    }
    /**
     * Handle "SET" requests from HomeKit
     * These are sent when the user changes the state of an accessory, for example, turning on a Light bulb.
     */
    setLockedOn(value, callback) {
        if (!this.platform.isCurrentlyConnected()) {
            this.platform.recordAction(this.setLockedOn.bind(this, value));
            callback(this.platform.connectionProblem);
            return;
        }
        // Turn the switch on or off
        this.platform.spa.setIsLocked(this.entireSpa, value);
        this.platform.log.debug('Set Locked Spa', this.entireSpa ? 'Panel' : 'Settings', 'On ->', value);
        callback(null);
    }
    spaConfigurationKnown() {
        // nothing to do
    }
    // If Spa state has changed, for example using manual controls on the spa, then we must update Homekit.
    updateCharacteristics() {
        if (!this.platform.isCurrentlyConnected()) {
            this.service.getCharacteristic(this.platform.Characteristic.LockCurrentState).updateValue(this.platform.connectionProblem);
            this.service.getCharacteristic(this.platform.Characteristic.LockTargetState).updateValue(this.platform.connectionProblem);
            return;
        }
        const isLocked = this.platform.spa.getIsLocked(this.entireSpa);
        this.platform.log.debug('Locked Spa', this.entireSpa ? 'Panel' : 'Settings', 'updating to', isLocked ? 'On' : 'Off');
        this.service.getCharacteristic(this.platform.Characteristic.LockCurrentState).updateValue(isLocked);
        this.service.getCharacteristic(this.platform.Characteristic.LockTargetState).updateValue(isLocked);
    }
    /**
     * Handle the "GET" requests from HomeKit
     * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
  
     */
    getLockedOn(callback) {
        if (!this.platform.isCurrentlyConnected()) {
            callback(this.platform.connectionProblem);
        }
        else {
            const isLocked = this.platform.spa.getIsLocked(this.entireSpa);
            this.platform.log.debug('Get Locked Spa', this.entireSpa ? 'Panel' : 'Settings', 'On <-', isLocked, this.platform.status());
            callback(null, isLocked);
        }
    }
}
exports.LockAccessory = LockAccessory;
//# sourceMappingURL=lockAccessory.js.map