/**
 * Note for IE8 users: if you include MidiBridge.js in your html, the method addEventListener will be added to the window object.
 * In fact this method is just a wrapper around the attachEvent method.
 */
window.addEventListener('load', function() {
    
    var contentDiv = document.getElementById("content");
    var position;
    
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

    var instruments = {
        1 : "Acoustic Grand Piano",
        2 : "Bright Acoustic Piano",
        3 : "Electric Grand Piano",
        4 : "Honky-tonk Piano",
        5 : "Electric Piano 1",
        6 : "Electric Piano 2",
        7 : "Harpsichord",
        8 : "Clavinet",
        9 : "Celesta",
        10 : "Glockenspiel",
        11 : "Music Box",
        12 : "Vibraphone",
        13 : "Marimba",
        14 : "Xylophone",
        15 : "Tubular Bells",
        16 : "Dulcimer",
        17 : "Drawbar Organ",
        18 : "Percussive Organ",
        19 : "Rock Organ",
        20 : "Church Organ",
        21 : "Reed Organ",
        22 : "Accordion",
        23 : "Harmonica",
        24 : "Tango Accordion",
        25 : "Acoustic Guitar (nylon)",
        26 : "Acoustic Guitar (steel)",
        27 : "Electric Guitar (jazz)",
        28 : "Electric Guitar (clean)",
        29 : "Electric Guitar (muted)",
        30 : "Overdriven Guitar",
        31 : "Distortion Guitar",
        32 : "Guitar Harmonics",
        33 : "Acoustic Bass",
        34 : "Electric Bass (finger)",
        35 : "Electric Bass (pick)",
        36 : "Fretless Bass",
        37 : "Slap Bass 1",
        38 : "Slap Bass 2",
        39 : "Synth Bass 1",
        40 : "Synth Bass 2",
        41 : "Violin",
        42 : "Viola",
        43 : "Cello",
        44 : "Contrabass",
        45 : "Tremolo Strings",
        46 : "Pizzicato Strings",
        47 : "Orchestral Harp",
        48 : "Timpani",
        49 : "String Ensemble 1",
        50 : "String Ensemble 2",
        51 : "Synth Strings 1",
        52 : "Synth Strings 2",
        53 : "Choir Aahs",
        54 : "Voice Oohs",
        55 : "Synth Choir",
        56 : "Orchestra Hit",
        57 : "Trumpet",
        58 : "Trombone",
        59 : "Tuba",
        60 : "Muted Trumpet",
        61 : "French Horn",
        62 : "Brass Section",
        63 : "Synth Brass 1",
        64 : "Synth Brass 2",
        65 : "Soprano Sax",
        66 : "Alto Sax",
        67 : "Tenor Sax",
        68 : "Baritone Sax",
        69 : "Oboe",
        70 : "English Horn",
        71 : "Bassoon",
        72 : "Clarinet",
        73 : "Piccolo",
        74 : "Flute",
        75 : "Recorder",
        76 : "Pan Flute",
        77 : "Blown Bottle",
        78 : "Shakuhachi",
        79 : "Whistle",
        80 : "Ocarina",
        81 : "Lead 1 (square)",
        82 : "Lead 2 (sawtooth)",
        83 : "Lead 3 (calliope)",
        84 : "Lead 4 (chiff)",
        85 : "Lead 5 (charang)",
        86 : "Lead 6 (voice)",
        87 : "Lead 7 (fifths)",
        88 : "Lead 8 (bass + lead)",
        89 : "Pad 1 (new age)",
        90 : "Pad 2 (warm)",
        91 : "Pad 3 (polysynth)",
        92 : "Pad 4 (choir)",
        93 : "Pad 5 (bowed)",
        94 : "Pad 6 (metallic)",
        95 : "Pad 7 (halo)",
        96 : "Pad 8 (sweep)",
        97 : "FX 1 (rain)",
        98 : "FX 2 (soundtrack)",
        99 : "FX 3 (crystal)",
        100 : "FX 4 (atmosphere)",
        101 : "FX 5 (brightness)",
        102 : "FX 6 (goblins)",
        103 : "FX 7 (echoes)",
        104 : "FX 8 (sci-fi)",
        105 : "Sitar",
        106 : "Banjo",
        107 : "Shamisen",
        108 : "Koto",
        109 : "Kalimba",
        110 : "Bagpipe",
        111 : "Fiddle",
        112 : "Shanai",
        113 : "Tinkle Bell",
        114 : "Agogo",
        115 : "Steel Drums",
        116 : "Woodblock",
        117 : "Taiko Drum",
        118 : "Melodic Tom",
        119 : "Synth Drum",
        120 : "Reverse Cymbal",
        121 : "Guitar Fret Noise",
        122 : "Breath Noise",
        123 : "Seashore",
        124 : "Bird Tweet",
        125 : "Telephone Ring",
        126 : "Helicopter",
        127 : "Applause",
        128 : "Gunshot"
    };  

    var createOption = function(id, label) {
        var option = document.createElement("option");
        option.setAttribute("id", id);
        option.innerHTML = label;
        return option;
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

    var progChange = document.createElement("select");
    for(var id in instruments){
        progChange.appendChild(createOption(id - 1, instruments[id]));
    }
    progChange.addEventListener("change", function(e) {
        midiBridge.sendMidiEvent(midiBridge.PROGRAM_CHANGE, 0, progChange.options[progChange.selectedIndex].id, 0);
    },false);
    controls.appendChild(progChange);

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
        progChange.selectedIndex = 0;

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


