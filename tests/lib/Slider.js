var abumarkub = abumarkub || {};
abumarkub.ui = abumarkub.ui || {};

abumarkub.ui.Slider = function(id,w,h,min,max,initValue){

    var thumb;
    var thumbLabel;
    var track;
    var maxLength;
    var maxValue;
    var minValue;
    var percentage;
    var value;
    var offsetLeft;
    
    var listeners = {};

    track = document.getElementById(id);
    track.style.width = w + "px";
    track.style.height = h + "px";
    thumb = document.querySelector("#" + id + " > .thumb");
    thumbLabel = document.querySelector(".thumb > .label");
    thumb.style.top = "-26px";
    thumb.style.cursor = "pointer";
    track.style.cursor = "pointer";
    maxLength = w;

    maxValue = max;
    minValue = min;

    offsetLeft  = track.offsetLeft;
    //console.log(thumb,track.offsetLeft)
    
    window.addEventListener("resize",function(){
        offsetLeft  = track.offsetLeft;
    },false);


    initThumb(initValue ? initValue : minValue);

    track.addEventListener("mousedown",function(event){
        startDrag(event);
    },false);

    

    function startDrag(event){
        
        dispatchEvent("startDrag",value);
        
        track.addEventListener("mousemove",setThumb,false);        
        track.addEventListener("mouseleave",stopDrag,false);
        track.addEventListener("mouseup",stopDrag,false);

        thumb.addEventListener("mouseup",stopDrag,false);
        thumb.addEventListener("mousedown",function(event){
            event.preventDefault();
        },false);

        setThumb(event);
    }
    
    function initThumb(value){
        
        var p = (value-minValue)/(maxValue - minValue);
        //log(p);
        thumb.style.left = (p * maxLength) + "px";
        thumbLabel.innerHTML = value;
    }

    function setThumb(event){
        
        var x = event.clientX - offsetLeft;
        //log(x);
        if(x >= 0 && x <= maxLength){
            thumb.style.left = x + "px";
            percentage = x/maxLength;
            //log(percentage);
            value = Math.round((percentage * (maxValue - minValue)) + minValue);
            //thumbLabel.innerHTML = value;
            thumbLabel.innerHTML = ((percentage * 100) >> 0) + "%";
            dispatchEvent("changed",value);
        }
    }

    function stopDrag(event){
        
        dispatchEvent("stopDrag",value);
        
        track.removeEventListener("mousemove",setThumb,false);
        track.removeEventListener("mouseleave",stopDrag);
        track.removeEventListener("mouseup",stopDrag);
        thumb.removeEventListener("mouseup",stopDrag);
    }
    
    function dispatchEvent(eventType,value){
        var currListeners = listeners[eventType];
        var i = 0;
        while(currListeners[i]){
            currListeners[i](value);
            i++;
        }
    }
        
    return {
        addEventListener: function(eventType,callback){
            if(!listeners[eventType]){
                listeners[eventType] = [];
            }
            listeners[eventType].push(callback);
        },
        setPercentage: function(percentage,dispatch){
            value = Math.round((percentage * (maxValue - minValue)) + minValue);
            //thumbLabel.innerHTML = value;
            thumbLabel.innerHTML = ((percentage * 100) >> 0) + "%";
            thumb.style.left = percentage * maxLength + "px";
            if(dispatch){
                dispatchEvent("changed",value);
            }
        },
        setRange: function(min,max){
            minValue = min;
            maxValue = max;
        }
    }
}
