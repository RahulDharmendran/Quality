sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/VBox",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, History, Filter, FilterOperator, Dialog, Button, Label, Text, VBox, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("qualityportal.controller.UsageDecision", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteUsageDecision").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function () {
            var sPlantId = localStorage.getItem("PlantId");
            if (sPlantId) {
                var oTable = this.byId("usageDecisionTable");
                var oBinding = oTable.getBinding("items");
                var aFilters = [new Filter("Plant", FilterOperator.EQ, sPlantId)];
                oBinding.filter(aFilters);
            }
        },

        onDecisionPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oContext = oItem.getBindingContext();
            var sPrueflos = oContext.getProperty("Prueflos");
            var oModel = this.getView().getModel();

            // Use Filter instead of Key access because GET_ENTITY is not implemented
            var aFilters = [new Filter("Prueflos", FilterOperator.EQ, sPrueflos)];

            var that = this;
            oModel.read("/ZRD_QP_INSPECTIONSet", {
                filters: aFilters,
                success: function (oData) {
                    if (oData.results && oData.results.length > 0) {
                        that._openDecisionDialog(oData.results[0]);
                    } else {
                        MessageToast.show("Inspection Lot details not found.");
                    }
                },
                error: function () {
                    MessageToast.show("Error fetching Lot details.");
                }
            });
        },

        _openDecisionDialog: function (oLotData) {
            // Check totals
            var fTotalLot = parseFloat(oLotData.LotQuantity || 0);

            // Assuming we somehow got the recorded stats. 
            // In absence of real fields, we simulate satisfying the condition for Demo, 
            // or fail it if 0.
            // Using placeholder logic: Inspecting *ResultRecords* is complex async.
            // We will prompt user or assume fields UnrestrictedStock etc exist on Lot entity for validation.
            var fRecorded = (parseFloat(oLotData.UnrestrictedStock || 0) +
                parseFloat(oLotData.BlockStock || 0) +
                parseFloat(oLotData.ProductionStock || 0));

            // For demo purposes, we will mock the check if fields are missing
            if (isNaN(fRecorded) || fRecorded === 0) {
                // Try to fallback or just warn
                // console.warn("Stock fields missing, assuming 0");
            }

            // CASE 1: Mismatch
            if (fRecorded !== fTotalLot) {
                MessageBox.error("Lot quantity (" + fTotalLot + ") does not match inspected quantity (" + fRecorded + "). Cannot make decision.");
                return;
            }

            // CASE 2: Match
            var oDialog = new Dialog({
                title: "Usage Decision: " + oLotData.Prueflos,
                content: [
                    new VBox({
                        items: [
                            new Label({ text: "All quantities match. Please select a decision." }),
                            new Text({ text: "Lot Qty: " + fTotalLot })
                        ]
                    }).addStyleClass("sapUiSmallMargin")
                ],
                buttons: [
                    new Button({
                        text: "Approve",
                        type: "Accept",
                        press: function () {
                            MessageToast.show("Decision Approved (Simulated)");
                            // Call OData update UsageDecisionCode = 'A'
                            oDialog.close();
                        }
                    }),
                    new Button({
                        text: "Reject",
                        type: "Reject",
                        press: function () {
                            MessageToast.show("Decision Rejected (Simulated)");
                            // Call OData update UsageDecisionCode = 'R'
                            oDialog.close();
                        }
                    }),
                    new Button({
                        text: "Cancel",
                        press: function () {
                            oDialog.close();
                        }
                    })
                ],
                afterClose: function () {
                    oDialog.destroy();
                }
            });

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
