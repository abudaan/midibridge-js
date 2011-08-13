/**
 * Note for IE8 users: if you include MidiBridge.js in your html, the method addEventListener will be added to the window object.
 * In fact this method is just a wrapper around the attachEvent method.
 */
window.addEventListener('load', function() {
    
    var contentDiv = document.getElementById("content");
    
    /**
     * Initializing the midibridge means that an extra div will be added to your html. In this newly created div, the Java applet will be
     * loaded. As soon as the applet is loaded and initialized, the callback method that you provide as argument will be called as soon
     * as midi data arrives (i.e. when you play your midi keyboard).
     * 
     * This is the most simple way of initializing the midibridge. Instead of a callback function you can also pass a configuration object
     * as argument.
     * 
     */
    midiBridge.init(function(midiEvent) {
        contentDiv.innerHTML += midiEvent + "<br/>";
    });
 
}, false);
