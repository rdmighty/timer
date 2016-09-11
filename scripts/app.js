var app = angular.module("angular",['ui.bootstrap']);

app.factory('timerFactory', function(){
    var timer = {
        timerStartValue: null,
        timerCurrentValue: 0,
        isTimerPaused: false
    };
    return {
        timer: timer
    }
});
