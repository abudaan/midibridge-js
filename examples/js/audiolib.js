window.addEventListener('load', function() {

    var dev,osc;
    var frequencies = {};
    var noteNames = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
    var pitch = 440;
    var content = document.getElementById("content");
    
    const INIT_MIDINUMBER = 69; //Note A4 has midinumber 69
    const LOWEST_N = -69; //equals Midi NoteNumber 0 ~ 8 Hz
    const HIGHEST_N = 58;  //equals Midi NoteNumber 127 ~ 12500 Hz
    const LOWEST_TEMP = 415.3;
    const HIGHEST_TEMP = 466.16;
    
    function shiftIndex(index,range,shift){
        shift = (index + shift) >= range ? shift - range : shift;
        return (index + shift);
    }
    
    for(var i = LOWEST_N;i < HIGHEST_N; i++){
        var frequency = Math.round((Math.pow(2,i/12) * pitch) * 100) / 100;

        var octave = Math.floor(((i-3)/12) + 5); //octaves are calculated from note C and A440 is in octave 4 and the lowest note is in octave -1 (midinumber 0)

        var noteIndex = i%12;
        noteIndex = noteIndex < 0 ? noteIndex + 12 : noteIndex;
				
        var shiftedIndex = shiftIndex(noteIndex,12,9);
        var noteName = noteNames[shiftedIndex] + "" + octave;

        //var noteCode = octave + "" + noteIndex;
        //var midiNumber = INIT_MIDINUMBER + i;
					
        //console.log(i,"=",noteName, noteCode, midiNumber,frequency);
				
        frequencies[noteName] = frequency;
    }			   
       

    dev = audioLib.AudioDevice(function(buffer, channelCount){
        if(osc){
            osc.append(buffer, channelCount);
        }
    }, 2);
    dev.sampleRate = 44100;


    midiBridge.init({
        connectAllInputs : true,
        ready : function(msg) {
            content.innerHTML = "<h1>midibridge loaded, play some notes!</h1><br/>(You should have a midi keyboard connected to your computer)";
        },
        error : function(msg) {
            console.log(msg);
        },
        data : function(midiEvent) {
            var noteName = midiEvent.noteName;
            //console.log(noteName,frequencies[noteName]);
            if(midiEvent.status == midiBridge.NOTE_ON){
                //var volume = midiEvent.data2/127;
                osc = audioLib.Oscillator(dev.sampleRate, frequencies[noteName]);
            }else{
                osc = null;
            }
        }
    });    

},false);