sap.ui.define([
	"./BaseController",
	"sap/ui/demo/basicTemplate/model/formatter"
], function(BaseController, formatter) {
	"use strict";

	return BaseController.extend("sap.ui.demo.basicTemplate.controller.App", {

		formatter: formatter,

		onInit: function () {

		}
	});
});