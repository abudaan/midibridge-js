/**
 * Note for IE8 users: if you include MidiBridge.js in your html, the method addEventListener will be added to the window object.
 * In fact this method is just a wrapper around the attachEvent method.
 */
window.addEventListener('load', function() {
    
    var contentDiv = document.getElementById("content");
    contentDiv.style.lineHeight = "1.6em";
    
    midiBridge.init({
        ready:function(){
            sendRandomEvent(0,100);
        }
    });
    
    //this function acts as a basic sequencer
    function sendTimedMIDIEvent(midiMessage,delay,callback){
        function send(midiMessage){
            midiBridge.sendMidiEvent(midiMessage.status, midiMessage.channel, midiMessage.data1, midiMessage.data2);
            contentDiv.innerHTML += "sending MIDI message " + midiMessage.toString() + "<br/>";
            callback();
        }
        if(delay > 0){
            contentDiv.innerHTML += "delaying playback for " + delay + " ms<br/>";
            setTimeout(function(){
                send(midiMessage);
            },delay);
        }else{
            send(midiMessage);
        }
    }
    
    //create a random note sequence
    function sendRandomEvent(currentNote,maxNotes){
        var delay, noteNumber, velocity,message;
        if(currentNote < maxNotes){
            delay = Math.floor((Math.random()*2000));//delay random between 0 an 1000 milliseconds
            noteNumber = Math.floor((Math.random()*87)+21);//noteNumber random between 21 (A0) an 108 (C8)
            velocity = Math.floor((Math.random()*127)+10);//velocity random betweeen 10 and 127
            message = {
                data1:noteNumber,
                data2:velocity,
                channel:1,
                status:midiBridge.NOTE_ON
            };
            //console.log(message);
            sendTimedMIDIEvent(new midiBridge.MidiMessage(message),delay,function(){
                //console.log(currentNote,"/",maxNotes);
                sendRandomEvent(++currentNote,maxNotes);
            });
        }
    }
});


