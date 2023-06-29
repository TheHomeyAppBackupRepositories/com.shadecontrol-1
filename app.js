'use strict';

const Homey = require('homey');
const { debug } = require('zigbee-clusters');


// Enable zigbee-cluster logging
debug(false);

class MyApp extends Homey.App {

  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    }
}

module.exports = MyApp;
