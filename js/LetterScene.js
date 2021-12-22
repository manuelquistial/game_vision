import {default as AlignGrid} from './AlignGrid.js'

export default class LetterScene extends Phaser.Scene {

    constructor() {
        super({ key: 'LetterScene' });
    }

    init(data){
        this.maxColumns = data.maxColumns
        this.maxRows = data.maxRows
        this.size = data.size
        this.color = data.color
        this.colorFixation = data.colorFixation
        this.speed = data.speed
        this.timeDelay = data.timeDelay
        this.fixationLetter = data.fixationLetter 
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

        if((this.size >= (this.radioFixLights - this.fixationRadio))){
            this.radioLights = this.radioFixLights - this.fixationRadio
        }else if((this.size <= this.fixationRadio)){
            this.radioLights = this.fixationRadio
        }else{
            this.radioLights = this.size
        }

        this.fixationLight = this.add.circle(0, 0, this.fixationRadio, this.colorFixation);
        this.textFixation = this.add.text(0, 0, this.fixationLetter,{
            fontFamily:'Arial',
            color:'#000000',
            align:'center',
          }).setFontSize(2*this.fixationRadio).setOrigin(0.5);
        
        this.containerFixation = this.add.container(this.aGrid.w / 2, this.aGrid.h / 2, [this.fixationLight, this.textFixation])

        this.gameModeAction()
        this.lights = this.add.circle(0, 0, this.radioLights, this.color);
        this.letter = this.add.text(0, 0, this.randomLetter(),{
            fontFamily:'Arial',
            color:'#000000',
            align:'center',
          }).setFontSize(2*this.radioLights).setOrigin(0.5);

        this.container = this.add.container(0, 0, [this.lights, this.letter])
        this.lights.setInteractive(new Phaser.Geom.Circle(this.radioLights, this.radioLights, this.radioLights), Phaser.Geom.Circle.Contains)

        this.aGrid.placeAt(this.xLightPosition, this.yLightPosition, this.container);

        if(this.timerProactive){
            this.timerProactive.remove()
        }
        this.timerReactive = this.time.addEvent(this.reactiveConfig)

        this.lights.on('pointerup', function () {

            let timeLimitLight = this.timerReactive.getElapsed()

            if(timeLimitLight <= this.speed){
                this.timerReactive.reset(this.reactiveConfig)
                this.time.addEvent(this.timerReactive)
                if(this.textFixation.text == this.letter.text){
                    this.successAudio ? this.successAudio.play() : null
                    let points = {
                        "time_reaction": timeLimitLight,
                        "position_x": this.xLightPosition,
                        "position_y": this.yLightPosition,
                        "response": 1
                    }
                    this.postGameData(points)
                }else{
                    this.failureAudio ? this.failureAudio.play() : null
                    let points = {
                        "time_reaction": timeLimitLight,
                        "position_x": this.xLightPosition,
                        "position_y": this.yLightPosition,
                        "response": 0
                    }
                    this.postGameData(points)
                }
            }
            this.timerDelayLight = this.time.addEvent({delay: this.timeDelay, callback: this.delayLight, args: [this], loop: false, paused: false})

        }, this);
    }

    gameModeAction(){
        this.xLightPosition = this.randomNumber(0, this.maxColumns)
        this.yLightPosition = this.randomNumber(0, this.maxRows)
    }

    updatePosition(argThis){
        argThis.gameModeAction()
        argThis.letter.text = argThis.randomLetter()
        argThis.aGrid.placeAt(argThis.xLightPosition, argThis.yLightPosition, argThis.container);
    }

    delayLight(argThis){
        argThis.gameModeAction()
        argThis.letter.text = argThis.randomLetter()
        argThis.aGrid.placeAt(argThis.xLightPosition, argThis.yLightPosition, argThis.container);
    }

    // Function to generate random number 
    randomLetter() { 
        return String.fromCharCode(65 + Math.trunc(Math.random() * (25 - 0) + 0));
    } 

    finish(argThis){
        argThis.lights.destroy()
        argThis.timerReactive ? argThis.timerReactive.paused = true : null
        argThis.timerDelayLight ? argThis.timerDelayLight.paused = true : null
        argThis.showMessageBox(window.languaje.message_1, argThis.aGrid.w * .3, argThis.aGrid.h * .3);
    }
}