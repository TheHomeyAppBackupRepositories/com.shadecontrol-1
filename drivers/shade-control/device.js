'use strict';

const { ZigBeeDevice } = require("homey-zigbeedriver");
const { debug, CLUSTER } = require("zigbee-clusters");

class ShadeControl extends ZigBeeDevice {

  //   /**
  //    * onInit is called when the device is initialized.
  //    */
  async onNodeInit({ zclNode }) {
    // This value is set by the system set parser in order to know whether command was sent from
    // Homey
    this._reportDebounceEnabled = false;

    // this.enableDebug();
    // this.printNode();
    // debug(true);

    if (this.hasCapability('windowcoverings_set')) {
      // Set Position

      this.registerCapabilityListener('windowcoverings_set', async value => {
        this.log('go to lift percentage', (1 - value) * 100);
        await zclNode.endpoints[1].clusters[CLUSTER.WINDOW_COVERING.NAME].goToLiftPercentage({
          percentageLiftValue: (1 - value) * 100,
        });
      });



      zclNode.endpoints[1].clusters[CLUSTER.WINDOW_COVERING.NAME].on('attr.currentPositionLiftPercentage',
      this.onCurtainPositionAttrReport.bind(this));
    }

    if (this.hasCapability('measure_battery')) {
      this.registerCapability('measure_battery', CLUSTER.POWER_CONFIGURATION, {
        endpoint: 1,
        getOpts: {
          getOnStart: true,
        },
        reportOpts: {
          configureAttributeReporting: {
            minInterval: 0, // No minimum reporting interval
            maxInterval: 60, // Maximally every 1 hour
            minChange: 5, // Report when value changed by 5
          },
        },
      });
    }
  }




  onCurtainPositionAttrReport(data) {
    this.log('onCurtainPositionAttrReport (curtain position):', data, 1 - (data / 100));
    this.setCapabilityValue('windowcoverings_set', 1 - (data / 100)).catch(this.error);
  }
}



module.exports = ShadeControl;
