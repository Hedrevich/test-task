sap.ui.define([
    "./BaseController",
    "sap/ui/user/management/system/model/formatter",
    'sap/ui/model/json/JSONModel',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
], function (BaseController, formatter, JSONModel, MessageBox, MessageToast) {
    "use strict";

    //local model for project creation validation
    var oInitialCreationModelProperties = {
        _isValidForCreation: false
    };

    var LOCAL_MODEL_PATH = "sap/ui/user/mock/project.json";

    return BaseController.extend("sap.ui.user.management.system.controller.Master", {
        formatter: formatter,

        onInit: function () {

            //use mock data
            this.oModel = new JSONModel(sap.ui.require.toUrl(LOCAL_MODEL_PATH));

            this.getView().setModel(this.oModel);

            this.oViewModel = this.createJSONModel({
                itemsCount: 0,
                deleteButtonEnabled: false
            });

            //set up inital view state
            this.oCreationModel = new JSONModel(Object.assign({}, oInitialCreationModelProperties));

            this.setModel(this.oViewModel, "viewModel");
        },


        onNavBack: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteLogin");
        },


        onUpdateSchedulesFinished: function (oEvent) {
            this.oViewModel.setProperty("/itemsCount", oEvent.getParameter("total"));
        },



        onAddProjectButton: function () {
            if (!this.oCreateDialog) {
                this.oCreateDialog = sap.ui.xmlfragment(this.getView().getId(), "sap.ui.user.management.system.view.fragments.CreateProject", this);
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
            //set up initial view state
            this.oCreationModel.setData(Object.assign({}, oInitialCreationModelProperties));
            oCreationDialog.close();
        },



        onRequiredProjectCreationChange: function (oEvent) {
            //inputs validation
            var bCanCreateProject = this.oCreationNameInput.getValue().trim().length > 0 && this.oCreationStatusCombo.getValue().trim().length > 0;
            this.oCreationModel.setProperty("/_isValidForCreation", bCanCreateProject);
        },


        onSelectionChange: function (oEvent) {
            this.oViewModel.setProperty("/deleteButtonEnabled", oEvent.getParameter("selected"));
        },


        onCreateButtonPressed: function (oEvent) {

            // validate mandatory inputs
            var sProjectName = this.oCreationModel.getProperty("/name").trim();
            var sProjectStatus = this.oCreationModel.getProperty("/status").trim();
            var sProjectStatusDescription = this.oCreationModel.getProperty("/description")
                && this.oCreationModel.getProperty("/description").trim();

            //generate id( special case for our mock)
            var sProjectId = this.getCurrentLocalData().ProjectCollection.length+1;

            // all looks good, trying to create new project
            var oNewObject = {
                ProjectName: sProjectName,
                ProjectStatus: sProjectStatus,
                ProjectDescription: sProjectStatusDescription,
                ProjectID: sProjectId
            };

            //set Local data
            var oLocalData = this.getCurrentLocalData();
            oLocalData.ProjectCollection.push(oNewObject);
            this.setLocalData(oLocalData);

            //close Dialog
            this.onDialogCancel(oEvent);


        },


        onDeleteProjectButton: function(oEvent) {

            //confirmation message
            var oProjectTable = this.byId("idProjectsTable");
            var oConfirmationMsg = this.getResourceBundle().getText("projectDeletionConfirmation");

            MessageBox.confirm(oConfirmationMsg, {
                title: this.getResourceBundle().getText("confirmDeletion"),
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.OK) {

                        var aSelectedItems = oProjectTable.getSelectedItems();

                        //get current local data
                        var oCurrentLocalData = this.getCurrentLocalData();

                        //get inde seleted items(may be can simplifed)
                        var aIndexArray = [];

                        aSelectedItems.forEach((item,index)=>
                            {

                                aIndexArray.push(oProjectTable.indexOfItem(aSelectedItems[index]));
                            }
                        );
                        //sort
                        oCurrentLocalData.ProjectCollection.sort((a, b) => (a.ProjectID > b.ProjectID) ? 1 : -1);

                        //multiply remove
                        for (var i = aIndexArray.length -1; i >= 0; i--)
                            oCurrentLocalData.ProjectCollection.splice(aIndexArray[i],1);

                        //set to local data
                        this.setLocalData(oCurrentLocalData);

                        oProjectTable.removeSelections();

                        //rise message toast
                        var oDeletionMsg = this.getResourceBundle().getText("deletionSucceeded");
                        MessageToast.show(oDeletionMsg, {
                            duration: 3000
                        });
                        this.oViewModel.setProperty("/deleteButtonEnabled", false);
                    }
                }.bind(this)
            });
        },


        //navigation to detail page
        onProjectItemPress: function (oEvent) {
            var sProjectID = oEvent.getParameter("listItem").getBindingContext().getPath().split("/").pop();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("TargetDetailsPage", {
                sProjectId: sProjectID
            });
        }
    });
});
