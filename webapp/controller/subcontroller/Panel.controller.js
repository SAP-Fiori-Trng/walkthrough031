sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/ui/core/format/NumberFormat"
],
  function (Controller, MessageToast, NumberFormat) {
    "use strict";
    var oCurrencyFormat = NumberFormat.getCurrencyInstance({
      currencyCode: false,
      decimals: 1,
      groupingSeparator: ".",
      decimalSeparator: ","
    });
    return Controller.extend("dw.ui5.walkthrough.08.controller.subcontroller.Panel", {
        onSayHelloPress: function () {
          this._oI18n = this.getOwnerComponent().getModel("i18n");
          this._oJSONModel = this.getOwnerComponent().getModel();
          const oResourceBundle = this._oI18n.getResourceBundle();
          let sRecipientName = this._oJSONModel.getProperty("/recipient/name");
          let sMsg = oResourceBundle.getText("helloMsg", [sRecipientName]);
          let nSalary = this._oJSONModel.getProperty("/userInfo/salary");
          let sUnit = this._oJSONModel.getProperty("/userInfo/unit");
          let sFmtSalary = oCurrencyFormat.format(nSalary, sUnit);
          MessageToast.show(sMsg + ", Salary: " + sFmtSalary);
          // sap.ui.getCore().getEventBus().publish("dw.ui5.walkthrough.08", "sayHello");
        }
      }
    );
  }
);
