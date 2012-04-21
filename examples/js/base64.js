/**
 * Note for IE8 users: if you include MidiBridge.js in your html, the method addEventListener will be added to the window object.
 * In fact this method is just a wrapper around the attachEvent method.
 */
window.addEventListener('load', function() {
    
    var contentDiv = document.getElementById("content");
    var position;
    var midiProgramSelector;
    
    var ua = navigator.userAgent.toLowerCase();
    if(ua.indexOf("chrome") === -1){
        contentDiv.style.marginTop = "20px";
        contentDiv.style.lineHeight = "30px";
        contentDiv.style.padding = "10px";
        contentDiv.style.fontSize = "15px";
        contentDiv.style.textAlign = "center";
        contentDiv.style.backgroundColor = "#fff";
        contentDiv.style.border = "#f00 dotted 3px";
        contentDiv.innerHTML = "This sample uses the File API and the html5 Slider,<br/>so you can only view this sample in <a href='http://www.google.com/chrome/'>Google Chrome</a>."
        return;
    }

    var dropbox = document.createElement("div");
    dropbox.id = "dropbox";
    dropbox.innerHTML = "drop your midifile here"; 
    contentDiv.appendChild(dropbox);

    var info = document.createElement("div");
    info.id = "info";
    info.innerHTML = "no midi file loaded"; 
    contentDiv.appendChild(info);
    
    var controls = document.createElement("div");
    controls.id = "controls";
    controls.className = "clearfix";
    contentDiv.appendChild(controls);
    
    var btnPlay = document.createElement("div");
    btnPlay.innerHTML = "PLAY"; 
    btnPlay.className = "button";
    controls.appendChild(btnPlay);
    btnPlay.addEventListener("click", function(){
        midiBridge.startSequencer();                
    }, false);

    var btnPause = document.createElement("div");
    btnPause.innerHTML = "PAUSE"; 
    btnPause.className = "button";
    controls.appendChild(btnPause);
    btnPause.addEventListener("click", function(){
        midiBridge.pauseSequencer();                
    }, false);

    var btnStop = document.createElement("div");
    btnStop.innerHTML = "STOP"; 
    btnStop.className = "button";
    controls.appendChild(btnStop);
    btnStop.addEventListener("click", function(){
        midiBridge.stopSequencer();   
        output.innerHTML = "";
    }, false);

    midiProgramSelector = abumarkub.ui.createMIDIProgramSelector(controls,function(programId){
        midiBridge.sendMidiEvent(midiBridge.PROGRAM_CHANGE, 0, programId, 0)
    });

    var output = document.createElement("div");
    output.id = "console";
    output.innerHTML = ""; 
    contentDiv.appendChild(output);

    var slider = document.createElement("input");
    slider.setAttribute("type", "range");
    slider.setAttribute("min", "0");
    slider.setAttribute("step", "1");
    slider.setAttribute("value", "0");
    slider.style.width = "500px";
    contentDiv.appendChild(slider);
    slider.addEventListener("change",function(e){
        //console.log(e.target.value * 1000);
        midiBridge.setSequencerPosition((e.target.value * 1000).toString())//value in microseconds as String!
    },false);

    dropbox.addEventListener("dragenter", function(e) {
        e.stopPropagation();
        e.preventDefault();
    }, false);
        
    dropbox.addEventListener("dragover", function(e) {
        e.stopPropagation();
        e.preventDefault();
    }, false);
 
    dropbox.addEventListener("drop", function(e) {
        e.stopPropagation();
        e.preventDefault();
    
        var dt = e.dataTransfer;
        var files = dt.files;
        var file = files[files.length-1];
        info.innerHTML = "loading: " + file.name;
        output.innerHTML = "";
        midiProgramSelector.selectOption(0);

        var reader = new FileReader();
        reader.onload = function(e) {
            //console.log(e.target.result);
            var data = midiBridge.loadBase64String(e.target.result.replace("data:audio/mid;base64,",""));
            slider.setAttribute("value", "0");
            slider.setAttribute("max", (data.microseconds/1000) >> 0);
            info.innerHTML = "<span class='label'>file:</span> <span class='value'>" + file.name + "</span> ";
            info.innerHTML += "<span class='label'>length:</span><span class='value'>" + midiBridge.getNiceTime(data.microseconds) + "</span> ";
            info.innerHTML += "<span class='label'>ticks:</span><span class='value'>" + data.ticks + "</span> "; 
            info.innerHTML += "<span class='label'>position:</span><span id='position' class='value'>0:00:000</span>";
            position = info.querySelector("#position");
        };
        reader.readAsDataURL(file);
    }, false);
    

    midiBridge.init({
        connectAllInputsToFirstOutput : false,
        connectFirstOutput : true,

        ready : function(msg) {
        },

        error : function(msg) {
            contentDiv.innerHTML += msg + "<br/>";
        },

        data : function(midiEvent) {
            output.innerHTML = midiEvent + "<br/>";
            output.scrollTop = output.scrollHeight;
            slider.setAttribute("value", (midiEvent.microsecond/1000) >> 0);
            position.innerHTML = midiEvent.time;
            //console.log(midiEvent,midiEvent.microsecond);
        }
    });

}, false);


