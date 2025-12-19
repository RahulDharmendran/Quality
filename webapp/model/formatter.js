sap.ui.define([], function () {
    "use strict";

    return {
        formatTime: function (sTime) {
            if (sTime === null || sTime === undefined) {
                return "";
            }

            // Handler for OData V2 Edm.Time object (which has an 'ms' property)
            if (typeof sTime === "object" && sTime.ms !== undefined) {
                var fSeconds = sTime.ms / 1000;
                var iH = Math.floor(fSeconds / 3600);
                var iM = Math.floor((fSeconds % 3600) / 60);
                var iS = Math.floor(fSeconds % 60);

                var sHours = iH.toString();
                var sMinutes = iM.toString();
                var sSeconds = iS.toString();

                if (sHours.length < 2) sHours = "0" + sHours;
                if (sMinutes.length < 2) sMinutes = "0" + sMinutes;
                if (sSeconds.length < 2) sSeconds = "0" + sSeconds;

                return sHours + ":" + sMinutes + ":" + sSeconds;
            }

            // Handler for String format like "PT05H41M16S"
            if (typeof sTime === "string") {
                try {
                    var sCleanTime = sTime.replace("PT", "");
                    var iH = sCleanTime.indexOf("H");
                    var iM = sCleanTime.indexOf("M");
                    var iS = sCleanTime.indexOf("S");

                    var sH = "00";
                    var sMin = "00";
                    var sSec = "00";

                    if (iH > -1) {
                        sH = sCleanTime.substring(0, iH);
                    }
                    var iMStart = (iH > -1) ? (iH + 1) : 0;
                    if (iM > -1) {
                        sMin = sCleanTime.substring(iMStart, iM);
                    }
                    var iSStart = (iM > -1) ? (iM + 1) : ((iH > -1) ? (iH + 1) : 0);
                    if (iS > -1) {
                        sSec = sCleanTime.substring(iSStart, iS);
                    }

                    if (sH.length < 2) sH = "0" + sH;
                    if (sMin.length < 2) sMin = "0" + sMin;
                    if (sSec.length < 2) sSec = "0" + sSec;

                    return sH + ":" + sMin + ":" + sSec;
                } catch (e) {
                    return sTime;
                }
            }

            return "";
        }
    };
});
