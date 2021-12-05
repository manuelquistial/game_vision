class SceneMain extends Phaser.Scene {

    constructor() {
        super('SceneMain');
    }

    preload() {
        this.gameMode = 1
        this.maxColumns = 5
        this.maxRows = 4
        this.colorLight = 0xf00000
        this.colorFixationLight = 0xffffff
        this.turnOffMode = true //true: reactive, false: proactive
        this.fixationLightEnable = false //true: enable fixation light, false: disable fixation light
        this.porcentajeFixationLight = 0.2
        this.midMaxColumns = this.maxColumns / 2
        this.midMaxRows = this.maxRows/ 2
    }

    create() {
        var gridConfig = {
            'scene': this,
            'cols': this.maxColumns,
            'rows': this.maxRows
        }
        
        this.aGrid = new AlignGrid(gridConfig);
        this.aGrid.showNumbers();

        if(this.aGrid.ch / 2 > this.aGrid.cw / 2){
            this.radioLights = this.aGrid.cw / 2
        }else{
            this.radioLights = this.aGrid.ch / 2
        }

        if(this.fixationLightEnable){
            let fixationRadio = this.radioLights * this.porcentajeFixationLight
            this.fixationLight = this.add.circle(this.aGrid.w / 2, this.aGrid.h / 2, fixationRadio, this.colorFixationLight);
            this.radioLights = this.radioLights - fixationRadio
        }

        this.gameModeAction()
        this.lights = this.add.circle(0, 0, this.radioLights, this.colorLight);
        this.lights.setInteractive(new Phaser.Geom.Circle(this.radioLights, this.radioLights, this.radioLights), Phaser.Geom.Circle.Contains)

        this.aGrid.placeAt(this.xLightPosition, this.yLightPosition, this.lights);

        this.lights.on('pointerup', function () {
            this.gameModeAction()
            this.aGrid.placeAt(this.xLightPosition, this.yLightPosition, this.lights);

        }, this);
        //place the face on the grid
        //this.aGrid.placeAtIndex(18, this.circle);
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
            case 7:
                this.xLightPosition = this.randomNumber(0, this.midMaxColumns)
                this.yLightPosition = this.randomNumber(0, this.maxRows)
                break;
            //right side
            case 7:
                this.xLightPosition = this.randomNumber(this.midMaxRows, this.maxColumns)
                this.yLightPosition = this.randomNumber(0, this.maxRows)
                break;
        }
    }

        // Function to generate random number 
        randomNumber(min_val, max_val) { 
            return Math.trunc(Math.random() * (max_val - min_val) + min_val);
        } 
}