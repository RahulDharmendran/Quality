sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/VBox",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, History, Filter, FilterOperator, Dialog, Button, Label, Input, VBox, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("qualityportal.controller.ResultRecords", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteResultRecords").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function () {
            var sPlantId = localStorage.getItem("PlantId");
            if (sPlantId) {
                var oTable = this.byId("resultRecordsTable");
                var oBinding = oTable.getBinding("items");
                var aFilters = [new Filter("Plant", FilterOperator.EQ, sPlantId)];
                oBinding.filter(aFilters);
            }
        },

        onRecordPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oContext = oItem.getBindingContext();
            var sPrueflos = oContext.getProperty("Prueflos");
            // Assuming we work with the Lot context to check Status
            var oModel = this.getView().getModel();

            // Fetch Inspection Lot details to check Usage Decision status
            // We use standard OData read.
            var sPath = "/ZRD_QP_INSPECTIONSet('" + sPrueflos + "')";

            var that = this;
            oModel.read(sPath, {
                success: function (oData) {
                    that._openRecordingDialog(oData);
                },
                error: function () {
                    MessageToast.show("Error fetching Lot details.");
                }
            });
        },

        _openRecordingDialog: function (oLotData) {
            var bDecisionTaken = !!oLotData.UsageDecisionCode;

            // Mocking current recorded values if not in OData. 
            // In a real scenario, this would come from the backend.
            // We'll store them in a local model for the dialog.
            var oRecordModel = new sap.ui.model.json.JSONModel({
                Unrestricted: oLotData.UnrestrictedStock || 0,
                Blocked: oLotData.BlockStock || 0,
                Production: oLotData.ProductionStock || 0,
                ReadOnly: bDecisionTaken,
                Prueflos: oLotData.Prueflos,
                LotQuantity: oLotData.LotQuantity
            });

            var oDialog = new Dialog({
                title: "Result Recording: " + oLotData.Prueflos,
                content: [
                    new VBox({
                        items: [
                            new Label({ text: "Unrestricted Stock" }),
                            new Input({ value: "{local>/Unrestricted}", type: "Number", editable: "{= !${local>/ReadOnly} }" }),
                            new Label({ text: "Block Stock" }),
                            new Input({ value: "{local>/Blocked}", type: "Number", editable: "{= !${local>/ReadOnly} }" }),
                            new Label({ text: "Production Stock" }),
                            new Input({ value: "{local>/Production}", type: "Number", editable: "{= !${local>/ReadOnly} }" })
                        ]
                    }).addStyleClass("sapUiSmallMargin")
                ],
                beginButton: new Button({
                    text: bDecisionTaken ? "Close" : "Save",
                    press: function () {
                        if (!bDecisionTaken) {
                            // Save logic
                            MessageToast.show("Results Saved (Simulated)");
                            // In real OData, we'd update here.
                        }
                        oDialog.close();
                    }
                }),
                endButton: new Button({
                    text: "Cancel",
                    visible: !bDecisionTaken,
                    press: function () {
                        oDialog.close();
                    }
                }),
                afterClose: function () {
                    oDialog.destroy();
                }
            });

            oDialog.setModel(oRecordModel, "local");
            this.getView().addDependent(oDialog);
            oDialog.open();
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteView1", {}, true);
            }
        }
    });
});
