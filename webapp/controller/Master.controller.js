sap.ui.define([
    "./BaseController",
    "sap/ui/demo/basicTemplate/model/formatter",
    'sap/ui/model/json/JSONModel',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
], function(BaseController, formatter, JSONModel, MessageBox, MessageToast) {
    "use strict";


    var oInitialCreationModelProperties = {
        _isValidForCreation: false
    };


    return BaseController.extend("sap.ui.demo.basicTemplate.controller.Master", {
        formatter: formatter,

        onInit: function() {

            this.oModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/mock/products.json"));

            this.getView().setModel(this.oModel);

            this.oViewModel = this.createJSONModel({
                itemsCount: 0,
                deleteButtonEnabled: false
            });

            this.oCreationModel = new JSONModel(Object.assign({}, oInitialCreationModelProperties));

            this.setModel(this.oViewModel, "viewModel");
        },



        onNavBack: function (oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteLogin");
        },

        /**
         * Triggered by the table's 'updateFinished' event
         * @param {sap.ui.base.Event} oEvent the update finished event
         */
        onUpdateSchedulesFinished: function (oEvent) {
            this.oViewModel.setProperty("/itemsCount", oEvent.getParameter("total"));
        },


        /**
         * called when a user wants to create a new connected system
         */
        onAddProjectButton: function () {

            //todo to base controller
            if (!this.oCreateDialog) {
                this.oCreateDialog = sap.ui.xmlfragment(this.getView().getId(), "sap.ui.demo.basicTemplate.view.fragments.CreateProject", this);
                this.oCreateDialog.setModel(this.oCreationModel, "ProjectForCreation");
                this.getView().addDependent(this.oCreateDialog);
                this.oCreationNameInput = this.byId("iCreateName");
                this.oCreationStatusCombo = this.byId("cbCreateStatus");
            }
            this.oCreateDialog.open();
        },


        /**
         * called when a user abort the creation workflow
         * @param {object} oEvent the press event
         */
        onDialogCancel: function (oEvent) {
            var oCreationDialog = oEvent.getSource().getParent();
            this.oCreationModel.setData(Object.assign({}, oInitialCreationModelProperties));
            oCreationDialog.close();
        },


        /**
         * Fired when the value of the connected system code or destination is changed by user interaction
         * @param {object} oEvent the change parameter
         */
        onRequiredProjectCreationChange: function (oEvent) {
            var bCanCreateProject = this.oCreationNameInput.getValue().trim().length > 0 && this.oCreationStatusCombo.getValue().trim().length > 0;
            this.oCreationModel.setProperty("/_isValidForCreation", bCanCreateProject);
        },


        //todo base
        onSelectionChange: function (oEvent) {
            this.oViewModel.setProperty("/deleteButtonEnabled", oEvent.getParameter("selected"));
        },



        onCreateButtonPressed: function (oEvent) {

            // validate mandatory inputs
            var sProjectName = this.oCreationModel.getProperty("/name").trim();
            var sProjectStatus = this.oCreationModel.getProperty("/status").trim();
            var sProjectStatusDescription = this.oCreationModel.getProperty("/description")
                && this.oCreationModel.getProperty("/description").trim();

            // all looks good, trying to create new project
            var oNewObject = {
                ProjectName: sProjectName,
                ProjectStatus: sProjectStatus,
                ProjectDescription: sProjectStatusDescription
            };

            //set Local data
            var oLocalData = this.oModel.getData();
            oLocalData.ProjectCollection.push(oNewObject);
            this.getModel().setData(oLocalData);

            //close Dialog
            this.onDialogCancel(oEvent);


        },


        onDeleteProjectButton: function(oEvent) {

            var oProjectTable = this.byId("idProjectsTable");
            var oConfirmationMsg = this.getResourceBundle().getText("projectDeletionConfirmation");

            MessageBox.confirm(oConfirmationMsg, {
                title: this.getResourceBundle().getText("confirmDeletion"),
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        //todo check for view
                        var aSelectedItems = oProjectTable.getSelectedItems();

                        aSelectedItems.forEach((item) => {oProjectTable.removeItem(item)});

                        var oDeletionMsg = this.getResourceBundle().getText("deletionSucceeded");
                            MessageToast.show(oDeletionMsg, {
                                duration: 3000
                            });
                            this.oViewModel.setProperty("/deleteButtonEnabled", false);
                    }
                }.bind(this)
            });
        },


        onProjectItemPress:function (oEvent) {
            //todo
            var sProjectID = oEvent.getParameter("listItem").getBindingContext().getPath().split("/").pop();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("TargetDetailsPage", {
                sProjectId: sProjectID
            });
        }
    });
});