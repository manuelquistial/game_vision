export default class PreloadMain extends Phaser.Scene {

    timerReactive;
    timerProactive;
    timerDelayLight;
    timerFixLight;

    constructor() {
        super({ key: 'PreloadMain' });
    }

    preload() {

        /*this.gameType = window.parameters.game_type
        this.gameMode = window.parameters.game_mode
        this.maxColumns = window.parameters.columns
        this.maxRows = window.parameters.rows
        this.size = window.parameters.size
        this.color = window.parameters.color_light
        this.colorFixation = window.parameters.color_fixation
        this.gameSelected = window.parameters.game_elected //true: reactive, false: proactive
        this.speed = window.parameters.time_light // ms
        this.timeDelay = window.parameters.time_delay_light // ms
        this.timeFix = window.parameters.time_fix_light // ms
        this.fixationLetter = window.parameters.letter_fixation
        this.fixationEnable = window.parameters.fixation_light_enable //on, off, blink
        this.percentageFixation = window.parameters.porcent_fixation_light
        this.finishTime = window.parameters.finish_time
        this.audio = window.parameters.sound_enable*/
        
        window.parameters.id_users_tests = 1
        this.gameType = 2
        this.gameMode = 1
        this.maxColumns = 5
        this.maxRows = 4
        this.size = 90;
        this.color = 0xf00000
        this.colorFixation = 0xffffff
        this.gameSelected = false //true: reactive, false: proactive
        this.speed = 2000 // ms
        this.timeDelay = 10 // ms
        this.timeFix = 500 // ms
        this.fixationLetter = "A"
        this.fixationEnable = 'on'//on, off, blink
        this.percentageFixation = 0.5
        this.finishTime = 10000
        this.audio = true

        this.midMaxColumns = this.maxColumns / 2
        this.midMaxRows = this.maxRows / 2

        this.successAudio = null
        this.failureAudio = null

        this.load.audio('success', './mp3/success.mp3');
        this.load.audio('failure', './mp3/failure.mp3');
    }

    create() {

        if(this.audio){
            this.successAudio =  this.sound.add('success', {
                loop: false
            })
    
            this.failureAudio =  this.sound.add('failure', {
                loop: false
            })
        }

        if(this.gameType == 1){
            this.scene.start('BaseScene', this);
        }else if(this.gameType == 2){
            this.scene.start('LetterScene', this);
        }
    }

    // Function to generate random number 
    randomNumber(min_val, max_val) { 
        return Math.trunc(Math.random() * (max_val - min_val) + min_val);
    } 

    postGameData(points){
        let endpoint = 'matriz';
        let data = {"id_users_tests": window.parameters.id_users_tests, "cvar": 1, ...points}
        $.post(endpoint, data)
        .done(function(data){});
    }

    showMessageBox(text, w, h) {
        //just in case the message box already exists
        //destroy it
        if (this.msgBox) {
            this.msgBox.destroy();
        }
        //make a group to hold all the elements
        var msgBox = this.add.group();

        var back = this.add.rectangle(0, 0);
        back.setFillStyle(0x000000);
        
        //make a text field
        var message = this.add.text(0, 0, text)
            .setStyle({ fontFamily: 'Arial', backgroundColor: '#111' });

        var button = this.add.text(0, 0, window.languaje.endBtn)
            .setPadding(10)
            .setStyle({ fontFamily: 'Arial', backgroundColor: '#111' })

        //set the textfeild to wrap if the text is too long
        message.wordWrap = true;
        //make the width of the wrap 90% of the width 
        //of the message box
        message.wordWrapWidth = w * .9;
        //
        //
        back.setSize(w, h)
        
        //add the elements to the group
        msgBox.add(button)
        msgBox.add(back)
        msgBox.add(message);
        //
        //set the close button
        //in the center horizontall
        
        msgBox.setXY(this.aGrid.w / 2, this.aGrid.h / 2)
        msgBox.setOrigin(0.5)

        //set the text in the middle of the message box
        message.x = this.aGrid.w  / 2 ;
        message.y = (this.aGrid.h  / 2) - 50;
        message.setOrigin(0.5)

        button.x = this.aGrid.w  / 2 ;
        button.y = (this.aGrid.h  / 2) + 50;
        button.setOrigin(0.5)
        //
        //set the text in the middle of the message box
        //make a state reference to the messsage box
        msgBox.getChildren()[0].setInteractive({ useHandCursor: true  })
        msgBox.getChildren()[0]
            .on('pointerover', () => button.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => button.setStyle({ fill: '#FFF' }))
            .on('pointerup', function () {
                window.location.href = "http://www.w3schools.com";
            }, this);

        this.msgBox = msgBox;
    }
}