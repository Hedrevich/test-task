sap.ui.define([
    "./BaseController",
    "sap/ui/demo/basicTemplate/model/formatter"
], function(BaseController, formatter) {
    "use strict";

    return BaseController.extend("sap.ui.demo.basicTemplate.controller.Master", {
        formatter: formatter,

        onInit: function() {
            // this.oRouter = this.getRouter();
            // this.oRouter.getRoute('TargetMasterPage').attachMatched(this._handleRouteMatched, this);
        },

        onNavBack: function (oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteLogin");
        }
    });
});