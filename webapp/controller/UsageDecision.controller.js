sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, History, Filter, FilterOperator) {
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
