import {default as AlignGrid} from './AlignGrid.js'

export default class DobleCircleScene extends Phaser.Scene {

    constructor() {
        super({ key: 'DobleCircleScene' });
    }

    init(data){
        
        this.maxColumns = data.maxColumns
        this.maxRows = data.maxRows
        this.size = data.size
        this.color = data.color
        this.finishTime = data.finishTime
        this.doubleMode = data.doubleMode

        //functions
        this.randomNumber = data.randomNumber

        this.finishScene = this.time.addEvent({delay: this.finishTime, callback: this.finish, args: [this], loop: false, paused: false})
    }

    preload(){
        this.timeLimitLightOne = 1
        this.timeLimitLightTwo = -1
        this.proactiveConfig = {delay: this.speed, callback: this.failedByTime, args: [this], loop: true, paused: false}
    }

    create(){
        var gridConfig = {
            'scene': this,
            'cols': this.maxColumns,
            'rows': this.maxRows
        }
        
        this.aGrid = new AlignGrid(gridConfig);

        this.aGrid.showNumbers();

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

        this.gameModeActionLightOne()
        this.lightOne = this.add.circle(0, 0, this.radioLights, this.color);
        this.lightOne.setInteractive({ useHandCursor: true  }, new Phaser.Geom.Circle(this.radioLights, this.radioLights, this.radioLights), Phaser.Geom.Circle.Contains)

        this.aGrid.placeAt(this.xLightPosition, this.yLightPosition, this.lightOne);

        this.gameModeActionLightTwo()
        this.lightTwo = this.add.circle(0, 0, this.radioLights, this.color);
        this.lightTwo.setInteractive({ useHandCursor: true  }, new Phaser.Geom.Circle(this.radioLights, this.radioLights, this.radioLights), Phaser.Geom.Circle.Contains)

        this.aGrid.placeAt(this.xLightPosition, this.yLightPosition, this.lightTwo);

        this.timerProactive = this.time.addEvent(this.proactiveConfig)

        this.input.addPointer(3)
        this.lightOne.on('pointerup', function (data, value) {
            this.timeLimitLightOne = this.timerProactive.getElapsed()
        }, this);

        this.lightTwo.on('pointerup', function (data, value) {
            this.timeLimitLightTwo = this.timerProactive.getElapsed()
        }, this);
    }

    update(){
        if(this.timeLimitLightOne == this.timeLimitLightTwo){
            this.timeLimitLightOne = 1
            this.timeLimitLightTwo = -1
            this.timerProactive.reset(this.proactiveConfig)
            this.time.addEvent(this.timerProactive)
            this.successAudio ? argThis.successAudio.play() : null
            /*let points = {
                "time_reaction": timeLimitLight,
                "position_x": argThis.xLightPosition,
                "position_y": argThis.yLightPosition,
                "response": 1
            }*/
            //argThis.postGameData(points)

            this.timerDelayLight = this.time.addEvent({delay: this.timeDelay, callback: this.delayLight, args: [this], loop: false, paused: false})

            this.gameModeActionLightOne()
            this.aGrid.placeAt(this.xLightPosition, this.yLightPosition, this.lightOne);

            this.gameModeActionLightTwo()
            this.aGrid.placeAt(this.xLightPosition, this.yLightPosition, this.lightTwo);
        }else{
            //this.failureAudio ? this.failureAudio.play() : null
        }
    }

    gameModeActionLightOne(){
        //1 diagonal right, 2 left, 3 horizontal 
        if(this.doubleMode == 1){
            this.xLightPosition = this.randomNumber(0, this.maxColumns - 1)
            this.yLightPosition = this.randomNumber(0, this.maxRows - 1)
        }else if(this.doubleMode == 2){
            this.xLightPosition = this.randomNumber(1, this.maxColumns)
            this.yLightPosition = this.randomNumber(0, this.maxRows - 1)
        }else if(this.doubleMode == 3){
            this.xLightPosition = this.randomNumber(0, this.maxColumns - 1)
            this.yLightPosition = this.randomNumber(0, this.maxRows)
        }else{

        }
    }

    gameModeActionLightTwo(){
        if(this.doubleMode == 1){
            this.xLightPosition = this.xLightPosition + 1
            this.yLightPosition = this.yLightPosition + 1
        }else if(this.doubleMode == 2){
            this.xLightPosition = this.xLightPosition - 1
            this.yLightPosition = this.yLightPosition + 1
        }else if(this.doubleMode == 3){
            this.xLightPosition = this.xLightPosition + 1
            this.yLightPosition = this.yLightPosition
        }else{

        }
    }

    delayLight(argThis){
 
        argThis.gameModeActionLightOne()
        argThis.aGrid.placeAt(argThis.xLightPosition, argThis.yLightPosition, argThis.lightOne);

        argThis.gameModeActionLightTwo()
        argThis.aGrid.placeAt(argThis.xLightPosition, argThis.yLightPosition, argThis.lightTwo);
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

    finish(argThis){
        argThis.lights.destroy()
        argThis.timerProactive ? argThis.timerProactive.paused = true : null
        argThis.timerDelayLight ? argThis.timerDelayLight.paused = true : null
        argThis.showMessageBox(window.languaje.message_1, argThis.aGrid.w * .3, argThis.aGrid.h * .3);
    }
}