sap.ui.define([], function () {
	"use strict";
	return {

		/**
		 * transform a status code to a valid ui5 ValueState
		 * @param {string} sColor The color, as a string
		 * @return {sap.ui.core.ValueState} Success or None
		 */
		statusColorToState: function (sColor) {
			switch (sColor) {
				case "Blocked":
					return sap.ui.core.ValueState.Error;
				case "In progress":
					return sap.ui.core.ValueState.Success;
				default:
					return sap.ui.core.ValueState.None;
			}
		},


	};
});