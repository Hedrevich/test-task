sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter",
], function (Controller, formatter) {
    "use strict";

    return Controller.extend("sap.ui.demo.basicTemplate.controller.Master", {
        formatter: formatter,

        onInit: function() {
            // var router = sap.ui.core.UIComponent.getRouterFor(this);
            // router.getRoute('TargetMasterPage').attachMatched(this._handleRouteMatched, this);
        },
    });
});