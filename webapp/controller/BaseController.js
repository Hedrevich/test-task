sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    'sap/ui/model/json/JSONModel'
], function (Controller, UIComponent, JSONModel) {
    "use strict";

    return Controller.extend("sap.ui.user.management.system.controller.BaseController", {


        /**
         * Convenience method for accessing the router.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },


        /**
         * Getter for the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
         */
        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        /**
         * Convenience method for creting the JSON model.
         * @public
         * @param {object} [oData] data object
         * @returns {sap.ui.model.Model} the model instance
         */
        createJSONModel: function (oData) {
            return new JSONModel(oData);
        },

        /**
         * Convenience method for setting the view model.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.mvc.View} the view instance
         */
        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        /**
         * Convenience method for getting the view model by name.
         * @public
         * @param {string} [sName] the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel: function (sName) {
            return this.getView().getModel(sName);
        },


        /**
         * Convenience method for getting current local data
         * @returns {object}
         */
        getCurrentLocalData: function () {
            return this.oModel.getData();
        },

        /**
         * @public
         * Convenience method for setting data to local model
         * @param oLocalData local Data object
         */
        setLocalData: function (oLocalData) {
            this.getModel().setData(oLocalData);
        },

        /**
         * update Counter for table
         * @param {objcet} oEvent
         * @param {string} sProperty
         */
        onUpdateTableCounter: function (oEvent, sProperty) {
            this.oViewModel.setProperty("/" + sProperty + "", oEvent.getParameter("total"));
        },
    });
});
