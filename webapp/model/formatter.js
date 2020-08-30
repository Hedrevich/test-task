sap.ui.define([], function () {
	"use strict";
	return {

		/**
		 * transform a status code to a valid ui5 ValueState
		 * @param {string} the status
		 * @return {sap.ui.core.ValueState} Success or None
		 */
		statusProjectColorToState: function (sStatus) {
			switch (sStatus) {
				case "Blocked":
					return sap.ui.core.ValueState.Error;
				case "In progress":
					return sap.ui.core.ValueState.Success;
				default:
					return sap.ui.core.ValueState.None;
			}
		},


		/**
		 * transform a task status to a valid ui5 ValueState
		 * @param {string} sStatus the status
		 * @return {sap.ui.core.ValueState} Success or None
		 */
		statusTaskColorToState: function (sStatus) {
			switch (sStatus) {
				case "Open":
					return sap.ui.core.ValueState.Warning;
				case "In progress":
					return sap.ui.core.ValueState.Information;
				case "Done":
					return sap.ui.core.ValueState.Success;
				case "Cancelled":
					return sap.ui.core.ValueState.Error;
				default:
					return sap.ui.core.ValueState.None;
			}
		},

		/**
		 * transform assigned person value to a valid ui5 ValueState
		 * @param {string} sStatus the status
		 * @return {sap.ui.core.ValueState} Success or None
		 */
		statusToStateFormatter: function (sStatus) {
			if(!sStatus){
				return sap.ui.core.ValueState.Warning;
			}
		},


	};
});
