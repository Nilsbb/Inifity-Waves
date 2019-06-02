function Waves( $canvas, $width, $height ){
    this.numberOfWaves = 10;
    this.waveGap = 20;
    this.width = Waves.width = $width;
    this.height = Waves.height = $height;
    Waves.globalY = 0;
    this.move = -1;
    this.ctx = $canvas.getContext( '2d' );
    this.colour = "0,123,255";

    this.wavesArray = [];

    this.beginingY = Waves.height / 2;
    while(this.numberOfWaves--){
        this.wavesArray.push(new Wave($canvas, this.beginingY, this.colour));
        this.beginingY += this.waveGap;
    }

    this.update = function(height){
        var bL = this.wavesArray.length;
        while( bL-- ){
            this.wavesArray[ bL ].update(height);
        }

        if (((height * 10) + 0.3) * Waves.height < (this.move*0.45 + this.move)) {
            Waves.globalY -= 1.5;
        } else {
            Waves.globalY += 1;
        }

        if(Waves.globalY > (Waves.height / 2)-150){
            Waves.globalY = (Waves.height / 2)-150;
        } else if(Waves.globalY < -(Waves.height / 2)){
            Waves.globalY =  -(Waves.height / 2);
        }

        this.move = 10 * height * Waves.height;
    };

    this.draw = function(){
        this.ctx.save();
        var bL = this.wavesArray.length;
        while( bL-- ){
            this.wavesArray[ bL ].draw( );
        }
        this.ctx.restore();
    }
}

function Wave( $canvas, $y, $colour ){
    this.ctx = $canvas.getContext( '2d' );
    this.force = 0;
    this.wavePower = 40;
    this.count = $y;
    this.y = $y + Waves.globalY;
    this.alpha = 0.1;

    this.update = function(height){
        this.y = $y + Waves.globalY;
        this.force = Math.sin(this.count);
        this.count += (height <= 0.9) ? height + 0.01 : 0.1;
    };

    this.draw = function(){
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        this.ctx.fillRect(0,0,Waves.width,Waves.height);
        this.ctx.fillStyle = "rgba("+$colour+", "+this.alpha+")";
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.y);
        this.ctx.quadraticCurveTo(Waves.width / 4, this.y + ( this.wavePower * this.force ), Waves.width / 2, this.y);
        this.ctx.quadraticCurveTo(Waves.width * 0.75, this.y - ( this.wavePower * this.force ), Waves.width, this.y);
        this.ctx.lineTo(Waves.width, Waves.height);
        this.ctx.lineTo(0, Waves.height);
        this.ctx.lineTo(0, this.y);
        this.ctx.closePath();
        this.ctx.fill();
    };
}
