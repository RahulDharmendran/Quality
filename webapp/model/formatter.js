sap.ui.define([], function () {
    "use strict";

    return {
        formatTime: function (sTime) {
            if (!sTime) {
                return "";
            }
            try {
                // Parse PT05H41M16S format
                var sHours = "00";
                var sMinutes = "00";
                var sSeconds = "00";

                // Remove PT
                var sCleanTime = sTime.replace("PT", "");

                var iH = sCleanTime.indexOf("H");
                var iM = sCleanTime.indexOf("M");
                var iS = sCleanTime.indexOf("S");

                if (iH > -1) {
                    sHours = sCleanTime.substring(0, iH);
                }

                var iMStart = (iH > -1) ? (iH + 1) : 0;
                if (iM > -1) {
                    sMinutes = sCleanTime.substring(iMStart, iM);
                }

                var iSStart = (iM > -1) ? (iM + 1) : ((iH > -1) ? (iH + 1) : 0);
                if (iS > -1) {
                    sSeconds = sCleanTime.substring(iSStart, iS);
                }

                // Simple padding without ES2017 padStart for compatibility
                if (sHours.length < 2) sHours = "0" + sHours;
                if (sMinutes.length < 2) sMinutes = "0" + sMinutes;
                if (sSeconds.length < 2) sSeconds = "0" + sSeconds;

                return sHours + ":" + sMinutes + ":" + sSeconds;
            } catch (e) {
                return sTime;
            }
        }
    };
});
