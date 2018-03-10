getRand = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

ffade = function (element, type, to, from, wait, message) {
    // recognize if is fadein or fadeout
    wait = (type === 'in') ? wait : 0;
    type = (type === 'in') ? 1 : 0.05;
    setTimeout(function(){
        // fade audio in time value
        $(element).animate({volume: type}, to.time);
        // wait sound animation to change the state of next step
        setTimeout(function(){
            from.status = true;
            // fade and slide out the message
            message.animate({'margin-left': '100px', opacity: '0'}, 500).animate({'margin-left': '0'}, 1);
        }, to.time);
    }, getRand(wait.start, wait.end));


};

var defFadeOut = {start: 2000, end: 3000};
var defFadeIn  = {start: 2000, end: 3000};
var stasy      = {start: 0, end: 200};

var fadeOut = { status: true,  time: getRand(defFadeOut.start, defFadeOut.end)};
var fadeIn  = { status: false, time: getRand(defFadeIn.start, defFadeIn.end)};

// Settings
var source = '../samples/wave01.wav';
var audio  = document.createElement("audio");
var progress = 0;
audio.src  = source;
audio.autoplay = true;
audio.volume   = 0;
audio.load();

$(function () {

    var message = $('#status-wave');

    $(document).on('change', '#selectWeather', function () {
        var wth = $('#selectWeather').val();
        switch (wth) {
            case('1'):
                defFadeOut = {start: 3000, end: 4000};
                defFadeIn  = {start: 1500, end: 2000};
                stasy      = {start: 1500, end: 2500};
                break;
            case('2'):
                defFadeOut = {start: 5000, end: 6000};
                defFadeIn  = {start: 1500, end: 1900};
                stasy      = {start: 600, end: 800};
                break;
            case('3'):
                defFadeOut = {start: 1500, end: 2000};
                defFadeIn  = {start: 1000, end: 2000};
                stasy      = {start: 0, end: 10};
                break;
            default:
                defFadeOut = {start: 2000, end: 3000};
                defFadeIn  = {start: 2000, end: 3000};
                stasy      = {start: 0, end: 500};
                break;
        }
    });

    $(document).on('change', '#selectSound', function () {
        var wth = $('#selectSound').val();
        switch (wth) {
            case('1'):
                audio.src  = '../samples/wave01.wav';
                audio.load();
                break;
            case('2'):
                audio.src  = '../samples/wave02.wav';
                audio.load();
                break;
            case('3'):
                audio.src  = '../samples/wave03.wav';
                audio.load();
                break;
            default:
                audio.src  = '../samples/wave04.wav';
                audio.load();
                break;
        }
    });

    audio.addEventListener("load", function() {
        audio.play();
    }, true);


    audio.ontimeupdate = function(i) {
        // print progress of waves
        progress = (audio.volume * 100);
        $('#progress-wave').attr('aria-valuenow', progress).css('width', progress + '%');
        // init value statement
        // this can permit to have different waves duration
        if (this.currentTime === 0) {
            fadeIn.time  = getRand(defFadeIn.start, defFadeIn.end);
            fadeOut.time = getRand(defFadeOut.start, defFadeOut.end);
        }

        // if the wave is high than fade out
        if (fadeOut.status) {
            message.text('The wave is crumbling in ' + (fadeOut.time/1000) + ' seconds').animate({opacity: 1}, 100);
            fadeOut.status = false;
            ffade(this, 'out', fadeOut, fadeIn, stasy, message);
        }

        // if the wave is low than fade in
        if (fadeIn.status) {
            message.text('The wave is growing in ' + (fadeIn.time/1000) + ' seconds').animate({opacity: 1}, 100);
            fadeIn.status = false;
            ffade(this, 'in', fadeIn, fadeOut, stasy, message);
        }

        // loop statement
        if((this.currentTime / this.duration) > 0.8) {
            this.currentTime = 0;
            this.play();
        }
    };

});