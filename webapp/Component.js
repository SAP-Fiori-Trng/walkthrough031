sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
  ],
  function (UIComponent, JSONModel, Device) {
    "use strict";
    return UIComponent.extend("dw.ui5.walkthrough.08.Component", {
      metadata: {
        interfaces: ["sap.ui.core.IAsyncContentCreation"],
        manifest: "json",
      },
      init: function () {
        // call the init function of the parent
        UIComponent.prototype.init.apply(this, arguments);

        // set device model
        const oDeviceModel = new JSONModel(Device);
        oDeviceModel.setDefaultBindingMode("OneWay");
        this.setModel(oDeviceModel, "device");

        // set data model
        const oData = {
          recipient: {
            name: "Dialog and Fragments"
          },
          userInfo: {
            fullName: "",
            salary: 15800.7856,
            unit: "USD"
          }
        };
        const oModel = new JSONModel(oData);
        this.setModel(oModel);
      }
    });
  }
);