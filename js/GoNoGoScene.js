import {default as AlignGrid} from './AlignGrid.js'

export default class GoNoGoScene extends Phaser.Scene {

    constructor() {
        super({ key: 'GoNoGoScene' });
    }

    init(data){
        
        this.maxColumns = data.maxColumns
        this.maxRows = data.maxRows
        this.size = data.size
        this.color = data.color
        this.speed = data.speed
        this.finishTime = data.finishTime
        this.failureColorCircle = data.failureColorCircle
        this.showMessageBox = data.showMessageBox
        this.postGameData = data.postGameData
        this.successAudio = data.successAudio
        this.failureAudio = data.failureAudio

        //functions
        this.randomNumber = data.randomNumber

        this.finishScene = this.time.addEvent({delay: this.finishTime, callback: this.finish, args: [this], loop: false, paused: false})
    }

    preload(){
        this.reactiveConfig = {delay: this.speed, callback: this.updatePosition, args: [this], loop: true, paused: false}
        this.colors = [this.color, this.failureColorCircle]
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

        this.gameModeActionLight()
        this.light = this.add.circle(0, 0, this.radioLights, this.randomColors());
        this.light.setInteractive({ useHandCursor: true  }, new Phaser.Geom.Circle(this.radioLights, this.radioLights, this.radioLights), Phaser.Geom.Circle.Contains)

        this.aGrid.placeAt(this.xLightPosition, this.yLightPosition, this.light);

        this.light.on('pointerdown', function () {
            console.log("hola")
            this.light.visible = false
            let timeLimitLight = this.timerReactive.getElapsed()
            this.timerReactive.reset(this.reactiveConfig)
            this.time.addEvent(this.timerReactive)

            let points = {
                "time_reaction": timeLimitLight,
                "position_x": this.xLightPosition,
                "position_y": this.yLightPosition,
            }

            if(this.light.fillColor == this.color){
                this.successAudio ? this.successAudio.play() : null
                points.response = 1
            }else{
                this.failureAudio ? this.failureAudio.play() : null
                points.response = 0
            }
            //argThis.postGameData(points)

            this.timerDelayLight = this.time.addEvent({delay: this.timeDelay, callback: this.delayLight, args: [this], loop: false, paused: false})
        }, this);

        this.timerReactive = this.time.addEvent(this.reactiveConfig)
    }

    gameModeActionLight(){
        this.xLightPosition = this.randomNumber(0, this.maxColumns)
        this.yLightPosition = this.randomNumber(0, this.maxRows)
    }

    updatePosition(argThis){
        let timeLimitLight = argThis.timerReactive.getElapsed()
        let points = {
            "time_reaction": timeLimitLight,
            "position_x": argThis.xLightPosition,
            "position_y": argThis.yLightPosition,
            "response": 2
        }
        //argThis.postGameData(points)

        argThis.gameModeActionLight()
        argThis.light.setFillStyle(argThis.randomColors(), 1)
        argThis.aGrid.placeAt(argThis.xLightPosition, argThis.yLightPosition, argThis.light);
    }

    delayLight(argThis){
        argThis.light.visible = true
        argThis.gameModeActionLight()
        argThis.light.setFillStyle(argThis.randomColors(), 1)
        argThis.aGrid.placeAt(argThis.xLightPosition, argThis.yLightPosition, argThis.light);
    }

    randomColors(){
        return this.colors[this.randomNumber(0,2)]
    }

    /*randomNumberExclude(min_val, max_val, exclude_array){
        const randomNumber = Math.floor(Math.random() * (max_val - min_val + 1 - exclude_array.length)) + min_val;
        return randomNumber + exclude_array.sort((a, b) => a - b).reduce((acc, element) => { return randomNumber >= element - acc ? acc + 1 : acc}, 0);
    }*/

    finish(argThis){
        argThis.light.destroy()
        argThis.timerReactive ? argThis.timerReactive.paused = true : null
        argThis.timerDelayLight ? argThis.timerDelayLight.paused = true : null
        argThis.showMessageBox(window.languaje.message_1, argThis.aGrid.w * .3, argThis.aGrid.h * .3);
    }
}