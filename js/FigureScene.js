import {default as AlignGrid} from './AlignGrid.js'

export default class FigureScene extends Phaser.Scene {

    constructor() {
        super({ key: 'FigureScene' });
    }

    init(data){
        this.production = data.production
        this.source_path = data.source_path
        this.id_users_tests = data.id_users_tests
        this.gameSelected = true
        
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
        this.saveLocalPoints = data.saveLocalPoints
        this.menuButton = data.menuButton

    }

    preload(){
        this.reactiveConfig = {delay: this.speed, callback: this.updatePosition, args: [this], loop: true, paused: false}
        if(this.figureSelection == "figures"){
            this.load.image('image_0', `${this.source_path}/img/apple.svg`);
            this.load.image('image_1', `${this.source_path}/img/circle.svg`);
            this.load.image('image_2', `${this.source_path}/img/house.svg`);
            this.load.image('image_3', `${this.source_path}/img/square.svg`);
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

        if((this.size >= this.fixationRadio) && (this.size <= this.radioFixLights)){
            this.radioLights = this.size
        }else if(this.size < this.fixationRadio){
            this.radioLights = this.fixationRadio
        }else{
            this.radioLights = this.radioFixLights
        }

        if(this.radioLights > (this.radioFixLights - this.fixationRadio)){
            this.radioLights = this.radioFixLights - this.fixationRadio
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
            this.figureFixation.displayWidth = this.fixationRadio
            this.figureFixation.scaleY = this.figureFixation.scaleX;
        }

        this.figureFixation.setOrigin(0.5)

        this.containerFixation = this.add.container(this.aGrid.w / 2, this.aGrid.h / 2, [this.fixationLight, this.figureFixation])

        this.gameModeAction()
        this.lights = this.add.circle(0, 0, this.radioLights, this.color);

        if(this.figureSelection == "letters"){
            this.alphabet = Array.from(Array(13)).map((e, i) => String.fromCharCode(this.randomNumber(65, 81)));

            this.figures = this.add.text(0, 0, this.randomLetter(this), {
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
            this.figures.displayWidth = this.radioLights
            this.figures.scaleY = this.figures.scaleX;

        }

        this.figures.setOrigin(0.5)
        
        this.container = this.add.container(0, 0, [this.lights, this.figures])
        this.lights.setInteractive({ useHandCursor: true  }, new Phaser.Geom.Circle(this.radioLights, this.radioLights, this.radioLights), Phaser.Geom.Circle.Contains)

        this.aGrid.placeAt(this.xLightPosition, this.yLightPosition, this.container);

        if(this.timerProactive){
            this.timerProactive.remove()
        }

        this.timerReactive = this.time.addEvent(this.reactiveConfig)

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

            let timeLimitLight = this.timerReactive.getElapsed()

            if(timeLimitLight <= this.speed){
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
                    this.postGameData(this, points)
                    this.saveLocalPoints(this, 'on_time')
                    this.saveLocalPoints(this, 'precision', timeLimitLight)

                }else{

                    this.failureAudio ? this.failureAudio.play() : null
                }
            }
            this.lights.visible = false
            this.timerDelayLight = this.time.addEvent({delay: this.timeDelay, callback: this.delayLight, args: [this], loop: false, paused: false})

        }, this);

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
       
        this.menuButton(this)
        this.finishScene = this.time.addEvent({delay: this.finishTime, callback: this.finish, args: [this], loop: false, paused: false})
    
    }

    gameModeAction(){
        this.xLightPosition = this.randomNumber(0, this.maxColumns)
        this.yLightPosition = this.randomNumber(0, this.maxRows)
    }

    updatePosition(_this){
        _this.gameModeAction()

        if(_this.figureSelection == "letters"){
            _this.figures.text = _this.randomLetter(_this)
        }else if(_this.figureSelection == "numbers"){
            _this.figures.text = _this.randomNumbers()
        }else if(_this.figureSelection == "figures"){
            _this.figures.setTexture(_this.randomFigures())
        }else if(_this.figureSelection == "fix_letters"){
            _this.figures.text = _this.randomFixLetters()
        }

        let points = {
            "time_reaction": 0,
            "position_x": _this.xLightPosition,
            "position_y": _this.yLightPosition,
            "response": 0
        }
        _this.postGameData(_this, points)
        _this.saveLocalPoints(_this, 'total_hits')

        _this.aGrid.placeAt(_this.xLightPosition, _this.yLightPosition, _this.container);
    }

    delayLight(_this){
        _this.lights.visible = true
        _this.timerReactive.reset(_this.reactiveConfig)
        _this.time.addEvent(_this.timerReactive)

        _this.gameModeAction()

        if(_this.figureSelection == "letters"){
            _this.figures.text = _this.randomLetter(_this)
        }else if(_this.figureSelection == "numbers"){
            _this.figures.text = _this.randomNumbers()
        }else if(_this.figureSelection == "figures"){
            _this.figures.setTexture(_this.randomFigures())
        }else if(_this.figureSelection == "fix_letters"){
            _this.figures.text = _this.randomFixLetters()
        }

        /*let points = {
            "time_reaction": 0,
            "position_x": _this.xLightPosition,
            "position_y": _this.yLightPosition,
            "response": 2
        }
        _this.postGameData(_this, points)
        _this.saveLocalPoints(_this, 'total_hits')*/

        _this.aGrid.placeAt(_this.xLightPosition, _this.yLightPosition, _this.container);
    }

    // Function to generate random number 
    randomLetter(_this) { 
        let data = _this.alphabet.map((x) => {
            if(this.randomNumber(0, 3) == 1){
                return _this.fixationFigure
            }else{
                return x
            }
        })
        return data[this.randomNumber(0, _this.alphabet.length)]
    }
    
    randomFixLetters(){
        let fixLetters = ['p', 'b', 'd', 'q', '5', 's']
        return fixLetters[this.randomNumber(0, fixLetters.length)]
    }

    randomFigures(){
        return "image_" + this.randomNumber(0, 4).toString()
    }

    randomNumbers(){
        return this.randomNumber(0, 10)
    }

    finish(_this){
        _this.lights.destroy()
        _this.endGame = true
        _this.timerReactive ? _this.timerReactive.paused = true : null
        _this.timerDelayLight ? _this.timerDelayLight.paused = true : null
        _this.showMessageBox(_this, _this.aGrid.w * .3, _this.aGrid.h * .6);
    }
}