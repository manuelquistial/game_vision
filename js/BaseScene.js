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

        //functions
        this.randomNumber = data.randomNumber
        this.saveLocalPoints = data.saveLocalPoints

        this.finishScene = this.time.addEvent({delay: this.finishTime, callback: this.finish, args: [this], loop: false, paused: false})
    }

    preload(){
        this.reactiveConfig = {delay: this.speed, callback: this.updatePosition, args: [this], loop: true, paused: false}
        this.proactiveConfig = {delay: this.speed, loop: false, paused: false}
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
    
                if(timeLimitLight < this.speed){
                    this.successAudio ? this.successAudio.play() : null
                    let points = {
                        "time_reaction": timeLimitLight,
                        "position_x": this.xLightPosition,
                        "position_y": this.yLightPosition,
                        "response": 1
                    }
                    this.postGameData(this, points)

                    this.saveLocalPoints(this, 'on_time', )
                    this.saveLocalPoints(this, 'precision', timeLimitLight)

                }else{
                    this.failureAudio ? this.failureAudio.play() : null
                }
            }

            this.lights.visible = false
            this.timerDelayLight = this.time.addEvent({delay: this.timeDelay, callback: this.delayLight, args: [this], loop: false, paused: false})
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

    updatePosition(_this){

        //_this.failureAudio ? _this.failureAudio.play() : null
        let timeLimitLight = _this.timerReactive.getElapsed()
        let points = {
            "time_reaction": 0,
            "position_x": _this.xLightPosition,
            "position_y": _this.yLightPosition,
            "response": 0
        }
        _this.postGameData(_this, points)
        _this.saveLocalPoints(_this, 'total_hits')

        _this.gameModeAction()
        _this.aGrid.placeAt(_this.xLightPosition, _this.yLightPosition, _this.lights);
 
    }

    fixLight(_this){
        if(_this.fixationLight.visible){
            _this.fixationLight.setVisible(false)
        }else{
            _this.fixationLight.setVisible(true)
        }
    }

    delayLight(_this){
        _this.lights.visible = true
        if(_this.gameSelected){
            _this.timerReactive.reset(_this.reactiveConfig)
            _this.time.addEvent(_this.timerReactive)
        }else{
            _this.timerProactive.reset(_this.proactiveConfig)
            _this.time.addEvent(_this.timerProactive)

            let points = {
                "time_reaction": 0,
                "position_x": _this.xLightPosition,
                "position_y": _this.yLightPosition,
                "response": 0
            }
            _this.postGameData(_this, points)
            _this.saveLocalPoints(_this, 'total_hits')
        }

        _this.gameModeAction()
        _this.aGrid.placeAt(_this.xLightPosition, _this.yLightPosition, _this.lights);
    }

    finish(_this){
        _this.lights.destroy()
        _this.endGame = true
        _this.timerProactive ? _this.timerProactive.paused = true : null
        _this.timerReactive ? _this.timerReactive.paused = true : null
        _this.timerDelayLight ? _this.timerDelayLight.paused = true : null
        _this.showMessageBox(_this, _this.aGrid.w * .3, _this.aGrid.h * .6);
    }
}