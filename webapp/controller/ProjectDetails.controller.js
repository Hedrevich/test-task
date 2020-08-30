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
			this.oModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/mock/project.json"));
			this.getView().setModel(this.oModel);
			var oRouter = this.getRouter();

			oRouter.getRoute("TargetDetailsPage").attachMatched(this._onRouteMatched, this);


			this.oViewModel = this.createJSONModel({
				isEditMode:false,
				sUnassignedPersons: [],
				sNewMemberKey:"",
				sNewProjectStatusKey:"",
				onDeleteMemberButtonEnabled:false
			});

			this.setModel(this.oViewModel, "viewModel");
		},

		_onRouteMatched : function (oEvent) {

			this.sProjectId = oEvent.getParameter("arguments").sProjectId;
			this.getView().bindElement({
				path : "/ProjectCollection/" + this.sProjectId
			});
		},

		onDragStart: function(oEvent) {
			var oDraggedRow = oEvent.getParameter("target");
			var oDragSession = oEvent.getParameter("dragSession");

			// keep the dragged row context for the drop action
			oDragSession.setComplexData("draggedRowContext", oDraggedRow.getBindingContext());
		},

		onDropProjectTaskTable: function(oEvent) {
			var oDragSession = oEvent.getParameter("dragSession");
			var oDraggedRowContext = oDragSession.getComplexData("draggedRowContext");
			if (!oDraggedRowContext) {
				return;
			}
			var oDroppedRow = oEvent.getParameter("droppedControl");
			var aPathValues = oDroppedRow.getBindingContext().getPath().split("/");

			var sTaskId = aPathValues[4];


			var oLocalData = this.getCurrentLocalData()
			oLocalData.ProjectCollection[this.sProjectId].Tasks[sTaskId].Members = [oDraggedRowContext.getObject()];

			this.setLocalData(oLocalData);
		},

		onAddMemberButton:function (oEvent) {

			//todo check for base controller

			var aProjectMembers = oEvent.getSource().getBindingContext().getProperty("Members");
			var aAllMembers = this.getModel().getProperty("/ProjectMembersCollection");


			//todo coment
			var aFreePersons = aAllMembers.filter(function(oMember) {
				return !aProjectMembers.find(function(assingedMember) {
					return assingedMember.MemberID === oMember.MemberID
				})
			});

			this.oViewModel.setProperty("/sUnassignedPersons", aFreePersons);

			if (!this.oCreateDialog) {
				this.oCreateDialog = sap.ui.xmlfragment(this.getView().getId(), "sap.ui.demo.basicTemplate.view.fragments.AddProjectMember", this);
				this.oCreateDialog.setModel(this.oViewModel, "MemberForCreation");
				this.getView().addDependent(this.oCreateDialog);
			}
			this.oCreateDialog.open();
		},


		onAddMemberButtonPressed:function (oEvent) {

			var sSelectedMemberKey = this.oViewModel.getProperty("/sNewMemberKey");
			var oSelectedMemberObject = this.oViewModel.getProperty("/sUnassignedPersons").find(oUnassignedPerson=>oUnassignedPerson.MemberID === sSelectedMemberKey);

			var oLocalData = this.getCurrentLocalData();
			oLocalData.ProjectCollection[this.sProjectId].Members.push(oSelectedMemberObject);
			this.setLocalData(oLocalData);
			this.oViewModel.setProperty("/sNewMemberKey","")
			this.onDialogCancel(oEvent);
		},

		onDialogCancel: function (oEvent) {
			var oCreationDialog = oEvent.getSource().getParent();
			oCreationDialog.close();
		},

		onSelectionChange: function (oEvent) {
			this.oViewModel.setProperty("/onDeleteMemberButtonEnabled", oEvent.getParameter("selected"));
		},

		onDeleteMemberButton:function (oEvent) {

			var oProjectMemberTable = this.byId("idLineMembersList");

			var sSelectedIndex = oProjectMemberTable.indexOfItem(oProjectMemberTable.getSelectedItem());
			var oCurrentLocalData = this.getCurrentLocalData();
			oCurrentLocalData.ProjectCollection[this.sProjectId].Members.splice(sSelectedIndex, 1);

			oProjectMemberTable.setLocalData(oCurrentLocalData);


		},

		onEditPress: function () {

			this.getView().byId("ObjectPageLayout").setSelectedSection(this.getView().byId("HeaderSection"));
			this._setEditMode(true);
		},



		onCancelPress: function () {
			this._setEditMode(false);
		},


		//save on footer
		onSaveButtonPress: function (oEvent) {


			var aAllProjectStatuses = this.getModel().getProperty("/ProjectStatusCollection");
			var sProjectStatusKey = this.oViewModel.getProperty("/sNewProjectStatusKey");

			var sProjectStatus = aAllProjectStatuses.find(function(oProjectStatus) {
				return (oProjectStatus.StatusID === sProjectStatusKey) || ""
			});

			var oCurrentLocalData = this.getCurrentLocalData(this.oModel)

			//todo on oCurrentLocalData.ProjectCollection[this.sProjectId]

			oCurrentLocalData.ProjectCollection[this.sProjectId].ProjectStatus = sProjectStatus ? sProjectStatus.Name : "";

			this.setLocalData(oCurrentLocalData);


			this._setEditMode(false);
		},

		onNavBack: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("TargetMasterPage");
		},


        //todo clrt_alt_l
		_setEditMode: function (isEdit) {
			this.oViewModel.setProperty("/isEditMode", isEdit);
		},

	});
});
