import {default as AlignGrid} from './AlignGrid.js'

export default class ArrowsScene extends Phaser.Scene {

    constructor() {
        super({ key: 'ArrowsScene' });
    }

    init(data){
        this.production = data.production
        this.source_path = data.source_path
        this.id_users_tests = data.id_users_tests
        this.gameSelected = true
        this.limit_figures = data.limit_figures
        
        this.maxColumns = data.maxColumns
        this.maxRows = data.maxRows
        this.size = data.size
        this.color = data.color
        this.colorFixation = data.colorFixation
        this.speed = data.speed
        this.timeDelay = data.timeDelay
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
        this.menuButton = data.menuButton

    }

    preload(){
        this.reactiveConfig = {delay: this.speed, callback: this.updatePosition, callbackScope: this, loop: false, paused: false}
        
        this.load.image('image_0', `${this.source_path}/img/down_arrow.svg`);
        this.load.image('image_1', `${this.source_path}/img/up_arrow.svg`);
        this.load.image('image_2', `${this.source_path}/img/left_arrow.svg`);
        this.load.image('image_3', `${this.source_path}/img/right_arrow.svg`);
        
    }

    create(){

        var gridConfig = {
            'scene': this,
            'height': this.game.config.height - (((this.game.config.height / this.maxRows) * this.percentageFixation) * 1.85),
            'width': this.game.config.width
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

        if((this.size >= (this.radioFixLights * 0.2)) && (this.size <= this.radioFixLights)){
            this.radioLights = this.size
        }else if(this.size < (this.radioFixLights * 0.2)){
            this.radioLights = (this.radioFixLights * 0.2)
        }else{
            this.radioLights = this.radioFixLights
        }

        this.gameModeAction()
        this.lights = this.add.circle(0, 0, this.radioLights, this.color);

        this.figures = this.add.image(0, 0, this.randomFigures())
        this.figures.displayWidth = this.radioLights
        this.figures.scaleY = this.figures.scaleX;
          
        this.figures.setOrigin(0.5)
        
        this.container = this.add.container(0, 0, [this.lights, this.figures])
        this.container.setVisible(false)
        this.aGrid.placeAt(this.xLightPosition, this.yLightPosition, this.container);

        this.left_side = this.add.circle(0, 0, this.fixationRadio, this.color);

        this.left_arrow = this.add.image(0, 0, 'image_2')
        this.left_arrow.displayWidth = this.fixationRadio
        this.left_arrow.scaleY = this.left_arrow.scaleX;
        this.left_arrow.setOrigin(0.5)

        this.left_container = this.add.container(0, 0, [this.left_side, this.left_arrow])
        this.left_side.setInteractive({ useHandCursor: true  }, new Phaser.Geom.Circle(this.fixationRadio, this.fixationRadio, this.radioFixLights), Phaser.Geom.Circle.Contains)

        this.left_container.x = (this.game.config.width / 2) - (this.fixationRadio * 2)
        this.left_container.y = this.game.config.height - (this.fixationRadio * 2.25)

        this.right_side = this.add.circle(0, 0, this.fixationRadio, this.color);

        this.right_arrow = this.add.image(0, 0, 'image_3')
        this.right_arrow.displayWidth = this.fixationRadio
        this.right_arrow.scaleY = this.right_arrow.scaleX;
        this.right_arrow.setOrigin(0.5)

        this.right_container = this.add.container(0, 0, [this.right_side, this.right_arrow])
        this.right_side.setInteractive({ useHandCursor: true  }, new Phaser.Geom.Circle(this.fixationRadio, this.fixationRadio, this.radioFixLights), Phaser.Geom.Circle.Contains)

        this.right_container.x = (this.game.config.width / 2) + (this.fixationRadio * 2)
        this.right_container.y = this.game.config.height - (this.fixationRadio * 2.25)

        this.up_side = this.add.circle(0, 0, this.fixationRadio, this.color);

        this.up_arrow = this.add.image(0, 0, 'image_1')
        this.up_arrow.displayWidth = this.fixationRadio
        this.up_arrow.scaleY = this.up_arrow.scaleX;
        this.up_arrow.setOrigin(0.5)

        this.up_container = this.add.container(0, 0, [this.up_side, this.up_arrow])
        this.up_side.setInteractive({ useHandCursor: true  }, new Phaser.Geom.Circle(this.fixationRadio, this.fixationRadio, this.radioFixLights), Phaser.Geom.Circle.Contains)

        this.up_container.x = (this.game.config.width / 2)
        this.up_container.y = this.game.config.height - (this.fixationRadio * 3.5)

        this.down_side = this.add.circle(0, 0, this.fixationRadio, this.color);

        this.down_arrow = this.add.image(0, 0, 'image_0')
        this.down_arrow.displayWidth = this.fixationRadio
        this.down_arrow.scaleY = this.down_arrow.scaleX;
        this.down_arrow.setOrigin(0.5)

        this.down_container = this.add.container(0, 0, [this.down_side, this.down_arrow])
        this.down_side.setInteractive({ useHandCursor: true  }, new Phaser.Geom.Circle(this.fixationRadio, this.fixationRadio, this.radioFixLights), Phaser.Geom.Circle.Contains)

        this.down_container.x = (this.game.config.width / 2)
        this.down_container.y = this.game.config.height - (this.fixationRadio)

        let points = {
            "time_reaction": 0,
            "position_x": this.xLightPosition,
            "position_y": this.yLightPosition,
            "response": 0
        }
        this.postGameData(this, points)
        this.saveLocalPoints(this, 'total_hits')

        this.up_side.on('pointerdown', function () {
            this.arrowChoose(this.up_arrow.texture)

        }, this);

        this.down_side.on('pointerdown', function () {
            this.arrowChoose(this.down_arrow.texture)

        }, this);

        this.left_side.on('pointerdown', function () {
            this.arrowChoose(this.left_arrow.texture)

        }, this);

        this.right_side.on('pointerdown', function () {
            this.arrowChoose(this.right_arrow.texture)

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
        if((this.finishTime != 0) && (this.limit_figures == 0)){
            this.finishScene = this.time.addEvent({delay: this.finishTime, callback: this.finishGame, callbackScope: this, loop: false, paused: false})
        }else if(this.limit_figures != 0){
            this.finishScene = this.time.delayedCall({})
        }

        this.timerReactive = this.time.addEvent(this.reactiveConfig)
        this.container.setVisible(true)
    }

    update() {
        if((this.finishTime == 0) && (this.limit_figures != 0)){
            let total_hits = JSON.parse(localStorage.getItem(this.id_users_tests)).total_hits

            if(this.limit_figures == total_hits){
                this.timerReactive.remove()
                this.time.addEvent({delay: this.timeDelay, callback: this.finish, callbackScope: this, loop: false, paused: false})
            }
        }
    }

    gameModeAction(){
        this.xLightPosition = this.randomNumber(0, this.maxColumns)
        this.yLightPosition = this.randomNumber(0, this.maxRows)
    }

    arrowChoose(arrow_choose){
        this.container.visible = false
        this.clickOnLight = true

        let timeLimitLight = this.timerReactive.getElapsed()
        this.timerReactive.remove()

        if(timeLimitLight <= this.speed){

            if(arrow_choose == this.figures.texture){

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

        this.timerDelayLight = this.time.addEvent({delay: this.timeDelay, callback: this.delayLight, callbackScope: this, loop: false, paused: false})

    }

    updatePosition(){

        this.gameModeAction()

        this.figures.setTexture(this.randomFigures())

        let points = {
            "time_reaction": 0,
            "position_x": this.xLightPosition,
            "position_y": this.yLightPosition,
            "response": 0
        }
        this.postGameData(this, points)
        this.saveLocalPoints(this, 'total_hits')

        this.aGrid.placeAt(this.xLightPosition, this.yLightPosition, this.container);

        this.timerReactive.remove()
        this.timerReactive = this.time.addEvent(this.reactiveConfig)
    }

    delayLight(){
     
        this.container.visible = true

        this.timerReactive = this.time.addEvent(this.reactiveConfig)

        this.gameModeAction()

        this.figures.setTexture(this.randomFigures())

        /*let points = {
            "time_reaction": 0,
            "position_x": this.xLightPosition,
            "position_y": this.yLightPosition,
            "response": 2
        }
        this.postGameData(this, points)
        this.saveLocalPoints(this, 'total_hits')*/

        this.aGrid.placeAt(this.xLightPosition, this.yLightPosition, this.container);
    }
    
    randomFigures(){
        return "image_" + this.randomNumber(0, 4).toString()
    }

    finishGame(){
        this.finishTimeScene = this.finishScene.getElapsed()
        this.finishScene.remove()
        this.finishScene = this.time.addEvent({delay: this.speed, callback: this.finish, callbackScope: this, loop: false, paused: false})
    }

    finish(){
        this.lights.destroy()
        this.endGame = true
        this.timerReactive ? this.timerReactive.paused = true : null
        this.timerDelayLight ? this.timerDelayLight.paused = true : null
        this.finishScene.paused = true
        this.showMessageBox(this, this.game.config.width * .3, this.game.config.height * .6);
    }
}