sap.ui.define([
    "./BaseController",
    "sap/ui/user/management/system/model/formatter",
    'sap/ui/model/json/JSONModel'
], function (BaseController, formatter, JSONModel) {
    "use strict";


    var LOCAL_MODEL_PATH = "sap/ui/user/mock/project.json";

    return BaseController.extend("sap.ui.user.management.system.controller.App", {

        formatter: formatter,

        onInit: function () {


            this.oModel = new JSONModel(sap.ui.require.toUrl(LOCAL_MODEL_PATH));
            this.getView().setModel(this.oModel);
            var oRouter = this.getRouter();

            oRouter.getRoute("TargetDetailsPage").attachMatched(this._onRouteMatched, this);

            //view model
            this.oViewModel = this.createJSONModel({
                isEditMode: false,
                sUnassignedPersons: [],
                sNewMemberKey: "",
                sNewProjectStatusKey: "",
                onDeleteMemberButtonEnabled: false,
                memberListItemsCount: 0,
                taskListItemsCount: 0
            });

            this.setModel(this.oViewModel, "viewModel");
        },

        _onRouteMatched: function (oEvent) {

            this.sProjectId = oEvent.getParameter("arguments").sProjectId;
            this.getView().bindElement({
                path: "/ProjectCollection/" + this.sProjectId
            });
        },

        //start drag row from member table
        onDragStart: function (oEvent) {
            var oDraggedRow = oEvent.getParameter("target");
            var oDragSession = oEvent.getParameter("dragSession");

            // keep the dragged row context for the drop action
            oDragSession.setComplexData("draggedRowContext", oDraggedRow.getBindingContext());
        },

        //drop on task table
        onDropProjectTaskTable: function (oEvent) {
            var oDragSession = oEvent.getParameter("dragSession");
            var oDraggedRowContext = oDragSession.getComplexData("draggedRowContext");
            if (!oDraggedRowContext) {
                return;
            }
            var oDroppedRow = oEvent.getParameter("droppedControl");
            var aPathValues = oDroppedRow.getBindingContext().getPath().split("/");

            var sTaskId = aPathValues[4];

            //change member
            var oLocalData = this.getCurrentLocalData();
            oLocalData.ProjectCollection[this.sProjectId].Tasks[sTaskId].Members = [oDraggedRowContext.getObject()];

            this.setLocalData(oLocalData);
        },

        onAddMemberButton: function (oEvent) {

            var aProjectMembers = oEvent.getSource().getBindingContext().getProperty("Members");
            var aAllMembers = this.getModel().getProperty("/ProjectMembersCollection");


            var aFreePersons = aAllMembers;
            //to project can be assigned only free persons(not-assigned)
            //need check only if assigned persons exist
            if (aProjectMembers) {
                 aFreePersons = aAllMembers.filter(function (oMember) {
                    return !aProjectMembers.find(function (assingedMember) {
                        return assingedMember.MemberID === oMember.MemberID;
                    });
                });
            }


            this.oViewModel.setProperty("/sUnassignedPersons", aFreePersons);

            if (!this.oCreateDialog) {
                this.oCreateDialog = sap.ui.xmlfragment(this.getView().getId(), "sap.ui.user.management.system.view.fragments.AddProjectMember", this);
                this.oCreateDialog.setModel(this.oViewModel, "MemberForCreation");
                this.getView().addDependent(this.oCreateDialog);
            }
            this.oCreateDialog.open();
        },


        onAddMemberButtonPressed: function (oEvent) {

            var sSelectedMemberKey = this.oViewModel.getProperty("/sNewMemberKey");
            //to project can be assigned only free persons(not-assigned)
            var oSelectedMemberObject = this.oViewModel.getProperty("/sUnassignedPersons").find(oUnassignedPerson => oUnassignedPerson.MemberID === sSelectedMemberKey);

            var oLocalData = this.getCurrentLocalData();
            oLocalData.ProjectCollection[this.sProjectId].Members.push(oSelectedMemberObject);
            this.setLocalData(oLocalData);
            this.oViewModel.setProperty("/sNewMemberKey", "");
            this.onDialogCancel(oEvent);
        },

        onDialogCancel: function (oEvent) {
            var oCreationDialog = oEvent.getSource().getParent();
            oCreationDialog.close();
        },

        onSelectionChange: function (oEvent) {
            this.oViewModel.setProperty("/onDeleteMemberButtonEnabled", oEvent.getParameter("selected"));
        },

        onDeleteMemberButton: function (oEvent) {

            var oProjectMemberTable = this.byId("idLineMembersList");

            var sSelectedIndex = oProjectMemberTable.indexOfItem(oProjectMemberTable.getSelectedItem());
            var oCurrentLocalData = this.getCurrentLocalData();

            //current members at project
            var aCurrentMembers =  oCurrentLocalData.ProjectCollection[this.sProjectId].Members;

            //sort by id
            aCurrentMembers.sort((a,b) => (a.MemberID > b.MemberID) ? 1 : ((b.MemberID > a.MemberID) ? -1 : 0));
            aCurrentMembers.splice(sSelectedIndex, 1);

            oCurrentLocalData.ProjectCollection[this.sProjectId].Members = aCurrentMembers;

            this.setLocalData(oCurrentLocalData);

            oProjectMemberTable.removeSelections();


        },

        onEditPress: function () {
            this.getView().byId("ObjectPageLayout").setSelectedSection(this.getView().byId("HeaderSection"));
            this._setEditMode(true);
        },


        onCancelPress: function () {
            this._setEditMode(false);
        },

        onUpdateMembersTable: function (oEvent) {
            this.onUpdateTableCounter(oEvent, "memberListItemsCount");
        },


        onUpdateTasksTable: function (oEvent) {
            this.onUpdateTableCounter(oEvent, "taskListItemsCount");
        },



        //save on footer
        onSaveButtonPress: function (oEvent) {

            var aAllProjectStatuses = this.getModel().getProperty("/ProjectStatusCollection");
            var sProjectStatusKey = this.oViewModel.getProperty("/sNewProjectStatusKey");

            //if no status id(free text) return empty
            var sProjectStatus = aAllProjectStatuses.find(function (oProjectStatus) {
                return (oProjectStatus.StatusID === sProjectStatusKey) || "";
            });

            var oCurrentLocalData = this.getCurrentLocalData(this.oModel);

            oCurrentLocalData.ProjectCollection[this.sProjectId].ProjectStatus = sProjectStatus ? sProjectStatus.Name : "";

            this.setLocalData(oCurrentLocalData);


            this._setEditMode(false);
        },

        onNavBack: function (oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("TargetMasterPage");
        },

        _setEditMode: function (isEdit) {
            this.oViewModel.setProperty("/isEditMode", isEdit);
        },

    });
});
