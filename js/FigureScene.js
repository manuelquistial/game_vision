import {default as AlignGrid} from './AlignGrid.js'

export default class FigureScene extends Phaser.Scene {

    constructor() {
        super({ key: 'FigureScene' });
    }

    init(data){
        this.maxColumns = data.maxColumns
        this.maxRows = data.maxRows
        this.size = data.size
        this.color = data.color
        this.colorFixation = data.colorFixation
        this.speed = data.speed
        this.timeDelay = data.timeDelay
        this.fixationFigure = data.fixationFigure
        this.fixationEnable = data.fixationEnable
        this.percentageFixation = data.percentageFixation
        this.finishTime = data.finishTime
        this.midMaxColumns = data.midMaxColumns
        this.midMaxRows = data.midMaxRows
        this.successAudio = data.successAudio
        this.failureAudio = data.failureAudio
        this.showMessageBox = data.showMessageBox
        this.postGameData = data.postGameData

        this.figureSelection = data.figureSelection

        //functions
        this.randomNumber = data.randomNumber

        this.finishScene = this.time.addEvent({delay: this.finishTime, callback: this.finish, args: [this], loop: false, paused: false})
    }

    preload(){
        this.reactiveConfig = {delay: this.speed, callback: this.updatePosition, args: [this], loop: true, paused: false}
        if(this.figureSelection == "figures"){
            /*this.load.image('image_0', './img/apple.svg');
            this.load.image('image_1', './img/circle.svg');
            this.load.image('image_2', './img/house.svg');
            this.load.image('image_3', './img/square.svg');*/

            this.load.image('image_0', '../../assets/Test02MatrizV1/img/apple.svg');
            this.load.image('image_1', '../../assets/Test02MatrizV1/img/circle.svg');
            this.load.image('image_2', '../../assets/Test02MatrizV1/img/house.svg');
            this.load.image('image_3', '../../assets/Test02MatrizV1/img/square.svg');
        }
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
          
        if(this.figureSelection == "letters" || this.figureSelection == "numbers" || this.figureSelection == "fix_letters"){
            this.figureFixation = this.add.text(0, 0, this.fixationFigure, {
                fontFamily:'Arial',
                color:'#000000',
                align:'center',
              }).setFontSize(2*this.fixationRadio)
        }else if(this.figureSelection == "figures"){
            this.figureFixation = this.add.image(0, 0, this.fixationFigure)
            this.figureFixation.displayWidth = this.aGrid.cw / this.maxColumns
            this.figureFixation.scaleY = this.figureFixation.scaleX;
        }

        this.figureFixation.setOrigin(0.5)

        this.containerFixation = this.add.container(this.aGrid.w / 2, this.aGrid.h / 2, [this.fixationLight, this.figureFixation])

        this.gameModeAction()
        this.lights = this.add.circle(0, 0, this.radioLights, this.color);

        if(this.figureSelection == "letters"){
            this.figures = this.add.text(0, 0, this.randomLetter(), {
                fontFamily:'Arial',
                color:'#000000',
                align:'center',
              }).setFontSize(2*this.radioLights)
        }else if(this.figureSelection == "numbers"){
            this.figures = this.add.text(0, 0, this.randomNumbers(), {
                fontFamily:'Arial',
                color:'#000000',
                align:'center',
              }).setFontSize(2*this.radioLights)
        }else if(this.figureSelection == "fix_letters"){
            this.figures = this.add.text(0, 0, this.randomFixLetters(), {
                fontFamily:'Arial',
                color:'#000000',
                align:'center',
              }).setFontSize(2*this.radioLights)
        }else if(this.figureSelection == "figures"){
            this.figures = this.add.image(0, 0, this.randomFigures())
            this.figures.displayWidth = this.aGrid.cw / this.maxColumns
            this.figures.scaleY = this.figures.scaleX;
        }

        this.figures.setOrigin(0.5)
        
        this.container = this.add.container(0, 0, [this.lights, this.figures])
        this.lights.setInteractive(new Phaser.Geom.Circle(this.radioLights, this.radioLights, this.radioLights), Phaser.Geom.Circle.Contains)

        this.aGrid.placeAt(this.xLightPosition, this.yLightPosition, this.container);

        if(this.timerProactive){
            this.timerProactive.remove()
        }
        this.timerReactive = this.time.addEvent(this.reactiveConfig)

        this.lights.on('pointerdown', function () {

            let timeLimitLight = this.timerReactive.getElapsed()

            if(timeLimitLight <= this.speed){
                this.timerReactive.reset(this.reactiveConfig)
                this.time.addEvent(this.timerReactive)
                let figureCompare = null

                if(this.figures.text ? true : false){
                    figureCompare = this.figureFixation.text == this.figures.text
                }else{
                    figureCompare = this.figureFixation.texture == this.figures.texture
                }

                if(figureCompare){
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
            this.lights.visible = false
            this.timerDelayLight = this.time.addEvent({delay: this.timeDelay, callback: this.delayLight, args: [this], loop: false, paused: false})

        }, this);
    }

    gameModeAction(){
        this.xLightPosition = this.randomNumber(0, this.maxColumns)
        this.yLightPosition = this.randomNumber(0, this.maxRows)
    }

    updatePosition(argThis){
        argThis.gameModeAction()

        if(argThis.figureSelection == "letters"){
            argThis.figures.text = argThis.randomLetter()
        }else if(argThis.figureSelection == "numbers"){
            argThis.figures.text = argThis.randomNumbers()
        }else if(argThis.figureSelection == "figures"){
            argThis.figures.setTexture(argThis.randomFigures())
        }else if(argThis.figureSelection == "fix_letters"){
            argThis.figures.text = argThis.randomFixLetters()
        }

        argThis.aGrid.placeAt(argThis.xLightPosition, argThis.yLightPosition, argThis.container);
    }

    delayLight(argThis){
        argThis.lights.visible = true
        argThis.gameModeAction()

        if(argThis.figureSelection == "letters"){
            argThis.figures.text = argThis.randomLetter()
        }else if(argThis.figureSelection == "numbers"){
            argThis.figures.text = argThis.randomNumbers()
        }else if(argThis.figureSelection == "figures"){
            argThis.figures.setTexture(argThis.randomFigures())
        }else if(argThis.figureSelection == "fix_letters"){
            argThis.figures.text = argThis.randomFixLetters()
        }

        argThis.aGrid.placeAt(argThis.xLightPosition, argThis.yLightPosition, argThis.container);
    }

    // Function to generate random number 
    randomLetter() { 
        return String.fromCharCode(65 + Math.trunc(Math.random() * (25 - 0) + 0));
    }
    
    randomFixLetters(){
        let fixLetters = ['P', 'B', 'D', 'Q', '5', 'S']
        return fixLetters[this.randomNumber(0, fixLetters.length)]
    }

    randomFigures(){
        return "image_" + this.randomNumber(0, 4).toString()
    }

    randomNumbers(){
        return this.randomNumber(0, 10)
    }

    finish(argThis){
        argThis.lights.destroy()
        argThis.timerReactive ? argThis.timerReactive.paused = true : null
        argThis.timerDelayLight ? argThis.timerDelayLight.paused = true : null
        argThis.showMessageBox(window.languaje.message_1, argThis.aGrid.w * .3, argThis.aGrid.h * .3);
    }
}