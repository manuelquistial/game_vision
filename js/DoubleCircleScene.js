import {default as AlignGrid} from './AlignGrid.js'

export default class DoubleCircleScene extends Phaser.Scene {

    constructor() {
        super({ key: 'DoubleCircleScene' });
    }

    init(data){
        this.production = data.production
        this.id_users_tests = data.id_users_tests

        this.maxColumns = data.maxColumns
        this.maxRows = data.maxRows
        this.size = data.size
        this.color = data.color
        this.finishTime = data.finishTime
        this.successAudio = data.successAudio
        this.failureAudio = data.failureAudio
        this.doubleMode = data.doubleMode
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
        
        this.lightOne.on('pointerup', function () {
            this.timeLimitLightOne = this.timerProactive.getElapsed()
            if(this.timeLimitLightOne != this.timeLimitLightTwo){
                let points = {
                    "time_reaction": 0,
                    "position_x": this.xLightPosition,
                    "position_y": this.yLightPosition,
                    "positionb_x": this.lightTwoPositionX,
                    "positionb_y": this.lightTwoPositionY,
                    "response": 0
                }
                this.postGameData(this, points)
                this.saveLocalPoints(this, 'missed')
            }
        }, this);

        this.lightTwo.on('pointerup', function () {
            this.timeLimitLightTwo = this.timerProactive.getElapsed()
            if(this.timeLimitLightOne != this.timeLimitLightTwo){
                let points = {
                    "time_reaction": 0,
                    "position_x": this.xLightPosition,
                    "position_y": this.yLightPosition,
                    "positionb_x": this.lightTwoPositionX,
                    "positionb_y": this.lightTwoPositionY,
                    "response": 0
                }
                this.postGameData(this, points)
                this.saveLocalPoints(this, 'missed')
            }
        }, this);
    }

    update(){
        if(this.timeLimitLightOne == this.timeLimitLightTwo){
            this.lightOne.visible = false
            this.lightTwo.visible = false
            this.successAudio ? this.successAudio.play() : null
            let points = {
                "time_reaction": this.timeLimitLightOne,
                "position_x": this.xLightPosition,
                "position_y": this.yLightPosition,
                "positionb_x": this.lightTwoPositionX,
                "positionb_y": this.lightTwoPositionY,
                "response": 1
            }
            this.postGameData(this, points)
            this.saveLocalPoints(this, 'on_time')
            this.saveLocalPoints(this, 'precision', timeLimitLightOne)

            points.time_reaction = 0
            points.response = 2
            this.postGameData(this, points)
            this.saveLocalPoints(this, 'total_hits')

            this.timeLimitLightOne = -2
            this.timeLimitLightTwo = -1
            
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

    delayLight(_this){
        _this.lightOne.visible = true
        _this.lightTwo.visible = true

        _this.timerProactive.reset(_this.proactiveConfig)
        _this.time.addEvent(_this.timerProactive)

        _this.gameModeActionLightOne()
        _this.aGrid.placeAt(_this.xLightPosition, _this.yLightPosition, _this.lightOne);

        _this.gameModeActionLightTwo()
        _this.lightTwoPositionX = _this.xLightPosition
        _this.lightTwoPositionY = _this.yLightPosition
        _this.aGrid.placeAt(_this.xLightPosition, _this.yLightPosition, _this.lightTwo);
    }

    finish(_this){
        _this.lightOne.destroy()
        _this.lightTwo.destroy()
        _this.timerProactive ? _this.timerProactive.paused = true : null
        _this.timerDelayLight ? _this.timerDelayLight.paused = true : null
        _this.showMessageBox(_this, _this.aGrid.w * .3, _this.aGrid.h * .6);
    }
}