"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeatingReadySwitchAccessory = void 0;
const settings_1 = require("./settings");
/**
 * HeatingReadySwitchAccessory
 *
 * Turn 'Heating Always Ready' mode on ('Ready') or off ('Rest').
 */
class HeatingReadySwitchAccessory {
    constructor(platform, accessory) {
        var _a;
        this.platform = platform;
        this.accessory = accessory;
        // set accessory information
        this.accessory.getService(this.platform.Service.AccessoryInformation)
            .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Balboa')
            .setCharacteristic(this.platform.Characteristic.Model, this.platform.name)
            .setCharacteristic(this.platform.Characteristic.SerialNumber, settings_1.VERSION);
        this.service = (_a = this.accessory.getService(this.platform.Service.Switch)) !== null && _a !== void 0 ? _a : this.accessory.addService(this.platform.Service.Switch);
        // set the service name, this is what is displayed as the default name on the Home app
        // in this example we are using the name we stored in the `accessory.context` in the `discoverDevices` method.
        this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.name);
        // each service must implement at-minimum the "required characteristics" for the given service type
        // see https://developers.homebridge.io/#/service/Switch
        // register handlers for the On/Off Characteristic
        this.service.getCharacteristic(this.platform.Characteristic.On)
            .on("set" /* CharacteristicEventTypes.SET */, this.setOn.bind(this)) // SET - bind to the `setOn` method below
            .on("get" /* CharacteristicEventTypes.GET */, this.getOn.bind(this)); // GET - bind to the `getOn` method below
    }
    /**
     * Handle "SET" requests from HomeKit
     * These are sent when the user changes the state of an accessory, for example, turning on a Light bulb.
     */
    setOn(value, callback) {
        if (!this.platform.isCurrentlyConnected()) {
            this.platform.recordAction(this.setOn.bind(this, value));
            callback(this.platform.connectionProblem);
            return;
        }
        // Turn the switch on or off
        const isHeatingAlwaysReady = value;
        this.platform.spa.setHeatingModeAlwaysReady(isHeatingAlwaysReady);
        this.platform.log.debug('Set Heating Always Ready On ->', isHeatingAlwaysReady, 'which is', (isHeatingAlwaysReady ? 'Ready' : 'Rest'), 'mode');
        callback(null);
    }
    spaConfigurationKnown() {
        // nothing to do
    }
    // If Spa state has changed, for example using manual controls on the spa, then we must update Homekit.
    updateCharacteristics() {
        if (!this.platform.isCurrentlyConnected()) {
            this.service.getCharacteristic(this.platform.Characteristic.On).updateValue(this.platform.connectionProblem);
            return;
        }
        const isHeatingAlwaysReady = this.platform.spa.isHeatingModeAlwaysReady();
        this.platform.log.debug('Heating Always Ready updating to', isHeatingAlwaysReady ? 'On' : 'Off');
        this.service.getCharacteristic(this.platform.Characteristic.On).updateValue(isHeatingAlwaysReady);
    }
    /**
     * Handle the "GET" requests from HomeKit
     * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
     * @example
     * this.service.updateCharacteristic(this.platform.Characteristic.On, true)
     */
    getOn(callback) {
        if (!this.platform.isCurrentlyConnected()) {
            callback(this.platform.connectionProblem);
        }
        else {
            const isHeatingAlwaysReady = this.platform.spa.isHeatingModeAlwaysReady();
            this.platform.log.debug('Get Heating Always Ready On <-', isHeatingAlwaysReady, this.platform.status());
            callback(null, isHeatingAlwaysReady);
        }
    }
}
exports.HeatingReadySwitchAccessory = HeatingReadySwitchAccessory;
//# sourceMappingURL=heatingReadySwitchAccessory.js.map