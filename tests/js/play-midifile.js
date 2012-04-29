/**
 * Note for IE8 users: if you include MidiBridge.js in your html, the method addEventListener will be added to the window object.
 * In fact this method is just a wrapper around the attachEvent method.
 */

window.addEventListener('load', function() {
    
    //"use strict";

    var contentDiv = document.getElementById("content"),
        uploadUrl = "php/midiToBase64.php",
        fileName = "Chopin Opus18",
        chooseFile, fileDuration, controls, sliderDiv, thumbDiv, labelDiv, btnPlay, btnPause, btnStop, slider, output, info, position;

    chooseFile = document.createElement("input");
    chooseFile.setAttribute("type", "file");
    chooseFile.setAttribute("onchange", "alert(this.value)");
    contentDiv.appendChild(chooseFile);

    controls = document.createElement("div");
    controls.id = "controls";
    controls.className = "clearfix";
    contentDiv.appendChild(controls);

    btnPlay = document.createElement("div");
    btnPlay.innerHTML = "PLAY";
    btnPlay.className = "button";
    controls.appendChild(btnPlay);
    btnPlay.addEventListener("click", function() {
        midiBridge.startSequencer();
    }, false);

    btnPause = document.createElement("div");
    btnPause.innerHTML = "PAUSE";
    btnPause.className = "button";
    controls.appendChild(btnPause);
    btnPause.addEventListener("click", function() {
        midiBridge.pauseSequencer();
    }, false);

    btnStop = document.createElement("div");
    btnStop.innerHTML = "STOP";
    btnStop.className = "button";
    controls.appendChild(btnStop);
    btnStop.addEventListener("click", function() {
        midiBridge.stopSequencer();
        slider.setPercentage(0);
        info.getElementsByTagName("span")[7].innerHTML = "0:00:000";
        output.innerHTML = "";
    }, false);

    output = document.createElement("div");
    output.id = "console";
    output.innerHTML = "";
    contentDiv.appendChild(output);

    info = document.createElement("div");
    info.id = "info";
    info.innerHTML = "no midi file loaded";
    contentDiv.appendChild(info);


    sliderDiv = document.createElement("div");
    sliderDiv.setAttribute("id", "position");
    sliderDiv.className = "slider";
    contentDiv.appendChild(sliderDiv);

    thumbDiv = document.createElement("div");
    thumbDiv.className = "thumb";
    sliderDiv.appendChild(thumbDiv);

    labelDiv = document.createElement("div");
    labelDiv.className = "label";
    thumbDiv.appendChild(labelDiv);

    slider = new abumarkub.ui.Slider("position", 500, 8, 0, 100, 0);
    slider.addEventListener("changed", function(value) {
        midiBridge.setSequencerPosition((value * 1000).toString()) //value in microseconds as String!
        //console.log(value);
    });

    slider.addEventListener("startDrag", function(value) {
        midiBridge.pauseSequencer();
    });

    slider.addEventListener("stopDrag", function(value) {
        midiBridge.startSequencer()
    });
    
    abumarkub.ui.createMIDIProgramSelector(controls,function(programId){
        midiBridge.sendMidiEvent(midiBridge.PROGRAM_CHANGE, 0, programId, 0)
    });

    /*
    slider = document.createElement("input");
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
     */

    function loadMIDIFile(base64data) {
        var data = midiBridge.loadBase64String(base64data);
        //console.log(data);
        //slider.setAttribute("value", "0");
        //slider.setAttribute("max", (data.microseconds/1000) >> 0);
        info.innerHTML = "<span class='label'>file:</span> <span class='value'>" + fileName + "</span> ";
        info.innerHTML += "<span class='label'>length:</span><span class='value'>" + midiBridge.getNiceTime(data.microseconds) + "</span> ";
        info.innerHTML += "<span class='label'>ticks:</span><span class='value'>" + data.ticks + "</span> ";
        info.innerHTML += "<span class='label'>position:</span><span id='position' class='value'>0:00:000</span>";

        fileDuration = data.microseconds/1000;
        slider.setRange(0, fileDuration);

        position = info.querySelector("#position");
    }

    chooseFile.onchange = function(e) {

        e.preventDefault();
        var file;
        if (chooseFile.files) {
            file = chooseFile.files[0];
        } else {
            //console.log(chooseFile.value);
            file = chooseFile.value;
        }

        fileName = file.name;

        if (fileName === undefined) {
            info.style.color = "#f00";
            info.innerHTML = "uploading files not supported natively; use a library like jQuery";
            return;
        }

        info.innerHTML = "loading: " + fileName;
        output.innerHTML = "";


        if (typeof window.FileReader === 'undefined') {
            //console.log("via server");
            var request = new XMLHttpRequest();
            request.addEventListener("readystatechange", function(e) {
                if (request.readyState == 4 && request.status === 200) {
                    //console.log(e);
                    loadMIDIFile(e.target.response);
                }
            });

            request.open('POST', uploadUrl, true);
            request.setRequestHeader("Cache-Control", "no-cache");
            request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            request.setRequestHeader("X-File-Name", fileName);
            request.send(file);


        } else {
            var reader = new FileReader();

            reader.onerror = function(error) {
                //console.log("error", error)
            }

            reader.onload = function(e) {
                loadMIDIFile(e.target.result);
            };

            reader.readAsDataURL(file);
        }
    };

    midiBridge.init({
        connectAllInputsToFirstOutput: false,
        connectFirstOutput: true,
        //debug:true,
        //midiCommands:[midiBridge.NOTE_OFF,midiBridge.NOTE_ON],

        ready: function(msg) {
            loadMIDIFile(chopin_opus18);
        },

        error: function(msg) {
            contentDiv.innerHTML += msg + "<br/>";
        },

        data: function(midiEvent) {
            output.innerHTML = midiEvent + "<br/>";
            output.scrollTop = output.scrollHeight;
            //slider.setAttribute("value", (midiEvent.microsecond/1000) >> 0);
            slider.setPercentage(((midiEvent.microsecond / 1000) >> 0) / (fileDuration), false);
            position.innerHTML = midiEvent.time;
            //console.log(midiEvent.channel);
        }
    });
}, false);
