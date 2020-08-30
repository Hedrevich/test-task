sap.ui.define([
    "./BaseController",
    "sap/ui/user/management/system/model/formatter"
], function (BaseController, formatter) {
    "use strict";

    return BaseController.extend("sap.ui.user.management.system.controller.App", {

        formatter: formatter,

        onInit: function () {

        }
    });
});
