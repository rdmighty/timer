app.controller('timerController', ['$scope','$timeout', '$interval', 'timerFactory', function($scope, $timeout, $interval, timerFactory){
	var vm = this;
	var _tf = timerFactory;
	var interval = null;

	vm.timer = null;
	vm.start = start;
	vm.pause = pause;

	$scope.$on('$destroy',function(){
        if(interval)
            $interval.cancel(interval);   
    });
	
	var Timer = function(step, update, isTimerPaused){
		var currentTime = step === void 0 ? 0 : step;
		var isPaused = false, 
			isRunning = false,
			displayStr = undefined;
		this.start = function(){
			if(!isRunning || (isRunning && isPaused)){
				interval = $interval(function(){
					currentTime += 1;
					updateDisplay();
				}, 1000);
				isPaused = false;
				isRunning = true;
			}
		}
		this.pause = function () {
			if(interval && isRunning){
				$interval.cancel(interval);
				interval = undefined;
				isPaused = true;
				updateDisplay();
			}
        }
        this.getCurrentTime = function () {
            return currentTime;
        }
		function display(seconds) {
            var hours = parseInt(seconds / 3600);
            seconds = seconds % ((hours * 3600) || Number.MAX_SAFE_INTEGER);
            var minutes = parseInt(seconds / 60);
            seconds = seconds % ((minutes * 60) || Number.MAX_SAFE_INTEGER);
            displayStr = ((hours < 10 ? '0' + hours : hours) + ' : ' + (minutes < 10 ? '0' + minutes : minutes) + ' : ' + (seconds < 10 ? '0' + seconds : seconds));
        }
		function updateDisplay(){
			if(update instanceof Function){
				display(currentTime);
				update.call(this, displayStr, currentTime);
			}
		}	
		if(isTimerPaused){isPaused = true;isRunning = true;updateDisplay();}	
	}

	var timerCurrentValue = null;

	if(_tf.timer.isTimerPaused)
		timerCurrentValue = !_tf.timer.timerCurrentValue ? 0 : _tf.timer.timerCurrentValue;
	else{
		if(!_tf.timer.timerStartValue){
			_tf.timer.timerStartValue = moment();
			_tf.timer.timerCurrentValue = 0;
		}

		timerCurrentValue = _tf.timer.timerCurrentValue + Math.abs(moment(_tf.timer.timerStartValue).diff(moment()._d, 'seconds'));
	}
		

	
	var _timer = new Timer(timerCurrentValue, function(display, currentTime){
			vm.timer = display;
			//save current value only when paused
			if(_tf.timer.isTimerPaused)
 				_tf.timer.timerCurrentValue = currentTime;
		}, _tf.timer.isTimerPaused);

	if(!_tf.timer.isTimerPaused){
		start();
	}

	function pause(){
		_tf.timer.isTimerPaused = true;
		_timer.pause();		
	}
	
	function start(){
		_timer.start();
		_tf.timer.timerCurrentValue = _timer.getCurrentTime();
	    _tf.timer.timerStartValue = moment();
		_tf.timer.isTimerPaused = false;
	}
}]);