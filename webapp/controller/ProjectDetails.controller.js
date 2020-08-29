sap.ui.define([
	"./BaseController",
	"sap/ui/demo/basicTemplate/model/formatter",
	'sap/ui/model/json/JSONModel'
], function(BaseController, formatter,JSONModel) {
	"use strict";

	return BaseController.extend("sap.ui.demo.basicTemplate.controller.App", {

		formatter: formatter,

		onInit: function () {

			//TODO move to on init
			this.oModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/mock/products.json"));

			// this.getView().setModel(this.oModel, "DetailModel");
			this.getView().setModel(this.oModel);
			var oRouter = this.getRouter();

			oRouter.getRoute("TargetDetailsPage").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched : function (oEvent) {

			var oArgs = oEvent.getParameter("arguments");
			this.getView().bindElement({
				path : "/ProjectCollection/" + oArgs.sProjectId
			});
		},

		onDragStart: function(oEvent) {
			var oDraggedRow = oEvent.getParameter("target");
			var oDragSession = oEvent.getParameter("dragSession");

			// keep the dragged row context for the drop action
			oDragSession.setComplexData("draggedRowContext", oDraggedRow.getBindingContext());
		},

		onDropTable2: function(oEvent) {
			var oDragSession = oEvent.getParameter("dragSession");
			var oDraggedRowContext = oDragSession.getComplexData("draggedRowContext");
			if (!oDraggedRowContext) {
				return;
			}
			var oDroppedRow = oEvent.getParameter("droppedControl");
			var aPathValues = oDroppedRow.getBindingContext().getPath().split("/");
			var sProjectId = aPathValues[2];
			var sTaskId = aPathValues[4];
			var oLocalData = this.oModel.getData();
			oLocalData.ProjectCollection[sProjectId].Tasks[sTaskId].Members = [oDraggedRowContext.getObject()];
			this.getModel().setData(oLocalData);
		},
	});
});