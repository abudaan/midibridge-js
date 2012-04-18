package {
	import flash.display.Sprite;
	import flash.events.TimerEvent;
	import flash.external.ExternalInterface;
	import flash.text.TextField;
	import flash.utils.Timer;

	[SWF(backgroundColor="#ffffff", width="230", height="800")]
	
	public class Main extends Sprite {
		private var _readyTimer:Timer = new Timer(1, 1);
		private var _output:TextField = new TextField();

		public function Main() {
						
			_output.width = 210;
			_output.height = 780;
			_output.border = true;
			_output.x = 10;
			_output.y = 10;
			addChild(_output);

			if(ExternalInterface.available) {
				_readyTimer.addEventListener(TimerEvent.TIMER, check);
				_readyTimer.start();
			} else {
				trace("ExternalInterface not avaible in this browser");
			}
		}

		public function midibridgeReady(msg:String):void {
			var jsonString:String = ExternalInterface.call("callFromFlash", "getDevices");
			trace(jsonString);
		}

		public function midibridgeError(msg:String):void {
			trace(msg);
		}

		//incoming MIDI data from the Midibridge
		public function midibridgeData(msg:String):void {			
			//parse String to midiMessage object so you can use the MIDI data more convenient
			var data:Array = msg.split(" ");
			var midiMessage:Object; 
			if(data.length === 5){
				midiMessage = {
					noteName:data[0],
					commandName:data[1],
					data1:data[2],//usually MIDI note number
					data2:data[3],//usually velocity
					command:data[4]//command codes like 144, 128 etc.
				}
			}else if(data.length === 6){
				midiMessage = {
					noteName:data[0],
					commandName:data[1] + "_" + data[2],//NOTE_ON, NOTE_OFF, etc.
					data1:data[3],//usually MIDI note number
					data2:data[4],//usually velocity
					command:data[5]//command codes like 144, 128 etc.
				}				
			}
			//filter all incoming midi messages; add only the command codes of the midi messages you're interested in
			//currently: note on and note off
			switch(midiMessage.command){
				case "128"://note off
				case "144"://note on
					yourAwesomeAnimationFunction(midiMessage);
					break;
				default:
					return;

			}
		}

		public function yourAwesomeAnimationFunction(midiMessage:Object){
    		var noteNumber:uint = parseInt(midiMessage.data1);
    		var velocity:uint = parseInt(midiMessage.data2);
			_output.appendText("" + midiMessage.noteName + " : " + noteNumber + " : " + velocity + " : " + midiMessage.command + "\n");
			_output.scrollV = _output.maxScrollH;
		}		

		//check if the document is loaded
		private function check(e:TimerEvent = null):void {
			try {
				if(ExternalInterface.call("midiBridge") !== null) {
					ExternalInterface.addCallback("midibridgeReady", midibridgeReady);
					ExternalInterface.addCallback("midibridgeError", midibridgeError);
					ExternalInterface.addCallback("midibridgeData", midibridgeData);
					ExternalInterface.call("callFromFlash", "start");
					_readyTimer.stop();
				} else {
					_readyTimer = new Timer(100, 1);
					_readyTimer.addEventListener(TimerEvent.TIMER, check);
					_readyTimer.start();
				}
			} catch(err1:SecurityError) {
				trace(err1.message);
			} catch(err2:Error) {
				trace(err2.message);
			}
		}
	}
}
