import {default as AlignGrid} from './AlignGrid.js'

export default class ReactionGameScene extends Phaser.Scene {

    timerReactive;
    timerProactive;
    timerDelayLight;
    timerFixLight;

    constructor() {
        super({ key: 'ReactionGameScene' });
    }

    init(data){
        this.production = data.production
        this.id_users_tests = data.id_users_tests
        this.gameType = data.gameType

        this.size = data.size
        this.color = data.color
        this.finishTime = data.finishTime
        this.percentageFixation = data.percentageFixation
        this.gameSelected = data.gameSelected
        this.timeDelay = data.timeDelay
        this.porcentage_points = data.porcentage_points

        this.showMessageBox = data.showMessageBox
        this.postGameData = data.postGameData
        this.successAudio = data.successAudio
        this.failureAudio = data.failureAudio

        //functions
        this.randomNumber = data.randomNumber
        this.saveLocalPoints = data.saveLocalPoints
        this.menuButton = data.menuButton

        const reaction = localStorage.getItem('reaction')

        this.reactionStates = data.reactionStates
        this.reactionStatesData = this.reactionStates['reaction_' + reaction]

        this.speed = this.reactionStatesData.speed
     
        if((this.scale.orientation == 'landscape-primary') || (this.scale.orientation == 'landscape')){
            this.maxColumns = this.reactionStatesData.columns
            this.maxRows = this.reactionStatesData.rows
        }else{
            this.maxRows = this.reactionStatesData.columns
            this.maxColumns = this.reactionStatesData.rows
        }

        this.message_duration = 1000
        this.amount_time = 4
        this.points_stage = 0
    }

    preload(){
        this.stateMessageConfig = {delay: this.message_duration, callback: this.countStateMessage, args: [this], loop: true, paused: false}
        this.reactiveConfig = {delay: this.speed, callback: this.updatePosition, args: [this], loop: true, paused: false}
        this.proactiveConfig = {delay: this.speed, loop: false, paused: false}
    }

    create(){
        
        var gridConfig = {
            'scene': this,
            'height': this.game.config.height,
            'width': this.game.config.width
        }
        
        this.aGrid = new AlignGrid(gridConfig);

        this.timerStateMessage = this.time.addEvent(this.stateMessageConfig)
        this.menuButton(this)
    }

    countStateMessage(_this){
        if(_this.amount_time == 0){
            _this.stateMessage()
            _this.timerStateMessage.remove()
            _this.initializacion()
        }else{
            _this.stateMessage()
            _this.amount_time = _this.amount_time - 1
        }
    }

    stateMessage(){

        let w = this.aGrid.w * .3
        let h = this.aGrid.h * .4

        if(this.production){
            this.stageMessage = window.languaje.stage_message
        }else{
            this.stageMessage = 'Stage'
        }

        if (this.amount_time == 0) {
            this.back ? this.back.destroy() : null
            this.stage_message ? this.stage_message.destroy() : null
        }else{
            this.back ? this.back.destroy() : null
            this.stage_message ? this.stage_message.destroy() : null

            //make a group to hold all the elements
            let msgBox = this.add.group();
            //make a text field
            if(this.amount_time == 4){
                this.stageMessage = this.stageMessage + ' ' + localStorage.getItem('reaction')
            }else{
                
                this.stageMessage = this.amount_time
            }

            let back = this.add.rectangle(0, 0);
            back.setFillStyle(0x000000);
            back.setStrokeStyle(4, 0xffffff)

            let stage_message = this.add.text(0, 0, this.stageMessage)
                .setStyle({ fontSize: '64px', fontFamily: 'Arial'});

            //set the textfeild to wrap if the text is too long
            stage_message.wordWrap = true;
            //make the width of the wrap 90% of the width 
            //of the message box
            stage_message.wordWrapWidth = w * .8;
            //

            back.setSize(w, h)
            
            //add the elements to the group
            msgBox.add(back)
            msgBox.add(stage_message)

            msgBox.setXY(this.aGrid.w / 2, this.aGrid.h / 2)
            msgBox.setOrigin(0.5)

            //set the text in the middle of the message box
            stage_message.x = this.aGrid.w  / 2 ;
            stage_message.y = (this.aGrid.h  / 2);

            this.msgBox = msgBox;
            this.back = back
            this.stage_message = stage_message
        }
    }

    initializacion(){

        //this.aGrid.showNumbers();
        if(this.aGrid.ch / 2 > this.aGrid.cw / 2){
            this.radioLights = this.aGrid.cw / 2
            this.radioFixLights = this.aGrid.cw / 2
        }else{
            this.radioLights = this.aGrid.ch / 2
            this.radioFixLights = this.aGrid.ch / 2
        }

        this.fixationRadio = this.radioFixLights * this.percentageFixation

        if((this.size >= (this.radioFixLights * 0.2)) && (this.size <= this.radioFixLights)){
            this.radioLights = this.size
        }else if(this.size < (this.radioFixLights * 0.2)){
            this.radioLights = (this.radioFixLights * 0.2)
        }else{
            this.radioLights = this.radioFixLights
        }

        this.gameModeActionLight()
        this.light = this.add.circle(0, 0, this.radioLights, this.color);
        this.light.setInteractive({ useHandCursor: true  }, new Phaser.Geom.Circle(this.radioLights, this.radioLights, this.radioLights), Phaser.Geom.Circle.Contains)

        this.aGrid.placeAt(this.xLightPosition, this.yLightPosition, this.light);

        if(this.gameSelected){
            if(this.timerProactive){
                this.timerProactive.remove()
            }
            this.timerReactive = this.time.addEvent(this.reactiveConfig)
        }else{
            if(this.timerReactive){
                this.timerReactive.remove()
            }
            this.timerProactive = this.time.addEvent(this.proactiveConfig)
        }

        let points = {
            "time_reaction": 0,
            "position_x": this.xLightPosition,
            "position_y": this.yLightPosition,
            "response": 0
        }
        this.postGameData(this, points)
        this.saveLocalPoints(this, 'total_hits')

        this.light.on('pointerdown', function () {
            this.clickOnLight = true
            
            if(this.gameSelected){
                let timeLimitLight = this.timerReactive.getElapsed()
                this.timerReactive.remove()

                if(timeLimitLight < this.speed){
                    this.successAudio ? this.successAudio.play() : null
                    let points = {
                        "time_reaction": timeLimitLight,
                        "position_x": this.xLightPosition,
                        "position_y": this.yLightPosition,
                        "response": 1
                    }
                    this.postGameData(this, points)
                    
                    this.points_stage = this.points_stage + 1
                    this.saveLocalPoints(this, 'on_time')
                    this.saveLocalPoints(this, 'precision', timeLimitLight)
                }

            }else{
                let timeLimitLight = this.timerProactive.getElapsed()
                this.timerProactive.remove()

                if(timeLimitLight < this.speed){
                    this.successAudio ? this.successAudio.play() : null
                    let points = {
                        "time_reaction": timeLimitLight,
                        "position_x": this.xLightPosition,
                        "position_y": this.yLightPosition,
                        "response": 1
                    }
                    this.postGameData(this, points)

                    this.points_stage = this.points_stage + 1
                    this.saveLocalPoints(this, 'on_time')
                    this.saveLocalPoints(this, 'precision', timeLimitLight)

                }else{
                    this.failureAudio ? this.failureAudio.play() : null
                }
            }

            this.light.visible = false
            this.timerDelayLight = this.time.addEvent({delay: this.timeDelay, callback: this.delayLight, args: [this], loop: false, paused: false})
        }, this);

        if(this.gameSelected){
            this.input.on('pointerdown', (data) => {
                if(!this.endGame){
                    if(this.clickOnLight){
                        this.clickOnLight = false
                    }else{
                        this.failureAudio ? this.failureAudio.play() : null
                        let timeLimitLight = this.timerReactive.getElapsed()
                        let points = {
                            "time_reaction": timeLimitLight,
                            "position_x": Math.trunc(data.downX / this.aGrid.cw),
                            "position_y": Math.trunc(data.downY / this.aGrid.ch),
                            "response": 2
                        }
                        this.postGameData(this, points)
                        this.saveLocalPoints(this, 'failure')
                    }
                }
            });
        }

        this.finishScene = this.time.addEvent({delay: this.finishTime, callback: this.finish, args: [this], loop: false, paused: false})
        
    }

    gameModeActionLight(){
        this.xLightPosition = this.randomNumber(0, this.maxColumns)
        this.yLightPosition = this.randomNumber(0, this.maxRows)
    }

    updatePosition(_this){
        
        let points = {
            "time_reaction": 0,
            "position_x": _this.xLightPosition,
            "position_y": _this.yLightPosition,
            "response": 0
        }
        _this.postGameData(_this, points)
        _this.saveLocalPoints(_this, 'total_hits')

        _this.gameModeActionLight()
        _this.aGrid.placeAt(_this.xLightPosition, _this.yLightPosition, _this.light);
    }

    delayLight(_this){
        _this.light.visible = true
        if(_this.gameSelected){

            _this.timerReactive = _this.time.addEvent(_this.reactiveConfig)
        }else{
            
            _this.timerProactive = _this.time.addEvent(_this.proactiveConfig)

            let points = {
                "time_reaction": 0,
                "position_x": _this.xLightPosition,
                "position_y": _this.yLightPosition,
                "response": 0
            }
            _this.postGameData(_this, points)
            _this.saveLocalPoints(_this, 'total_hits')
        }
        
        _this.gameModeActionLight()
        _this.aGrid.placeAt(_this.xLightPosition, _this.yLightPosition, _this.light);
    }

    reactionStatesMode(_this){
        const reaction = parseInt(localStorage.getItem('reaction')) + 1

        if(reaction == Object.keys(_this.reactionStates).length + 1){
            _this.finish(_this)
        }else{
            let average_points = Math.round((_this.finishTime / (_this.speed + _this.timeDelay)) * _this.porcentage_points)

            if(_this.points_stage >= average_points){
                localStorage.setItem('reaction', reaction)
                _this.scene.start('ReactionGameScene', _this);
            }else{
                _this.finish(_this)
            }
        }
    }

    finish(_this){
        _this.light.destroy()
        _this.endGame = true
        _this.timerProactive ? _this.timerProactive.paused = true : null
        _this.timerReactive ? _this.timerReactive.paused = true : null
        _this.timerDelayLight ? _this.timerDelayLight.paused = true : null
        _this.finishScene.paused = true
        _this.showMessageBox(_this, _this.aGrid.w * .3, _this.aGrid.h * .65);
    }
}