sap.ui.define([], function () {
    "use strict";

    return {
        formatTime: function (sTime) {
            if (!sTime) {
                return "";
            }
            // Parse PT05H41M16S format
            var sHours = "00";
            var sMinutes = "00";
            var sSeconds = "00";

            // Remove PT
            sTime = sTime.replace("PT", "");

            var iH = sTime.indexOf("H");
            var iM = sTime.indexOf("M");
            var iS = sTime.indexOf("S");

            if (iH > -1) {
                sHours = sTime.substring(0, iH).padStart(2, '0');
            }

            var iMStart = (iH > -1) ? (iH + 1) : 0;
            if (iM > -1) {
                sMinutes = sTime.substring(iMStart, iM).padStart(2, '0');
            }

            var iSStart = (iM > -1) ? (iM + 1) : ((iH > -1) ? (iH + 1) : 0);
            if (iS > -1) {
                sSeconds = sTime.substring(iSStart, iS).padStart(2, '0');
            }

            return sHours + ":" + sMinutes + ":" + sSeconds;
        }
    };
});
