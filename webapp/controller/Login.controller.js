sap.ui.define([
	"./BaseController",
	"sap/m/MessageBox",
	"sap/ui/demo/basicTemplate/model/formatter"
], function(BaseController,MessageBox, formatter) {
	"use strict";
	return BaseController.extend("sap.ui.demo.basicTemplate.controller.Login", {

		onLoginTap:function(){
			var sName = this.getView().byId("loginNameID").getValue();


			// Customer number and customer order identification
			this.oRouter = this.getRouter();
			if (sName) {
				this.oRouter.navTo('TargetMasterPage', {
					sName: sName
				});
				this.getView().byId("loginNameID").setValue("");
			} else {
				MessageBox.error(this.getResourceBundle().getText("loginError"));
			}

		}
	});
});
