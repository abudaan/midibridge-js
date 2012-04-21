/**
 * Note for IE8 users: if you include MidiBridge.js in your html, the method addEventListener will be added to the window object.
 * In fact this method is just a wrapper around the attachEvent method.
 */
window.addEventListener('load', function () {
    
    var contentDiv = document.getElementById("content");
    
    midiBridge.init({ connectAllInputsToFirstOutput: false,
        ready: function(msg){
            contentDiv.innerHTML += msg + "<br/>";

            var devices = midiBridge.getDevices();
            for (var i = 0, max = devices.length; i < max; i++) {
            
                var device  = devices[i];
                var id      = device.id;
                var name    = device.name;
                var type    = device.type;
                //console.log(id,type,name);
                console.log(device);
            }
            /*
             * create a connection between MIDI input 6 and MIDI output 7
             * adjust this according to your system!
             */
            midiBridge.addConnection(6,7,[midiBridge.PITCH_BEND]);
        },
        error: function(msg) {
            contentDiv.innerHTML += msg + "<br/>";
        },
        data: function(midiEvent) {
            contentDiv.innerHTML += midiEvent + "<br/>";
        }        
    });
    
   
}, false);
