sap.ui.define([], function () {
	"use strict";
	return {

		/**
		 * transform a status code to a valid ui5 ValueState
		 * @param {string} sColor The color, as a string
		 * @return {sap.ui.core.ValueState} Success or None
		 */
		statusProjectColorToState: function (sColor) {
			switch (sColor) {
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
		 * @param {string} sColor The color, as a string
		 * @return {sap.ui.core.ValueState} Success or None
		 */
		statusTaskColorToState: function (sColor) {
			switch (sColor) {
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
		 * @param {string} sColor The color, as a string
		 * @return {sap.ui.core.ValueState} Success or None
		 */
		statusToStateFormatter: function (sColor) {
			if(!sColor){
				return sap.ui.core.ValueState.Warning;
			}
		},


	};
});