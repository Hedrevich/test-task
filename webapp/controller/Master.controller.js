sap.ui.define([
    "./BaseController",
    "sap/ui/demo/basicTemplate/model/formatter"
], function(BaseController, formatter) {
    "use strict";

    return BaseController.extend("sap.ui.demo.basicTemplate.controller.Master", {
        formatter: formatter,

        onInit: function() {
            // var router = sap.ui.core.UIComponent.getRouterFor(this);
            // router.getRoute('TargetMasterPage').attachMatched(this._handleRouteMatched, this);
        },
    });
});