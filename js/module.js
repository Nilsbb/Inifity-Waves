getRand = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

let start = function() {
	let waveOne = new SoundWave(0.5);
	let waveTwo = new SoundWave(0.4);
	let waveBkg = new SoundWave(0.01, 3);

	let group = new Pizzicato.Group([waveOne.audio, waveTwo.audio, waveBkg.audio]);

	group.addEffect(lowPassFilter);
	group.connect(analyser);


	// jQuery start container father of startbutton
	let startcontainer = jQuery("#startcontainer");
	let app = jQuery("#app");
	// Move on top start container
	startcontainer.css({'top': "-100vh"});
	app.css({'opacity': 1, 'filter': 'blur(0px)', '-webkit-filter': 'blur(0px)'});
	// Hide start container
	setTimeout(function () {
		startcontainer.hide();
	}, 1000);

	waveBkg.play();
	waveOne.harmonize();
	waveTwo.harmonize();
};

let lowPassFilter = new Pizzicato.Effects.LowPassFilter({
	frequency: 5530,
	peak: 3
});

let analyser = Pizzicato.context.createAnalyser();
	analyser.fftSize = 2048;
const sampleBuffer = new Float32Array(analyser.fftSize);

class SoundWave {
	constructor(volume, attack) {
		this.defFadeOut = { start: 5, end: 9 }; // interval time for fade out
		this.defFadeIn  = { start: 2.5, end: 4.9 }; // interval time for fade in
		this.defStasy   = { start: 1, end: 6 }; // timeout before fade

		this.fadeOut = getRand(this.defFadeOut.start, this.defFadeOut.end);
		this.fadeIn  = getRand(this.defFadeIn.start, this.defFadeIn.end);
		this.stasy   = getRand(this.defStasy.start, this.defStasy.end);

		this.duration = this.fadeIn + this.fadeOut + this.stasy;

		this.audio = new Pizzicato.Sound(
			{
				source: "script",
				options: {
					attack: 1,
					release: 1,
					volume: 0.6,
					audioFunction: function(e) {
						var output = e.outputBuffer.getChannelData(0);
						for (var i = 0; i < e.outputBuffer.length; i++)
							output[i] = Math.random();
					}
				}
			}
		);

		this.audio.volume = volume;
		this.audio.attack = attack;
	}

	build() {
		this.fadeIn   = getRand(this.defFadeIn.start, this.defFadeIn.end);
		this.fadeOut  = getRand(this.defFadeOut.start, this.defFadeOut.end);
		this.stasy    = getRand(this.defStasy.start, this.defStasy.end);

		this.duration = this.fadeIn + this.fadeOut + this.stasy;

		this.audio.attack  = this.fadeIn;
		this.audio.release = this.fadeOut;
	}

	play() {
		this.audio.play();
	}

	pause() {
		this.audio.pause();
	}

	harmonize () {
		let self = this;
		setInterval(function() {
			self.build();
			self.play();
			setTimeout(function() {
				self.pause();
			}, self.fadeIn * 1000);
		}, self.duration * 1000);
	};
}


// -------------- Come on

jQuery(function() {
	let canvas = document.createElement("canvas");
	canvas.width = window.innerWidth;
	canvas.height = 417;

	let container = document.getElementById("container");    // Get the <ul> element to insert a new node
	container.insertBefore(canvas, container.childNodes[0]);

	let waves = new Waves( canvas, window.innerWidth, 417 );

	setInterval( function () {
		analyser.getFloatTimeDomainData(sampleBuffer);
		let peakInstantaneousPower = 0;
		for (let i = 0; i < sampleBuffer.length; i++) {
			const power = sampleBuffer[i] ** 2;
			peakInstantaneousPower = Math.max(power, peakInstantaneousPower);
		}
		const peakInstantaneousPowerDecibels = 10 * Math.log10(peakInstantaneousPower);
		const peakInstantConvert = 100 - (Math.abs(peakInstantaneousPowerDecibels) / 60) * 100;
		jQuery('#progress-wave').attr('aria-valuenow', (peakInstantConvert)).css('width', (peakInstantConvert) + '%');

		// draw waves
		waves.update(Math.abs(peakInstantConvert / 1000));
		waves.draw();
	}, 20);


	// control for start button
	jQuery(document).on("click touch-end", "#startbutton", function () {


	});

	jQuery(document).on("input", "#waveSound", function () {
		let freq = jQuery(this).trigger('change').val();
		lowPassFilter.frequency = parseInt(freq);
	});
});
