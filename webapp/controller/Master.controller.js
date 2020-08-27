sap.ui.define([
    "./BaseController",
    "sap/ui/demo/basicTemplate/model/formatter",
    'sap/ui/model/json/JSONModel'
], function(BaseController, formatter, JSONModel) {
    "use strict";

    return BaseController.extend("sap.ui.demo.basicTemplate.controller.Master", {
        formatter: formatter,

        onInit: function() {
            var oModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/mock/products.json"));
            this.getView().setModel(oModel);
        },

        onNavBack: function (oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteLogin");
        }
    });
});