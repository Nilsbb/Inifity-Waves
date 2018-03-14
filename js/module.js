getRand = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// function to fade waves
ffade = function (element, type, to, from, wait, message) {
    // recognize if is fadein or fadeout
    wait = (type === 'in') ? wait : 0;
    type = (type === 'in') ? 1 : 0.05;
    setTimeout(function(){
        // fade audio in to.time
        element.fade(element.volume(), type, to.time);
        // wait sound animation to change the state of next step
        setTimeout(function(){
            from.status = true;
            // fade and slide out the message
            message.animate({'margin-left': '100px', opacity: '0'}, 500).animate({'margin-left': '0'}, 1);
        }, to.time);

    },
        // time to wait the next wave
        getRand(wait.start, wait.end) );
};
// -------------- Values

// interval time for fade in/out
var defFadeOut = {start: 2000, end: 3000};
var defFadeIn  = {start: 2000, end: 3000};
// timeout before fade
var stasy      = {start: 0,    end: 200};
// var for audio time
var time       = 0;

// -------------- Settings

// init fade in/out
var fadeOut = { status: true,  time: getRand(defFadeOut.start, defFadeOut.end)};
var fadeIn  = { status: false, time: getRand(defFadeIn.start, defFadeIn.end)};

// Unlock audio playback by playing an empty buffer on the first touchend event
Howler.mobileAutoEnable = false;
// Audio settings
var audio = new Howl({
    src: ['./samples/wave01.wav'],
    loop: true,
    volume: 0
});

// -------------- Come on

jQuery(function () {
    var message = jQuery('#status-wave');

    jQuery(document).on('change', '#selectWeather', function () {
        var wth = jQuery('#selectWeather').val();
        switch (wth) {
            case('1'):
                // Sunny
                defFadeOut = {start: 3000, end: 4000};
                defFadeIn  = {start: 1500, end: 2000};
                stasy      = {start: 1500, end: 2500};
                break;
            case('2'):
                // Hotty
                defFadeOut = {start: 5000, end: 6000};
                defFadeIn  = {start: 1500, end: 1900};
                stasy      = {start: 600, end: 800};
                break;
            case('3'):
                // Cloudy
                defFadeOut = {start: 1500, end: 2000};
                defFadeIn  = {start: 1000, end: 2000};
                stasy      = {start: 0, end: 10};
                break;
            default:
                // Everyday
                defFadeOut = {start: 2000, end: 3000};
                defFadeIn  = {start: 2000, end: 3000};
                stasy      = {start: 0, end: 500};
                break;
        }
    });

    jQuery(document).on('change', '#selectSound', function () {
        var wth = jQuery('#selectSound').val();
        switch (wth) {
            case('1'):
                audio.changeSrc('./samples/wave01.wav'); // Bali
                break;
            case('2'):
                audio.changeSrc('./samples/wave02.wav'); // New York
                break;
            case('3'):
                audio.changeSrc('./samples/wave03.wav'); // Cape Town
                break;
            default:
                audio.changeSrc('./samples/wave04.wav'); // Scilla
                break;
        }
    });

    // control for start button
    jQuery(document).on('click touch-end', '#startbutton', function () {
        audio.on('stop', audio.play());
        // jQuery start container father of startbutton
        var startcontainer = jQuery('#startcontainer');
        // Move on top start container
        startcontainer.animate({top: '-100vh'}, 1000);
        // Hide start container
        setTimeout(function () {
            startcontainer.hide();
        }, 1000);
    });

    setInterval(function () {
        window.requestAnimationFrame(function() {
            time = audio.seek();
            // print progress of waves
            jQuery('#progress-wave').attr('aria-valuenow', (audio.volume() * 100)).css('width', (audio.volume() * 100) + '%');
            // init value statement, this can guarantee different waves duration
            if (time > 0 && time <= 0.2) {
                fadeIn.time  = getRand(defFadeIn.start, defFadeIn.end);
                fadeOut.time = getRand(defFadeOut.start, defFadeOut.end);
            }
            // if the wave is high than fade out
            if (fadeOut.status) {
                message.text('The wave is crumbling in ' + (fadeOut.time/1000) + ' seconds').animate({opacity: 1}, 100);
                fadeOut.status = false;
                ffade(audio, 'out', fadeOut, fadeIn, stasy, message);
            }
            // if the wave is low than fade in
            if (fadeIn.status) {
                message.text('The wave is growing in ' + (fadeIn.time/1000) + ' seconds').animate({opacity: 1}, 100);
                fadeIn.status = false;
                ffade(audio, 'in', fadeIn, fadeOut, stasy, message);
            }
        });
    }, 200);
});