sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, MessageToast, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("qualityportal.controller.View1", {
        onInit() {
            this._fetchInspectionDetails();
        },

        _fetchInspectionDetails: function () {
            var sPlantId = localStorage.getItem("PlantId");
            if (!sPlantId) {
                MessageToast.show("No Plant ID found. Please login again.");
                return;
            }

            var oModel = this.getOwnerComponent().getModel();
            var that = this;

            // Inspection URI: /ZRD_QP_INSPECTIONSet?$filter=Plant eq '0001'
            var aFilters = [];
            aFilters.push(new Filter("Plant", FilterOperator.EQ, sPlantId));

            oModel.read("/ZRD_QP_INSPECTIONSet", {
                filters: aFilters,
                success: function (oData) {
                    // Logic to handle success (e.g. store in a JSON model for the view or just log)
                    // For now, we just acknowledge receipt as the user didn't specify WHERE to show the data, just to fetch it.
                    // We could potentially update tile counts here.
                    console.log("Inspection details fetched successfully", oData);
                    MessageToast.show("Inspection details fetched for Plant " + sPlantId);
                },
                error: function (oError) {
                    console.error("Error fetching inspection details", oError);
                }
            });
        },

        onInspectionLotPress: function () {
            MessageToast.show("Navigating to Inspection Lots...");
        },

        onResultRecordsPress: function () {
            MessageToast.show("Navigating to Result Records...");
        },

        onUsageDecisionPress: function () {
            MessageToast.show("Navigating to Usage Decisions...");
        }
    });
});