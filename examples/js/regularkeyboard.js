/**
 * Note for IE8 users: if you include MidiBridge.js in your html, the method addEventListener will be added to the window object.
 * In fact this method is just a wrapper around the attachEvent method.
 */
window.addEventListener('load', function() {

    midiBridge.init({
        
        connectFirstOutput : true,
        
        ready : function(msg) {
            connectKeyboard();
        },
        error : function(msg) {
            console.log(msg);
        }
    });
        
    var noteNumbers = {
        //white keys
        65 : 48, //key a -> note c
        83 : 50, //key s -> note d
        68 : 52, //key d -> note e
        70 : 53, //key f -> note f
        71 : 55, //key g -> note g
        72 : 57, //key h -> note a
        74 : 59, //key j -> note b
        75 : 60, //key k -> note c
        76 : 62, //key l -> note d
        186 : 64, //key ; -> note e
        222 : 65, //key : -> note f
        //black keys
        87 : 49, //key w -> note c#/d♭
        69 : 51, //key e -> note d#/e♭
        84 : 54, //key t -> note f#/g♭
        89 : 56, //key y -> note g#/a♭
        85 : 58, //key u -> note a#/b♭
        79 : 61, //key o -> note c#/d♭
        80 : 63  //key p -> note d#/e♭
    }

    var keysPressed = {};
    
    var connectKeyboard = function(){
        document.addEventListener("keydown", function(e) {
            //console.log(e, e.which, e.which.toString(), noteNumbers[e.which.toString()]);
            if(e.which === 32) {
                midiBridge.sendMidiEvent(midiBridge.CONTROL_CHANGE, 1, 64, 127);
            } else if(noteNumbers[e.which] && !keysPressed[e.which]) {
                midiBridge.sendMidiEvent(midiBridge.NOTE_ON, 1, noteNumbers[e.which], 100);
                keysPressed[e.which] = true;
            }
        }, false);
    
    
        document.addEventListener("keyup", function(e) {
            if(e.which === 32) {
                midiBridge.sendMidiEvent(midiBridge.CONTROL_CHANGE, 1, 64, 0);
            } else if(noteNumbers[e.which]) {
                midiBridge.sendMidiEvent(midiBridge.NOTE_OFF, 1, noteNumbers[e.which], 0);
                keysPressed[e.which] = false;
            }
        }, false);
        
        document.getElementById("content").innerHTML = "Play some keys on your regular computer keyboard!";
    }

}, false);
