sap.ui.define([
	"sap/ui/core/mvc/Controller",
],  function (Controller) {
	"use strict";
	return Controller.extend("sap.ui.demo.basicTemplate.controller.App", {

		onLoginTap:function(){
			var sName = this.getView().byId("loginNameID").getValue();
			var sPassword = this.getView().byId("loginNamePassword").getValue();


			// Customer number and customer order identification
			var router = this.getOwnerComponent().getRouter();
			if (sName==='' && sPassword==='') {
				router.navTo('TargetMasterPage', {
					sName: sName
				});
			} else {
				alert('Fail to connect wrong customer number or customer order');
			}

		}
	});
});
