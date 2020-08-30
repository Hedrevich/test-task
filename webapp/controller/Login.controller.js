sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox"
], function (BaseController, MessageBox) {
    "use strict";
    return BaseController.extend("sap.ui.user.management.system.controller.Login", {



        //on login button click
        onLoginTap: function () {
            var sName = this.getView().byId("loginNameID").getValue();

            this.oRouter = this.getRouter();
            //name cant be empty
            if (sName) {
                this.oRouter.navTo('TargetMasterPage');
                this.getView().byId("loginNameID").setValue("");
            } else {
                MessageBox.error(this.getResourceBundle().getText("loginError"));
            }

        }
    });
});
