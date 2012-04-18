/**
 * Note for IE8 users: if you include MidiBridge.js in your html, the method addEventListener will be added to the window object.
 * In fact this method is just a wrapper around the attachEvent method.
 */
window.addEventListener('load', function() {
    
    var contentDiv = document.getElementById("content");
    
    midiBridge.init(function(midiEvent) {
        contentDiv.innerHTML += midiEvent + "<br/>";
    });
    
    contentDiv.innerHTML += "<div id='playAnote'>play a note</div>";
    var playNote = document.getElementById("playAnote");
    playNote.style.textDecoration = "underline";
    
    playNote.addEventListener("click",function(){
        midiBridge.sendMidiEvent(midiBridge.NOTE_ON,1,84,100);
    },false);

}, false);
