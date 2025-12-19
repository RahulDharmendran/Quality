sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, MessageToast, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("qualityportal.controller.View1", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteView1").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            this._loadDashboardCounts();
        },

        _loadDashboardCounts: function () {
            var sPlantId = localStorage.getItem("PlantId");
            if (!sPlantId) return;

            var oModel = this.getOwnerComponent().getModel();
            var oDashboardModel = new sap.ui.model.json.JSONModel({
                inspectionCount: 0,
                resultsCount: 0,
                decisionCount: 0
            });
            this.getView().setModel(oDashboardModel, "dashboard");

            var aFilters = [new Filter("Plant", FilterOperator.EQ, sPlantId)];

            // Count Inspections
            oModel.read("/ZRD_QP_INSPECTIONSet", {
                filters: aFilters,
                success: function (oData) {
                    oDashboardModel.setProperty("/inspectionCount", oData.results.length);
                }
            });

            // Count Results
            oModel.read("/ZRD_QP_RESULT_RECORDSSet", {
                filters: aFilters,
                success: function (oData) {
                    oDashboardModel.setProperty("/resultsCount", oData.results.length);
                }
            });

            // Count Usage Decisions
            oModel.read("/ZRD_QP_USAGE_DECISIONSet", {
                filters: aFilters,
                success: function (oData) {
                    oDashboardModel.setProperty("/decisionCount", oData.results.length);
                }
            });
        },

        onInspectionLotPress: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteInspectionLot");
        },

        onResultRecordsPress: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteResultRecords");
        },

        onUsageDecisionPress: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteUsageDecision");
        }
    });
});