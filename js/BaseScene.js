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
        this.gameMode = data.gameMode
        this.maxColumns = data.maxColumns
        this.maxRows = data.maxRows
        this.size = data.size
        this.color = data.color
        this.colorFixation = data.colorFixation
        this.gameSelected = data.gameSelected
        this.speed = data.speed
        this.timeDelay = data.timeDelay
        this.timeFix = data.timeFix
        this.fixationEnable = data.fixationEnable
        this.percentageFixation = data.percentageFixation
        this.midMaxColumns = data.midMaxColumns
        this.midMaxRows = data.midMaxRows
        this.finishTime = data.finishTime
        this.successAudio = data.successAudio
        this.failureAudio = data.failureAudio
        this.showMessageBox = data.showMessageBox
        this.postGameData = data.postGameData

        //functions
        this.randomNumber = data.randomNumber

        this.finishScene = this.time.addEvent({delay: this.finishTime, callback: this.finish, args: [this], loop: false, paused: false})
    }

    preload(){
        this.reactiveConfig = {delay: this.speed, callback: this.updatePosition, args: [this], loop: true, paused: false}
        this.proactiveConfig = {delay: this.speed, callback: this.failedByTime, args: [this], loop: true, paused: false}
    }

    create() {
        var gridConfig = {
            'scene': this,
            'cols': this.maxColumns,
            'rows': this.maxRows
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

        if((this.size >= this.fixationRadio) && (this.size <= this.radioFixLights)){
            this.radioLights = this.size
        }else if(this.size < this.fixationRadio){
            this.radioLights = this.fixationRadio
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
                this.timerFixLight = this.time.addEvent({delay: this.timeFix, callback: this.fixLight, args: [this], loop: true, paused: false})
            }
        }else{
            if(this.timerFixLight){
                this.timerFixLight.remove()
            }
        }

        this.gameModeAction()
        this.lights = this.add.circle(0, 0, this.radioLights, this.color);
        this.lights2 = this.add.circle(200, 200, this.radioLights, this.color);
        this.lights2.setInteractive()
        this.lights.setInteractive({ useHandCursor: true  }, new Phaser.Geom.Circle(this.radioLights, this.radioLights, this.radioLights), Phaser.Geom.Circle.Contains)

        this.aGrid.placeAt(this.xLightPosition, this.yLightPosition, this.lights);

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

        this.lights2.on('pointerup', function (data) {
            this.lights.color = 0xfff000
            this.timerDelayLight = this.time.addEvent({delay: this.timeDelay, callback: this.delayLight, args: [this], loop: false, paused: false})

        }, this);

        this.lights.on('pointerup', function (data) {
            this.lights2.color = 0xffff00
            this.timerDelayLight = this.time.addEvent({delay: this.timeDelay, callback: this.delayLight, args: [this], loop: false, paused: false})
        }, this);
    }

    update() {

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

    updatePosition(argThis){
        argThis.failureAudio ? argThis.failureAudio.play() : null
        let timeLimitLight = argThis.timerReactive.getElapsed()
        let poinst = {
            "time_reaction": timeLimitLight,
            "position_x": argThis.xLightPosition,
            "position_y": argThis.yLightPosition,
            "response": 0
        }
        argThis.postGameData(poinst)

        argThis.gameModeAction()
        argThis.aGrid.placeAt(argThis.xLightPosition, argThis.yLightPosition, argThis.lights);
    }

    failedByTime(argThis){
        if(argThis.timerReactive){
            let timeLimitLight = argThis.timerReactive.getElapsed()
            let poinst = {
                "time_reaction": timeLimitLight,
                "position_x": argThis.xLightPosition,
                "position_y": argThis.yLightPosition,
                "response": 0
            }
            argThis.postGameData(poinst)
        }
    }

    fixLight(argThis){
        if(argThis.fixationLight.visible){
            argThis.fixationLight.setVisible(false)
        }else{
            argThis.fixationLight.setVisible(true)
        }
    }

    delayLight(argThis){
        argThis.gameModeAction()
        argThis.aGrid.placeAt(argThis.xLightPosition, argThis.yLightPosition, argThis.lights2);
        argThis.gameModeAction()
        argThis.aGrid.placeAt(argThis.xLightPosition, argThis.yLightPosition, argThis.lights);
    }

    finish(argThis){
        argThis.lights.destroy()
        argThis.timerProactive ? argThis.timerProactive.paused = true : null
        argThis.timerReactive ? argThis.timerReactive.paused = true : null
        argThis.timerDelayLight ? argThis.timerDelayLight.paused = true : null
        argThis.showMessageBox(window.languaje.message_1, argThis.aGrid.w * .3, argThis.aGrid.h * .3);
    }
}