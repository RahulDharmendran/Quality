sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, MessageToast, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("qualityportal.controller.View1", {
        onInit: function () {
            // No automated fetch here
        },

        onInspectionLotPress: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteInspectionLot");
        },

        onResultRecordsPress: function () {
            MessageToast.show("Navigating to Result Records...");
        },

        onUsageDecisionPress: function () {
            MessageToast.show("Navigating to Usage Decisions...");
        }
    });
});