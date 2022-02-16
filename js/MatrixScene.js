import {default as AlignGrid} from './AlignGrid.js'

export default class BaseScene extends Phaser.Scene {

    timerReactive;
    timerProactive;
    timerDelayLight;
    timerFixLight;

    constructor() {
        super({ key: 'BaseScene' });
    }

    init(data){
        this.production = data.production
        this.id_users_tests = data.id_users_tests

        this.gameMode = data.gameMode
        this.maxColumns = data.maxColumns
        this.maxRows = data.maxRows
        this.size = data.size
        this.color = data.color
        this.colorFixation = data.colorFixation
        this.secondColor = data.secondColor
        this.gameSelected = data.gameSelected
        this.speed = data.speed
        this.timeDelay = data.timeDelay
        this.timeFix = data.timeFix
        this.fixationEnable = data.fixationEnable
        this.percentageFixation = data.percentageFixation
        this.finishTime = data.finishTime
        this.midMaxColumns = data.midMaxColumns
        this.midMaxRows = data.midMaxRows
        this.successAudio = data.successAudio
        this.failureAudio = data.failureAudio
        this.showMessageBox = data.showMessageBox
        this.postGameData = data.postGameData
        this.limit_figures = data.limit_figures

        this.doubleColor = data.doubleColor

        //functions
        this.randomNumber = data.randomNumber
        this.saveLocalPoints = data.saveLocalPoints
        this.menuButton = data.menuButton

        this.speedProactive = []
    }

    preload(){
        this.reactiveConfig = {delay: this.speed, callback: this.updatePosition, loop: false, callbackScope: this, paused: false}

        if(this.doubleColor){
            this.colors = [this.color, this.secondColor]
        }
    }

    create() {

        var gridConfig = {
            'scene': this,
            'height': this.game.config.height,
            'width': this.game.config.width
        }
        
        this.aGrid = new AlignGrid(gridConfig);
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
   
        if(this.fixationEnable !== 'off'){
            if(this.radioLights > (this.radioFixLights - this.fixationRadio)){
                this.radioLights = this.radioFixLights - this.fixationRadio
            }
            this.fixationLight = this.add.circle(this.aGrid.w / 2, this.aGrid.h / 2, this.fixationRadio, this.colorFixation);
            if(this.fixationEnable === 'blink'){
                this.fixationLight.setVisible(true)
                this.timerFixLight = this.time.addEvent({delay: this.timeFix, callback: this.fixLight, callbackScope: this, loop: true, paused: false})
            }
        }else{
            if(this.timerFixLight){
                this.timerFixLight.remove()
            }
        }

        this.gameModeAction()
        if(this.doubleColor){
            this.color = this.randomColors()
        }
        this.lights = this.add.circle(0, 0, this.radioLights, this.color);
        this.lights.setVisible(false)
        this.lights.setInteractive({ useHandCursor: true  }, new Phaser.Geom.Circle(this.radioLights, this.radioLights, this.radioLights), Phaser.Geom.Circle.Contains)

        this.aGrid.placeAt(this.xLightPosition, this.yLightPosition, this.lights);

        let points = {
            "time_reaction": 0,
            "position_x": this.xLightPosition,
            "position_y": this.yLightPosition,
            "response": 0
        }
        this.postGameData(this, points)
        this.saveLocalPoints(this, 'total_hits')

        this.lights.on('pointerdown', function () {
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
                    
                    this.saveLocalPoints(this, 'on_time')
                    this.saveLocalPoints(this, 'precision', timeLimitLight)
                }

            }else{
                let timeLimitLight = this.timerProactive.getElapsed()
                this.timerProactive.remove()

                this.successAudio ? this.successAudio.play() : null
                let points = {
                    "time_reaction": timeLimitLight,
                    "position_x": this.xLightPosition,
                    "position_y": this.yLightPosition,
                    "response": 1
                }
                this.postGameData(this, points)

                this.speedProactive.push(timeLimitLight)

                this.saveLocalPoints(this, 'on_time')
                this.saveLocalPoints(this, 'precision', timeLimitLight)

            }

            this.lights.visible = false
            this.timerDelayLight = this.time.addEvent({delay: this.timeDelay, callback: this.delayLight, callbackScope: this, loop: false, paused: false})
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

        this.menuButton(this)
        
        if(this.gameSelected){
            if(this.timerProactive){
                this.timerProactive.remove()
            }
            this.timerReactive = this.time.addEvent(this.reactiveConfig)
        }else{
            if(this.timerReactive){
                this.timerReactive.remove()
            }
            this.timerProactive = this.time.delayedCall({})
        }

        this.lights.setVisible(true)

        if((this.finishTime != 0) && (this.limit_figures == 0)){
            this.finishScene = this.time.addEvent({delay: this.finishTime, callback: this.finishGame, callbackScope: this, loop: false, paused: false})
        }else if(this.limit_figures != 0){
            this.finishScene = this.time.delayedCall({})
        }
    }

    update() {
        if((this.finishTime == 0) && (this.limit_figures != 0)){
            let total_hits = JSON.parse(localStorage.getItem(this.id_users_tests)).total_hits
            if(this.limit_figures == total_hits){
                if(this.gameSelected){
                    this.timerReactive.remove()
                }else{
                    this.timerProactive.remove()
                }
                this.time.addEvent({delay: this.timeDelay, callback: this.finish, callbackScope: this, loop: false, paused: false})
            }
        }
    }

    gameModeAction(){
        switch(this.gameMode){
            //full screen
            case 1:
                this.xLightPosition = this.randomNumber(0, this.maxColumns)
                this.yLightPosition = this.randomNumber(0, this.maxRows)
                break
            //left upside
            case 2:
                this.xLightPosition = this.randomNumber(0, this.midMaxColumns)
                this.yLightPosition = this.randomNumber(0, this.midMaxRows)
                break;
            //right upside
            case 3:
                this.xLightPosition = this.randomNumber(this.midMaxColumns, this.maxColumns)
                this.yLightPosition = this.randomNumber(0, this.midMaxRows)
                break;
            //left downside
            case 4:
                this.xLightPosition = this.randomNumber(0, this.midMaxColumns)
                this.yLightPosition = this.randomNumber(this.midMaxRows, this.maxRows)
                break;
            //right downside
            case 5:
                this.xLightPosition = this.randomNumber(this.midMaxColumns, this.maxColumns)
                this.yLightPosition = this.randomNumber(this.midMaxRows, this.maxRows)
                break;
            //upside
            case 6:
                this.xLightPosition = this.randomNumber(0, this.maxColumns)
                this.yLightPosition = this.randomNumber(0, this.midMaxRows)
                break;
            //downside
            case 7:
                this.xLightPosition = this.randomNumber(0, this.maxColumns)
                this.yLightPosition = this.randomNumber(this.midMaxRows, this.maxRows)
                break;
            //left side
            case 8:
                this.xLightPosition = this.randomNumber(0, this.midMaxColumns)
                this.yLightPosition = this.randomNumber(0, this.maxRows)
                break;
            //right side
            case 9:
                this.xLightPosition = this.randomNumber(this.midMaxRows, this.maxColumns)
                this.yLightPosition = this.randomNumber(0, this.maxRows)
                break;
        }
    }

    updatePosition(){

        let points = {
            "time_reaction": 0,
            "position_x": this.xLightPosition,
            "position_y": this.yLightPosition,
            "response": 0
        }
        this.postGameData(this, points)
        this.saveLocalPoints(this, 'total_hits')

        this.gameModeAction()
        if(this.doubleColor){
            const random_color = this.randomColors()
            this.lights.setFillStyle(random_color, 1)
        }
        this.aGrid.placeAt(this.xLightPosition, this.yLightPosition, this.lights);

        this.timerReactive.remove()
        this.timerReactive = this.time.addEvent(this.reactiveConfig)
    }

    fixLight(){
        if(this.fixationLight.visible){
            this.fixationLight.setVisible(false)
        }else{
            this.fixationLight.setVisible(true)
        }
    }

    delayLight(){
        this.lights.visible = true
        if(this.gameSelected){
            
            this.timerReactive = this.time.addEvent(this.reactiveConfig)
        }else{
    
            this.timerProactive = this.time.delayedCall({})

            let points = {
                "time_reaction": 0,
                "position_x": this.xLightPosition,
                "position_y": this.yLightPosition,
                "response": 0
            }
            this.postGameData(this, points)
            this.saveLocalPoints(this, 'total_hits')
        }
        
        this.gameModeAction()
        if(this.doubleColor){
            const random_color = this.randomColors()
            this.lights.setFillStyle(random_color, 1)
        }
        this.aGrid.placeAt(this.xLightPosition, this.yLightPosition, this.lights);
    }

    randomColors(){
        return this.colors[this.randomNumber(0,2)]
    }

    finishGame(){
        this.finishTimeScene = this.finishScene.getElapsed()
        this.finishScene.remove()
        this.finishScene = this.time.addEvent({delay: this.speed, callback: this.finish, callbackScope: this, loop: false, paused: false})
    }

    finish(){
        this.lights.destroy()
        this.endGame = true
        this.timerProactive ? this.timerProactive.paused = true : null
        this.timerReactive ? this.timerReactive.paused = true : null
        this.timerDelayLight ? this.timerDelayLight.paused = true : null
        this.showMessageBox(this, this.aGrid.w * .3, this.aGrid.h * .6);
    }
}