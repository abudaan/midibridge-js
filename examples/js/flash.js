/**
 * You can only call global functions from Flash, therefor we declare a single global function that is used for all
 * communication with the Flashplayer.
 *
 */
function callFromFlash() {

    /**
     * getObject is utility function of midiBridge, it is used to get the Applet object,
     * but it can also be used to get the swf object
     *
     * flashapp is the id of the swf object in the html page.
     */
    var flashObject = midiBridge.getObject("flashapp");
    
    /**
     * convert the arguments to a array, the first argument is the msgId.
     * the msgId is used to determine what the Flashplayer wants from the midibridge
     */
    var args = Array.prototype.slice.call(arguments);
    var msgId = args[0];

    //console.log(args);

    switch(msgId) {

        case "start":
            midiBridge.init({
                connectAllInputsToFirstOutput : true,

                ready : function(msg) {
                    flashObject.midibridgeReady(msg);
                },

                error : function(msg) {
                    flashObject.midibridgeError(msg);
                },

                data : function(midiEvent) {
//                    flashObject.midibridgeData(midiEvent.toJSONString());
                    flashObject.midibridgeData(midiEvent.toString());
                }

            });
            return null;
            break;

        case "getDevices":
            return midiBridge.getDevices();
            break;
    }

}