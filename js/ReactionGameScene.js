import {default as AlignGrid} from './AlignGrid.js'

export default class ReactionGameScene extends Phaser.Scene {

    timerReactive;
    timerProactive;
    timerDelayLight;
    timerFixLight;

    constructor() {
        super({ key: 'ReactionGameScene' });
    }

    init(data){
        this.production = data.production
        this.id_users_tests = data.id_users_tests

        this.size = data.size
        this.color = data.color
        this.finishTime = data.finishTime
        this.percentageFixation = data.percentageFixation
        this.gameSelected = data.gameSelected

        this.showMessageBox = data.showMessageBox
        this.postGameData = data.postGameData
        this.successAudio = data.successAudio
        this.failureAudio = data.failureAudio

        //functions
        this.randomNumber = data.randomNumber
        this.saveLocalPoints = data.saveLocalPoints

        const reaction = localStorage.getItem('reaction')

        this.reactionStates = data.reactionStates
        this.reactionStatesData = this.reactionStates['reaction_' + reaction]

        this.speed = this.reactionStatesData.speed
     
        if((this.scale.orientation == 'landscape-primary') || (this.scale.orientation == 'landscape')){
            this.maxColumns = this.reactionStatesData.columns
            this.maxRows = this.reactionStatesData.rows
        }else{
            this.maxRows = this.reactionStatesData.columns
            this.maxColumns = this.reactionStatesData.rows
        }
    }

    preload(){
        this.reactiveConfig = {delay: this.speed, callback: this.updatePosition, args: [this], loop: true, paused: false}
        this.proactiveConfig = {delay: this.speed, loop: false, paused: false}
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
            this.radiolight = this.aGrid.cw / 2
            this.radioFixlight = this.aGrid.cw / 2
        }else{
            this.radiolight = this.aGrid.ch / 2
            this.radioFixlight = this.aGrid.ch / 2
        }

        this.fixationRadio = this.radioFixlight * this.percentageFixation

        if((this.size >= this.fixationRadio) && (this.size <= this.radioFixlight)){
            this.radiolight = this.size
        }else if(this.size < this.fixationRadio){
            this.radiolight = this.fixationRadio
        }else{
            this.radiolight = this.radioFixlight
        }

        this.gameModeActionLight()
        this.light = this.add.circle(0, 0, this.radiolight, this.color);
        this.light.setInteractive({ useHandCursor: true  }, new Phaser.Geom.Circle(this.radiolight, this.radiolight, this.radiolight), Phaser.Geom.Circle.Contains)

        this.aGrid.placeAt(this.xLightPosition, this.yLightPosition, this.light);

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

        this.light.on('pointerdown', function () {
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

            this.light.visible = false
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

        this.finishScene = this.time.addEvent({delay: this.finishTime, callback: this.reactionStatesMode, args: [this], loop: false, paused: false})
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
        _this.aGrid.placeAt(_this.xLightPosition, _this.yLightPosition, _this.light);
    }

    delayLight(_this){
        _this.light.visible = true
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
        _this.aGrid.placeAt(_this.xLightPosition, _this.yLightPosition, _this.light);
    }

    reactionStatesMode(_this){
        const reaction = parseInt(localStorage.getItem('reaction')) + 1
        localStorage.setItem('reaction', reaction)

        if(reaction == Object.keys(_this.reactionStates).length + 1){
            _this.finish(_this)
        }else{
            _this.scene.start('ReactionGameScene', _this);
        }
    }

    finish(_this){
        _this.light.destroy()
        _this.endGame = true
        _this.timerProactive ? _this.timerProactive.paused = true : null
        _this.timerReactive ? _this.timerReactive.paused = true : null
        _this.timerDelayLight ? _this.timerDelayLight.paused = true : null
        _this.showMessageBox(_this, _this.aGrid.w * .3, _this.aGrid.h * .6);
    }
}