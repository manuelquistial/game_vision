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
        this.successAudio = data.successAudio
        this.failureAudio = data.failureAudio
        this.showMessageBox = data.showMessageBox
        this.postGameData = data.postGameData

        //functions
        this.randomNumber = data.randomNumber

        this.finishScene = this.time.addEvent({delay: this.finishTime, callback: this.finish, args: [this], loop: false, paused: false})
    }

    preload(){
        this.timeLimitLightOne = -2
        this.timeLimitLightTwo = -1
        this.proactiveConfig = {delay: this.finishTime, args: [this], loop: false, paused: false}
    }

    create(){
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

        this.gameModeActionLightOne()
        this.lightOne = this.add.circle(0, 0, this.radioLights, this.color);
        this.lightOne.setInteractive({ useHandCursor: true  }, new Phaser.Geom.Circle(this.radioLights, this.radioLights, this.radioLights), Phaser.Geom.Circle.Contains)

        this.aGrid.placeAt(this.xLightPosition, this.yLightPosition, this.lightOne);

        this.gameModeActionLightTwo()
        this.lightTwo = this.add.circle(0, 0, this.radioLights, this.color);
        this.lightTwo.setInteractive({ useHandCursor: true  }, new Phaser.Geom.Circle(this.radioLights, this.radioLights, this.radioLights), Phaser.Geom.Circle.Contains)
        this.lightTwoPositionX = this.xLightPosition
        this.lightTwoPositionY = this.yLightPosition
        this.aGrid.placeAt(this.xLightPosition, this.yLightPosition, this.lightTwo);

        this.timerProactive = this.time.addEvent(this.proactiveConfig)

        this.input.addPointer(3)
        
        this.lightOne.on('pointerdown', function () {
            this.timeLimitLightOne = this.timerProactive.getElapsed()
        }, this);

        this.lightTwo.on('pointerdown', function () {
            this.timeLimitLightTwo = this.timerProactive.getElapsed()
        }, this);
    }

    update(){
        if(this.timeLimitLightOne == this.timeLimitLightTwo){
            this.lightOne.visible = false
            this.lightTwo.visible = false
            this.timeLimitLightOne = -2
            this.timeLimitLightTwo = -1
            this.timerProactive.reset(this.proactiveConfig)
            this.time.addEvent(this.timerProactive)
            this.successAudio ? argThis.successAudio.play() : null
            let points = {
                "time_reaction": timeLimitLightOne,
                "position_x": argThis.xLightPosition,
                "position_y": argThis.yLightPosition,
                "positionb_x": argThis.lightTwoPositionX,
                "positionb_y": argThis.lightTwoPositionY,
                "response": 1
            }
            argThis.postGameData(points)

            this.timerDelayLight = this.time.addEvent({delay: this.timeDelay, callback: this.delayLight, args: [this], loop: false, paused: false})
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
        }else if(this.doubleMode == 4){
            this.xLightPosition = this.randomNumber(0, this.maxColumns)
            this.yLightPosition = this.randomNumber(0, this.maxRows - 1)
        }else if(this.doubleMode == 5){
            this.xLightPosition = this.randomNumber(1, this.maxColumns - 1)
            this.yLightPosition = this.randomNumber(0, this.maxRows - 1)
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
        }else if(this.doubleMode == 4){
            this.xLightPosition = this.xLightPosition
            this.yLightPosition = this.yLightPosition + 1
        }else if(this.doubleMode == 5){
            let changePosX = this.randomNumber(-2, 2)
            this.xLightPosition = this.xLightPosition + changePosX
            this.yLightPosition = this.yLightPosition + (changePosX == 0 ? 1 : this.randomNumber(-1, 2))
        }

        this.lightTwoPositionX = this.xLightPosition
        this.lightTwoPositionY = this.yLightPosition
    }

    delayLight(argThis){
        argThis.lightOne.visible = true
        argThis.lightTwo.visible = true
        argThis.gameModeActionLightOne()
        argThis.aGrid.placeAt(argThis.xLightPosition, argThis.yLightPosition, argThis.lightOne);

        argThis.gameModeActionLightTwo()
        argThis.lightTwoPositionX = this.xLightPosition
        argThis.lightTwoPositionY = this.yLightPosition
        argThis.aGrid.placeAt(argThis.xLightPosition, argThis.yLightPosition, argThis.lightTwo);
    }

    finish(argThis){
        argThis.lightOne.destroy()
        argThis.lightTwo.destroy()
        argThis.timerProactive ? argThis.timerProactive.paused = true : null
        argThis.timerDelayLight ? argThis.timerDelayLight.paused = true : null
        argThis.showMessageBox(window.languaje.message_1, argThis.aGrid.w * .3, argThis.aGrid.h * .3);
    }
}