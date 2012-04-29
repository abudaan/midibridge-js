/**
 * Note for IE8 users: if you include MidiBridge.js in your html, the method addEventListener will be added to the window object.
 * In fact this method is just a wrapper around the attachEvent method.
 */
window.addEventListener('load', function() {

    var contentDiv = document.getElementById("content");
    var currentMidiInputId = -1;
    var currentMidiOutputId = -1;

    //create a dropdown box for the midi inputs
    var midiInputs = document.createElement("select");
    midiInputs.setAttribute("id", "midi-in");
    contentDiv.appendChild(midiInputs);
    midiInputs.addEventListener("change", function(e) {
        clearCurrentConnection();
        var device = midiInputs.options[midiInputs.selectedIndex];
        currentMidiInputId = device.id;
        //console.log(currentMidiInputId, currentMidiOutputId);
        var result = midiBridge.addConnection(currentMidiInputId, currentMidiOutputId, [midiBridge.PITCH_BEND]);
        parseResult(result);
    }, false);

    //create a dropdown box for the midi outputs
    var midiOutputs = document.createElement("select");
    midiOutputs.setAttribute("id", "midi-out");
    contentDiv.appendChild(midiOutputs);
    midiOutputs.addEventListener("change", function(e) {
        clearCurrentConnection();
        var device = midiOutputs.options[midiOutputs.selectedIndex];
        currentMidiOutputId = device.id;
        //console.log(currentMidiInputId, currentMidiOutputId);
        var result = midiBridge.addConnection(currentMidiInputId, currentMidiOutputId, [midiBridge.PITCH_BEND]);
        parseResult(result);
    }, false);
    
    var clearCurrentConnection = function(){
                
        if(currentMidiInputId === -1 && currentMidiOutputId === -1){
            return;
        }
        midiBridge.removeConnection(currentMidiInputId,currentMidiOutputId);
    }
    
    var midiDataOutput = document.createElement("div");
    midiDataOutput.style['clear'] = "left";
    midiDataOutput.style['float'] = "left";
    //midiDataOutput.style['height'] = "400px";
    //midiDataOutput.style['overflow'] = "auto";
    contentDiv.appendChild(midiDataOutput);

    var devices;

    midiBridge.init({
        connectAllInputsToFirstOutput : false,
        //debug : true,
        //midiCommands : [midiBridge.NOTE_ON,midiBridge.NOTE_OFF],

        ready : function(msg) {
            devices = midiBridge.getDevices();
            populateDropDownMenus()
        },

        error : function(msg) {
            midiDataOutput.innerHTML += msg + "<br/>";
        },

        data : function(midiEvent) {
            midiDataOutput.innerHTML += midiEvent + "<br/>";
        }

    });

    var populateDropDownMenus = function() {
        
        midiInputs.appendChild(createOption("-1", "choose a midi input"));
        midiOutputs.appendChild(createOption("-1", "choose a midi output"));

        for(var deviceId in devices) {
            var device = devices[deviceId];
            if(device.type === "input" && device.available === "true") {
                midiInputs.appendChild(createOption(device.id, device.name))
            } else if(device.type === "output" && device.available === "true") {
                midiOutputs.appendChild(createOption(device.id, device.name))
            }
        }
    }

    var createOption = function(id, label) {
        var option = document.createElement("option");
        option.setAttribute("id", id);
        option.innerHTML = label;
        return option;
    }

    var parseResult = function(data) {
        //contentDiv.innerHTML += data.msg + " : " + currentMidiInputId + " : " + currentMidiOutputId + "</br>";
    }

}, false);
