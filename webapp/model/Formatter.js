sap.ui.define([], function() {
	"use strict";
	return  {
        statusText: function(sStatus) {
			const oI18n = this.getOwnerComponent().getModel("i18n");
			const oResourceBundle = oI18n.getResourceBundle();
			switch (sStatus) {
				case false:
					return oResourceBundle.getText("availableTxt");
				case true:
					return oResourceBundle.getText("notAvailableTxt");
				default:
					return "--";
			}
		}
	};
});