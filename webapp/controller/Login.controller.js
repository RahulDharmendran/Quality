sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, MessageToast, MessageBox, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("qualityportal.controller.Login", {
        onInit: function () {
            // Clear storage on load if needed or check session
        },

        onLoginPress: function () {
            var oUserIdInput = this.byId("userIdInput");
            var oPasswordInput = this.byId("passwordInput");
            var sUserId = oUserIdInput.getValue();
            var sPassword = oPasswordInput.getValue();

            if (!sUserId || !sPassword) {
                MessageToast.show("Please enter both User ID and Password.");
                return;
            }

            var oModel = this.getOwnerComponent().getModel();
            var that = this;

            // Construct the path for Login
            // Pattern: /ZRD_QP_LOGINSet(UserId='...',Password='...')
            var sPath = "/ZRD_QP_LOGINSet(UserId='" + sUserId + "',Password='" + sPassword + "')";

            sap.ui.core.BusyIndicator.show();

            oModel.read(sPath, {
                success: function (oData) {
                    if (oData) {
                        // Login successful, now fetch Plant ID
                        that._fetchPlantDetails(sUserId);
                    } else {
                         sap.ui.core.BusyIndicator.hide();
                         MessageBox.error("Invalid credentials.");
                    }
                },
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    try {
                        var oResponse = JSON.parse(oError.responseText);
                        MessageBox.error(oResponse.error.message.value);
                    } catch (e) {
                         MessageBox.error("Login failed. Please check your credentials.");
                    }
                }
            });
        },

        _fetchPlantDetails: function (sUserId) {
            var oModel = this.getOwnerComponent().getModel();
            var that = this;
            
            // Pattern: /ZRD_QP_PLANTSet(UserId='...')
            var sPath = "/ZRD_QP_PLANTSet(UserId='" + sUserId + "')";

            oModel.read(sPath, {
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    if (oData) {
                        var sPlantId = oData.Plant; // Based on response: <d:Plant>0001</d:Plant>
                        
                        // Store in local storage
                        localStorage.setItem("UserId", sUserId);
                        localStorage.setItem("PlantId", sPlantId);
                        
                        MessageToast.show("Login Successful!");
                        
                        // Navigate to Dashboard (assuming RouteView1 is the dashboard for now)
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                        oRouter.navTo("RouteView1");
                    } else {
                        MessageBox.error("Could not retrieve Plant details.");
                    }
                },
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageBox.error("Failed to fetch Plant details.");
                }
            });
        }
    });
});
