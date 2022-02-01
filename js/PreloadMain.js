export default class PreloadMain extends Phaser.Scene {

    constructor() {
        super({ key: 'PreloadMain' });
    }

    preload() {
        this.production = false

        if(this.production){
            this.gameType = window.parameters.game_type //From 1 to 3, this is the game to choice
            this.gameMode = window.parameters.game_mode //From 1 to 9, this is the screen mode divition 

            //"columns" and "rows" define the number of circles to show
            if(this.scale.orientation == 'portrait'){
                this.maxColumns = window.parameters.columns //This is an integer number, have dependencie of "rows"
                this.maxRows = window.parameters.rows //This is an integer number, have dependencie of "columns"
    
            }else{
                this.maxRows = window.parameters.columns //This is an integer number, have dependencie of "rows"
                this.maxColumns = window.parameters.rows //This is an integer number, have dependencie of "columns"
    
            }

            this.size = window.parameters.size //Integer number, size of circles in pixeles
            this.color = window.parameters.color_light //hexadecimal number of 6 digits ex, 0x000000
            this.colorFixation = window.parameters.color_fixation //hexadecimal number of 6 digits ex, 0x000000
            this.gameSelected = window.parameters.game_selected //Boolean true to reactive and false to proactive
            this.speed = window.parameters.time_light //Integer number (ms)
            this.timeDelay = window.parameters.time_delay_light //Integer number (ms)
            this.timeFix = window.parameters.time_fix_light //Integer number (ms)
            this.fixationFigure = window.parameters.fixation_figures //String, letter in uppercase to fix ex, "B"
            this.fixationEnable = window.parameters.fixation_light_enable //String, "on", "off", "blink"
            this.percentageFixation = window.parameters.porcent_fixation_light //Float, from 0.0 to 1.0  ex, 0.5
            this.finishTime = window.parameters.finish_time //Integer number (ms)
            this.audio = window.parameters.sound_enable //Boolean, true to enable audio and false to disable audio
            this.doubleMode = window.parameters.double_mode //Integer, 1 diagonal right, 2 left, 3 horizontal, 4 vertical, 5 aleatorio
            this.failureColorCircle = window.parameters.failure_color_circle//hexadecimal number of 6 digits ex, 0x000000, color of failure light in GONOGO
            this.porcentage_points = window.parameters.porcentage_points
            this.limit_figures = window.parameters.limit_figures

            this.source_path = "../../assets/Test02MatrizV1"

            this.id_users_tests = window.parameters.id_users_tests

        }else{
            this.gameType = 1 // From 1 to 4, this is the game to choice
            this.gameMode = 4 //
            if((this.scale.orientation == 'landscape-primary') || (this.scale.orientation == 'landscape')){
                this.maxColumns = 12
                this.maxRows = 5
            }else{
                this.maxColumns = 5
                this.maxRows = 12
            }
            this.maxColumns = 12
            this.maxRows = 10
            this.size = 35;
            this.color = 0xf00000
            this.colorFixation = 0xffffff
            this.gameSelected = false //true: reactive, false: proactive
            this.speed = 1000 // ms
            this.timeDelay = 500 // ms
            this.timeFix = 300 // ms
            this.fixationFigure = "A" //here select letter, ex, image_# : # 0,1,2,3
            this.fixationEnable = "off"//on, off, blink
            this.percentageFixation = 0.5
            this.finishTime = 2000 //time or limit_figures
            this.audio = true
            this.doubleMode = 5 //1 diagonal right, 2 left, 3 horizontal, 4 vertical, 5 aleatorio
            this.failureColorCircle = 0xefd000 
            this.porcentage_points = 0.5
            this.limit_figures = 0

            this.source_path = "."
            this.id_users_tests = "1"
        }

        this.load.audio('success', `${this.source_path}/mp3/success.mp3`);
        this.load.audio('failure', `${this.source_path}/mp3/failure.mp3`);

        this.load.image('button_home_white', `${this.source_path}/img/button_home_white.svg`);

        this.midMaxColumns = this.maxColumns / 2
        this.midMaxRows = this.maxRows / 2

        this.successAudio = null
        this.failureAudio = null

        let points_user = {
            test_time: 0,
            total_hits: 0,
            on_time: 0,
            missed: 0,
            failure: 0,
            precision: 0,
            total_go: 0
        }

        localStorage.setItem(this.id_users_tests, JSON.stringify(points_user)); 
    }

    create() {

        if((this.audio == "true") || (this.audio == true)){
            this.successAudio = this.sound.add('success', {
                loop: false
            })
    
            this.failureAudio = this.sound.add('failure', {
                loop: false
            })
        }

        if(this.gameType == 1){
            this.scene.start('BaseScene', this);
        }else if(this.gameType == 2){
            this.figureSelection = "letters"
            this.scene.start('FigureScene', this);
        }else if(this.gameType == 3){
            this.figureSelection = "numbers"
            this.scene.start('FigureScene', this);
        }else if(this.gameType == 4){
            this.figureSelection = "figures"
            this.scene.start('FigureScene', this);
        }else if(this.gameType == 5){
            this.scene.start('DoubleCircleScene', this);
        }else if(this.gameType == 6){
            this.figureSelection = "fix_letters"
            this.scene.start('FigureScene', this);
        }else if(this.gameType == 7){
            this.scene.start('GoNoGoScene', this);
        }else if(this.gameType == 8){
            this.scene.start('ReactionScene', this);
        }else if(this.gameType == 9){
            this.scene.start('ArrowsScene', this);
        }
    }

    // Function to generate random number 
    randomNumber(min_val, max_val) { 

        /*let exclude_array = [(localStorage.getItem('noRepeat') == null ? 0 : localStorage.getItem('no_repeat'))]
        const randomNumber = Math.floor(Math.random() * (max_val - min_val + 1 - exclude_array.length)) + min_val;
        let number = randomNumber + exclude_array.sort((a, b) => a - b).reduce((acc, element) => { return randomNumber >= element - acc ? acc + 1 : acc}, 0)
        localStorage.setItem('no_repeat', number)
        return number*/
        return Math.trunc(Math.random() * (max_val - min_val) + min_val);
    } 

    postGameData(_this, points){
        if(_this.production){
            let endpoint = 'matriz';
            let data = {"id_users_tests": _this.id_users_tests, "cvar": 1, ...points}
            $.post(endpoint, data)
            .done(function(value){});
        }
    }

    saveLocalPoints(_this, point_arg, time = 0){
        let points_user = JSON.parse(localStorage.getItem(_this.id_users_tests))
        points_user[point_arg] += ((point_arg == "precision") ? time : 1)
        localStorage.setItem(_this.id_users_tests, JSON.stringify(points_user)); 
    }

    menuButton(_this){

        let back = this.add.rectangle(0, 0);
        back.setFillStyle(0x000000);

        let button = _this.add.image(0, 0, 'button_home_white')
        button.x = -53
        button.y = -53
        button.displayWidth = 20
        button.scaleY = button.scaleX;
        this.add.container(_this.game.config.width + 42, _this.game.config.height + 44, [back, button])   
        
        back.setInteractive({ useHandCursor: true  })
        back.on('pointerdown', function () {
            _this.endGame = true
            window.location.href = "http://eyebix.online:8080/" + (_this.production ? window.languaje.languajeFlag : "en") + "/eyematrix"
        })
    }

    showMessageBox(_this, w, h) {
        let points_user = JSON.parse(localStorage.getItem(_this.id_users_tests))

        points_user.test_time = Math.trunc(_this.finishScene.getElapsed()/1000)

        if(_this.production){
            this.titleMessage = window.languaje.titleMessage
            this.buttonMessage = window.languaje.buttonMessage
            this.testTimeMessage = window.languaje.testTimeMessage
            this.totalHitsMessage = window.languaje.totalHitsMessage
            this.onTimeMessage = window.languaje.onTimeMessage
            this.missedMessage = window.languaje.missedMessage
            this.failureMessage = window.languaje.failureMessage
            this.precisionMessage = window.languaje.precisionMessage
            this.maximum_stage = window.languaje.maximum_stage
            this.totalGoMessage = window.languaje.total_go_message
            this.maxSpeedMessage = window.languaje.max_speed
            this.minSpeedMessage = window.languaje.min_speed

            this.lenguageFlag = window.languaje.languajeFlag
        }else{
            this.titleMessage = "Score Test"
            this.buttonMessage = "Finish"
            this.testTimeMessage = "Test Time"
            this.totalHitsMessage = "Total Hits"
            this.onTimeMessage = "On Time"
            this.missedMessage = "Missed"
            this.failureMessage = "Failure"
            this.precisionMessage = "Precision"
            this.maximum_stage = "Maximum Stage"
            this.totalGoMessage = "Total Go"
            this.maxSpeedMessage = "Maximun speed"
            this.minSpeedMessage = "Minimun speed"

            this.lenguageFlag = "en"
        }

        if(_this.gameType == 8){
            this.testTimeMessage = this.maximum_stage + ': ' + localStorage.getItem('reaction')
        }else{
            this.testTimeMessage = this.testTimeMessage + ': ' + points_user.test_time + ' seconds'
        }

        this.total_hits = points_user.total_hits
        this.missed = points_user.missed

        if(this.gameType == 7){
            this.totalGoMessage = this.totalGoMessage + ': ' + points_user.total_go
            this.failure = points_user.total_go - points_user.on_time
        }else{
            this.failure = this.total_hits - points_user.on_time
        }
        
        if(_this.gameSelected){
            this.missed = this.failure
            this.failure = points_user.failure
        }

        this.totalHitsMessage = this.totalHitsMessage + ': ' + this.total_hits
        this.onTimeMessage = this.onTimeMessage + ': ' + points_user.on_time
        if(_this.gameSelected){
            this.missedMessage = this.missedMessage + ': ' + this.missed
            this.failureMessage = this.failureMessage + ': ' + this.failure
        }else{
            if(this.speedProactive.length == 0){
                this.speedProactive = [0]
            }

            this.maxSpeedMessage = this.maxSpeedMessage + ': ' + Math.round(Math.max(...this.speedProactive)) + ' ms'
            this.minSpeedMessage = this.minSpeedMessage + ': ' + Math.round(Math.min(...this.speedProactive)) + ' ms'
        }
        this.precisionMessage = this.precisionMessage + ': ' + Math.round(points_user.precision == 0 ? 0 : points_user.precision / points_user.on_time) + ' ms'

        //just in case the message box already exists
        //destroy it
        if (this.msgBox) {
            this.msgBox.destroy();
        }
        //make a group to hold all the elements
        let msgBox = this.add.group();

        let back = this.add.rectangle(0, 0);
        back.setFillStyle(0x000000);
        back.setStrokeStyle(4, 0xffffff)

        //make a text field
        let title = this.add.text(0, 0, this.titleMessage)
            .setStyle({ fontFamily: 'Arial'});

        let test_time = this.add.text(0, 0, this.testTimeMessage)
            .setStyle({ fontFamily: 'Arial'});

        let total_hints = this.add.text(0, 0, this.totalHitsMessage)
            .setStyle({ fontFamily: 'Arial'});

        let total_go = null
        if(_this.gameType == 7){
            total_go = this.add.text(0, 0, this.totalGoMessage)
            .setStyle({ fontFamily: 'Arial'});
        }

        let on_time = this.add.text(0, 0, this.onTimeMessage)
            .setStyle({ fontFamily: 'Arial'});

            
        let missed = null
        let failure = null
        let maxSpeed = null
        let minSpeed = null

        if(this.gameType != 5){
            if(this.gameSelected){
                missed = this.add.text(0, 0, this.missedMessage)
                    .setStyle({ fontFamily: 'Arial'});

                failure = this.add.text(0, 0, this.failureMessage)
                    .setStyle({ fontFamily: 'Arial'});
            }else{
                minSpeed = this.add.text(0, 0, this.minSpeedMessage)
                    .setStyle({ fontFamily: 'Arial'});

                maxSpeed = this.add.text(0, 0, this.maxSpeedMessage)
                    .setStyle({ fontFamily: 'Arial'});
            }
        }
            
        let precision = this.add.text(0, 0, this.precisionMessage)
            .setStyle({ fontFamily: 'Arial'});

        let button = this.add.text(0, 0, this.buttonMessage)
            .setPadding(10)
            .setStyle({ fontFamily: 'Arial', backgroundColor: '#111' })

        //set the textfeild to wrap if the text is too long
        title.wordWrap = true;
        //make the width of the wrap 90% of the width 
        //of the message box
        title.wordWrapWidth = w * .8;
        //

        back.setSize(w, h)
        
        //add the elements to the group
        msgBox.add(back)
        msgBox.add(title)
        msgBox.add(test_time)
        msgBox.add(total_hints)
        if(_this.gameType == 7){
            msgBox.add(total_go)
        }
        msgBox.add(on_time)
        if(_this.gameType != 5){
            if(_this.gameSelected){
                msgBox.add(missed)
                msgBox.add(failure)
            }else{
                msgBox.add(maxSpeed)
                msgBox.add(minSpeed)
            }
        }
        msgBox.add(precision)
        msgBox.add(button)
        //
        //set the close button
        //in the center horizontall
        
        msgBox.setXY(this.aGrid.w / 2, this.aGrid.h / 2)
        msgBox.setOrigin(0.5)

        //set the text in the middle of the message box
        title.x = this.aGrid.w  / 2 ;
        title.y = (this.aGrid.h  / 2) - (_this.gameType == 7 ? 160 : 140);


        test_time.x = this.aGrid.w  / 2 ;
        
        test_time.y = (this.aGrid.h  / 2) - (_this.gameType == 5 ? 40 : (_this.gameType == 7 ? 100 : 70));
      


        total_hints.x = this.aGrid.w  / 2 ;

        total_hints.y = (this.aGrid.h  / 2) - (_this.gameType == 5 ? 10 : (_this.gameType == 7 ? 70 : 40));
        
 
        if(_this.gameType == 7){
            total_go.x = this.aGrid.w  / 2 ;
            total_go.y = (this.aGrid.h  / 2) - 40;
        }

        on_time.x = this.aGrid.w  / 2 ;
        
        on_time.y = (this.aGrid.h  / 2) - (_this.gameType == 5 ? -20 : 10);
        


        if(_this.gameType != 5){
            if(_this.gameSelected){
                missed.x = this.aGrid.w  / 2 ;
                missed.y = (this.aGrid.h  / 2) + 20;

                failure.x = this.aGrid.w  / 2 ;
                failure.y = (this.aGrid.h  / 2) + (_this.gameSelected ? 50 : 20)
            }else{
                minSpeed.x = this.aGrid.w  / 2 ;
                minSpeed.y = (this.aGrid.h  / 2) + 20;

                maxSpeed.x = this.aGrid.w  / 2 ;
                maxSpeed.y = (this.aGrid.h  / 2) + (_this.gameSelected ? 50 : 50)
            }
        }

        precision.x = this.aGrid.w  / 2 ;
        precision.y = (this.aGrid.h  / 2) + (_this.gameSelected ? 80 : 80)


        button.x = this.aGrid.w  / 2 ;
        button.y = (this.aGrid.h  / 2) + 150;
        button.setOrigin(0.5)
        //
        //set the text in the middle of the message box
        //make a state reference to the messsage box

        const children_length = msgBox.getChildren().length
        msgBox.getChildren()[children_length - 1].setInteractive({ useHandCursor: true  })
        msgBox.getChildren()[children_length - 1]
            .on('pointerover', () => button.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => button.setStyle({ fill: '#FFF' }))
            .on('pointerup', function () {
                window.location.href = "http://eyebix.online:8080/" + this.lenguageFlag + "/eyematrix"
            }, this);

        this.msgBox = msgBox;
    }
}