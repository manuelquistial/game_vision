var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameScene ()
    {
        Phaser.Scene.call(this, { key: 'gameScene', active: true });

        this.circleRadio = 60
        this.player = null;
        this.cursors = null;
        this.score = 0;
        this.scoreText = null;
    },

    preload: function ()
    {

    },

    create: function ()
    {

        var interface = this.physics.add.staticGroup();
        var xPosition = this.randomNumber(this.circleRadio, window.innerWidth - this.circleRadio)
        var yPosition = this.randomNumber(this.circleRadio, window.innerHeight - this.circleRadio)

        var circle = this.add.circle(xPosition, yPosition, this.circleRadio, 0xf00000).setInteractive();

        this.cursors = this.input.keyboard.createCursorKeys();

        circle.on('pointerup', function () {

            circle.setPosition(this.randomNumber(this.circleRadio, window.innerWidth - this.circleRadio*2), this.randomNumber(this.circleRadio, window.innerHeight - this.circleRadio*2));

        }, this);

        /*var stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        stars.children.iterate(function (child) {

            //child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });*/

        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        this.physics.add.collider(circle, interface);

        //this.physics.add.overlap(player, stars, this.collectStar, null, this);

        this.circle = circle;

        /*var button = this.add.image(800-16, 16, 'fullscreen', 0).setOrigin(1, 0).setInteractive();

        button.on('pointerup', function () {

            if (this.scale.isFullscreen)
            {
                button.setFrame(0);

                this.scale.stopFullscreen();
            }
            else
            {
                button.setFrame(1);

                this.scale.startFullscreen();
            }

        }, this);

        this.scoreText.setText('v15');*/

        var FKey = this.input.keyboard.addKey('F');

        FKey.on('down', function () {

            if (this.scale.isFullscreen)
            {
                this.scale.stopFullscreen();
            }
            else
            {
                this.scale.startFullscreen();
            }

        }, this);

    },

    update: function ()
    {

        /*var cursors = this.cursors;
        var player = this.player;

        if (cursors.left.isDown)
        {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-330);
        }*/
    },

    collectStar: function (player, star)
    {
        /*star.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);*/
    },

    // Function to generate random number 
    randomNumber: function (min, max) { 
        return Math.random() * (max - min) + min;
    } 

});

var config = {
    type: Phaser.AUTO,
    backgroundColor: 0,
    scale: {
        mode: Phaser.Scale.ENVELOP,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.NO_CENTER,
        width: window.innerWidth,
        height: window.innerHeight
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: GameScene
};

var game = new Phaser.Game(config);
