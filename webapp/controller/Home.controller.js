sap.ui.define([
	"./BaseController",
	"sap/ui/demo/basicTemplate/model/formatter"
], function(BaseController, formatter) {
	"use strict";
	return BaseController.extend("sap.ui.demo.basicTemplate.controller.App", {

		onLoginTap:function(){
			var sName = this.getView().byId("loginNameID").getValue();
			var sPassword = this.getView().byId("loginNamePassword").getValue();


			// Customer number and customer order identification
			this.oRouter = this.getRouter();
			if (sName==='test' && sPassword==='') {
				this.oRouter.navTo('TargetMasterPage', {
					sName: sName
				});
			} else {
				alert('Fail to connect wrong customer number or customer order');
			}

		}
	});
});
