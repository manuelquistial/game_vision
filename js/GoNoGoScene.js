import {default as AlignGrid} from './AlignGrid.js'

export default class GoNoGoScene extends Phaser.Scene {

    constructor() {
        super({ key: 'GoNoGoScene' });
    }

    init(data){
        this.production = data.production
        this.id_users_tests = data.id_users_tests
        this.gameType = data.gameType
        this.gameSelected = true

        this.maxColumns = data.maxColumns
        this.maxRows = data.maxRows
        this.size = data.size
        this.color = data.color
        this.speed = data.speed
        this.finishTime = data.finishTime
        this.timeDelay = data.timeDelay
        this.failureColorCircle = data.failureColorCircle
        this.percentageFixation = data.percentageFixation
        this.showMessageBox = data.showMessageBox
        this.postGameData = data.postGameData
        this.successAudio = data.successAudio
        this.failureAudio = data.failureAudio

        //functions
        this.randomNumber = data.randomNumber
        this.saveLocalPoints = data.saveLocalPoints

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
        const random_color = this.randomColors()
        if(random_color == this.color){
            this.saveLocalPoints(this, 'total_go')
        }
        this.light = this.add.circle(0, 0, this.radioLights, random_color);
        this.light.setInteractive({ useHandCursor: true  }, new Phaser.Geom.Circle(this.radioLights, this.radioLights, this.radioLights), Phaser.Geom.Circle.Contains)

        this.aGrid.placeAt(this.xLightPosition, this.yLightPosition, this.light);

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
                this.saveLocalPoints(this, 'on_time')
                this.saveLocalPoints(this, 'precision', timeLimitLight)

            }else{
                this.failureAudio ? this.failureAudio.play() : null
                points.response = 2
            }
            this.postGameData(this, points)

            points.time_reaction = 0,
            points.response = 0
            this.postGameData(this, points)
            this.saveLocalPoints(this, 'total_hits')

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

        this.finishScene = this.time.addEvent({delay: this.finishTime, callback: this.finish, args: [this], loop: false, paused: false})
        this.timerReactive = this.time.addEvent(this.reactiveConfig)
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
        const random_color = _this.randomColors()
        if(random_color == _this.color){
            points.response = 3
            _this.postGameData(_this, points)
            _this.saveLocalPoints(_this, 'total_go')
        }
        _this.light.setFillStyle(random_color, 1)
        _this.aGrid.placeAt(_this.xLightPosition, _this.yLightPosition, _this.light);
    }

    delayLight(_this){
        _this.light.visible = true
        _this.gameModeActionLight()
        const random_color = _this.randomColors()
        if(random_color == _this.color){
            let points = {
                "time_reaction": 0,
                "position_x": _this.xLightPosition,
                "position_y": _this.yLightPosition,
                "response": 3
            }
            _this.postGameData(_this, points)
            _this.saveLocalPoints(_this, 'total_go')
        }
        _this.light.setFillStyle(random_color, 1)
        _this.aGrid.placeAt(_this.xLightPosition, _this.yLightPosition, _this.light);
    }

    randomColors(){
        return this.colors[this.randomNumber(0,2)]
    }

    /*randomNumberExclude(min_val, max_val, exclude_array){
        const randomNumber = Math.floor(Math.random() * (max_val - min_val + 1 - exclude_array.length)) + min_val;
        return randomNumber + exclude_array.sort((a, b) => a - b).reduce((acc, element) => { return randomNumber >= element - acc ? acc + 1 : acc}, 0);
    }*/

    finish(_this){
        _this.light.destroy()
        _this.endGame = true
        _this.timerReactive ? _this.timerReactive.paused = true : null
        _this.timerDelayLight ? _this.timerDelayLight.paused = true : null
        _this.showMessageBox(_this, _this.aGrid.w * .3, _this.aGrid.h * .6);
    }
}