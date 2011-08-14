/**
 * Note for IE8 users: if you include midibridge-0.5.min.js in your html, the method addEventListener will be added to the window object.
 * In fact this method is just a wrapper around the attachEvent method.
 */
window.addEventListener('load', function() {
    
    var contentDiv = document.getElementById("content");
    
    /**
     * A very minimalistic implementation of the midibridge; it just prints the incoming midi messages to a div
     */
    midiBridge.init(function(midiEvent) {
        contentDiv.innerHTML += midiEvent + "<br/>";
    });
 
}, false);
