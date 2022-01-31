import {default as AlignGrid} from './AlignGrid.js'

export default class ReactionGameScene extends Phaser.Scene {

    timerProactive;
    timerDelayLight;
    timerFixLight;

    constructor() {
        super({ key: 'ReactionGameScene' });
    }

    init(data){
        this.production = data.production
        this.id_users_tests = data.id_users_tests
        this.gameType = data.gameType

        this.size = data.size
        this.color = data.color
        this.timeDelay = data.timeDelay

        this.showMessageBox = data.showMessageBox
        this.postGameData = data.postGameData
        this.successAudio = data.successAudio
        this.failureAudio = data.failureAudio

        //functions
        this.randomNumber = data.randomNumber
        this.saveLocalPoints = data.saveLocalPoints
        this.menuButton = data.menuButton
        
        this.percentageFixation = data.percentageFixation
        this.scanning_state = data.scanning_state
        this.levels_state = data.levels_state
        this.user_reaction = data.user_reaction

        this.reaction_game_user = JSON.parse(localStorage.getItem(this.user_reaction))

        if(this.reaction_game_user['scanning']){
            this.speed = null
            this.cols = this.scanning_state.columns
            this.rows = this.scanning_state.rows
            this.limit_figures = this.scanning_state.limit_figures
            this.series = this.scanning_state.series
        }else{
            this.speed = this.reaction_game_user['speed']
            this.cols = this.levels_state.columns
            this.rows = this.levels_state.rows
            this.limit_figures = this.levels_state.limit_figures
            this.series = this.levels_state.series
            this.levels = this.levels_state.levels
            this.minimum_series = this.levels_state.minimum_series
            this.speed_minus = this.levels_state.speed_minus
            this.min_speed_percentage = this.levels_state.min_speed_percentage
        }
     
        if((this.scale.orientation == 'landscape-primary') || (this.scale.orientation == 'landscape')){
            this.maxColumns = this.cols
            this.maxRows = this.rows
        }else{
            this.maxRows = this.cols
            this.maxColumns = this.rows
        }

        this.porcentage_hits = 0
        this.message_duration = 1000
        this.finish_message_duration = 3000
        this.amount_time = 5
        this.end_game = false
        this.changeMessageColor = false;

        if(!this.reaction_game_user['scanning']){
            if(this.reaction_game_user['levels_sub_count'] > 1){
                this.amount_time = 3
            }
        }else{
            if(this.reaction_game_user['scanning_count'] > 0){
                this.amount_time = 3
            }
        }
        this.finish_message_enable = false
    }

    preload(){
        if(!this.reaction_game_user['scanning']){
            this.reactiveConfig = {delay: this.speed, callback: this.updatePosition, args: [this], loop: true, paused: false}
        }
        this.processMessageConfig = {delay: this.message_duration, callback: this.countProcessMessage, args: [this], loop: true, paused: false}
        this.finishMessageConfig = {delay: this.finish_message_duration, callback: this.countFinishMessage, args: [this], loop: false, paused: false}
    }

    create(){
        
        var gridConfig = {
            'scene': this,
            'height': this.game.config.height,
            'width': this.game.config.width
        }
        
        this.aGrid = new AlignGrid(gridConfig);

        this.timerStateMessage = this.time.addEvent(this.processMessageConfig)
        this.menuButton(this)
    }

    initialization(){
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

        this.gameModeActionLight()
        this.light = this.add.circle(0, 0, this.radioLights, this.color);
        this.light.setInteractive({ useHandCursor: true  }, new Phaser.Geom.Circle(this.radioLights, this.radioLights, this.radioLights), Phaser.Geom.Circle.Contains)

        this.aGrid.placeAt(this.xLightPosition, this.yLightPosition, this.light);

        if(this.reaction_game_user['scanning']){
            this.timerProactive = this.time.delayedCall({})
        }else{
            this.timerReactive = this.time.addEvent(this.reactiveConfig)
            this.reaction_game_user['counting_lights'] += 1 
        }

        this.light.on('pointerdown', function () {
            this.clickOnLight = true

            if(this.reaction_game_user['scanning']){
                let timeLimitLight = this.timerProactive.getElapsed()
                this.timerProactive.remove()

                this.reaction_game_user['hits'] += 1 
                this.reaction_game_user['speed'] += timeLimitLight

                if(this.limit_figures == this.reaction_game_user['hits']){
                    this.reaction_game_user['hits'] = 0
                    this.reactionStatesMode(this)
                }
       
            }else{
                let timeLimitLight = this.timerReactive.getElapsed()
                this.timerReactive.remove()

                //if((timeLimitLight <= this.speed) && (timeLimitLight >= (this.speed * this.min_speed_percentage))){
                this.reaction_game_user['hits'] += 1
                this.reaction_game_user['speeds'].push(timeLimitLight)
                //}
            }

            /*if(timeLimitLight < this.speed){
                this.successAudio ? this.successAudio.play() : null
                let points = {
                    "time_reaction": timeLimitLight,
                    "position_x": this.xLightPosition,
                    "position_y": this.yLightPosition,
                    "response": 1
                }
                this.postGameData(this, points)

                this.points_stage = this.points_stage + 1
                this.saveLocalPoints(this, 'on_time')
                this.saveLocalPoints(this, 'precision', timeLimitLight)

            }else{
                this.failureAudio ? this.failureAudio.play() : null
            }*/
            
            this.light.visible = false
            localStorage.setItem(this.user_reaction, JSON.stringify(this.reaction_game_user)); 
            this.timerDelayLight = this.time.addEvent({delay: this.timeDelay, callback: this.delayLight, args: [this], loop: false, paused: false})
        }, this);

    }

    update(){
        if(!this.reaction_game_user['scanning']){
            if(this.reaction_game_user['counting_lights'] == (this.limit_figures + 1)){
                this.reaction_game_user['counting_lights'] = 0
                this.reactionStatesMode(this)
            }
        }
    }

    updatePosition(_this){
        if(!_this.reaction_game_user['scanning']){
            _this.reaction_game_user['counting_lights'] += 1 
            localStorage.setItem(_this.user_reaction, JSON.stringify(_this.reaction_game_user)); 
        }

        _this.gameModeActionLight()
        _this.aGrid.placeAt(_this.xLightPosition, _this.yLightPosition, _this.light);
    }

    gameModeActionLight(){
        this.xLightPosition = this.randomNumber(0, this.maxColumns)
        this.yLightPosition = this.randomNumber(0, this.maxRows)
    }

    delayLight(_this){
        _this.light.visible = true
        if(!_this.reaction_game_user['scanning']){
            _this.reaction_game_user['counting_lights'] += 1 
            localStorage.setItem(_this.user_reaction, JSON.stringify(_this.reaction_game_user)); 
            _this.timerReactive = _this.time.addEvent(_this.reactiveConfig)
        }else{
            _this.timerProactive = _this.time.delayedCall({})
        }
        
        _this.gameModeActionLight()
        _this.aGrid.placeAt(_this.xLightPosition, _this.yLightPosition, _this.light);
    }

    countProcessMessage(_this){
        _this.stateMessage(_this)
        if(_this.amount_time == 0){
            _this.timerStateMessage.remove()
            _this.initialization()
        }else{
            _this.amount_time = _this.amount_time - 1
        }
    }

    stateMessage(_this){
  
        this.back ? this.back.destroy() : null
        this.box_title ? this.box_title.destroy() : null
        this.box_message ? this.box_message.destroy() : null

        this.w = this.aGrid.w * .5
        this.h = this.aGrid.h * .4

        if(this.production){
            if(this.reaction_game_user['scanning']){
                if(this.finish_message_enable){
                    this.boxTitle = window.languaje.scanning_title_finish
                    this.boxMessage = window.languaje.scanning_body_finish
                }else{
                    this.boxTitle = window.languaje.scanning_title_start
                    this.boxMessage = window.languaje.scanning_body_start
                }
            }else{
                if(this.end_game){
                    this.boxTitle = window.languaje.reaction_message + '\n' + window.languaje.final_result
                    this.boxMessage = window.languaje.max_level + "%level%\n" + window.languaje.finish_message + "%speed% ms"
                }else if(this.finish_message_enable){
                    this.boxTitle = window.languaje.scanning_title_finish
                    this.boxMessage = window.languaje.scanning_body_finish
                }else{
                    this.boxTitle = window.languaje.level_title_start
                    this.attemp_titles = {
                        1: window.languaje.level_first_attemp,
                        2: window.languaje.level_second_attemp,
                        3: window.languaje.level_third_attemp,
                        4: window.languaje.level_forth_attemp,
                        5: window.languaje.level_fifth_attemp
                    }
                    this.boxMessage = window.languaje.scanning_body_start
                    this.maxSpeedMessage = window.languaje.max_speed
                    this.minSpeedMessage = window.languaje.min_speed
                }
            }
        }else{
            if(this.end_game){
                this.boxTitle = "REACTION TEST\nFINAL RESULT"
                this.boxMessage = "MAX LEVEL %level%\nYour Reaction Time is %speed% ms"
            }else if(this.reaction_game_user['scanning']){
                if(this.finish_message_enable){
                    this.boxTitle = "SCANNING COMPLETE"
                    this.boxMessage = "Initital Average"
                }else{
                    this.boxTitle = "SCANNING YOUR SPEED"
                    this.boxMessage = "We are going to evaluate your response speed, for this, you will have 5 chances to touch the lights as fast as you can as soon as they appear."
                }
            }else{
                if(this.finish_message_enable){
                    this.boxTitle = "SCANNING COMPLETE"
                    this.boxMessage = "Initital Average"
                }else{
                    this.boxTitle = "Level"
                    this.attemp_titles = {
                        1: "FIRST ATTEMP",
                        2: "SECOND ATTEMP",
                        3: "THIRD ATTEMP",
                        4: "FORTH ATTEMP",
                        5: "FIFTH ATTEMP"
                    }
                    this.boxMessage = "Next, you will have to touch each light in the shortest time possible. Once you do it in SCANNING given time %speed% ms  you will be able to continue to the next level."
                    this.maxSpeedMessage = "Maximun speed:"
                    this.minSpeedMessage = "Minimun speed:"
                }
            }
        }

        this.colorText = "#FFFFFF";

        if(this.end_game){
            this.boxMessage = this.boxMessage.replace("%level%", _this.reaction_game_user['levels_count']).replace("%speed%", Math.round(_this.reaction_game_user['last_correct_speed']))
            this.finishSerie = false
            this.messageBox(this)
        }else if(this.finish_message_enable){
            this.finish_message_enable = false
            this.boxMessage = this.boxMessage + '\n' + Math.round(this.reaction_game_user['speed']) + ' ms'
            this.messageBox(this)
        }else{
            if(!this.reaction_game_user['scanning']){
                
                let level_number = Number(this.reaction_game_user['levels_count'])
                this.boxMessage = this.boxMessage.replace('%speed%', Math.round(this.reaction_game_user['speed']))
                this.boxTitle = this.boxTitle + ' ' + level_number + '\n'
                if(this.finishSerie){
                    this.boxTitle += this.attemp_titles[this.reaction_game_user['levels_sub_count']]
                }else{
                    this.boxTitle += this.attemp_titles[this.reaction_game_user['levels_sub_count']]
                }

            }
            
            if (this.amount_time == 0) {
                if(!this.reaction_game_user['scanning']){
                    if(this.finishSerie){
                        
                        this.boxMessage = this.porcentage_hits + '%'
                        this.maxSpeedMessage = this.maxSpeedMessage + ' ' + Math.round(Math.max(...this.reaction_game_user['speeds'])) + ' ms'
                        this.minSpeedMessage = this.minSpeedMessage + ' ' + Math.round(Math.min(...this.reaction_game_user['speeds'])) + ' ms'
                        if(this.correctColorPorcentage){
                            this.colorText = "#00FF00"
                        }else{
                            this.colorText = "#FF0000"
                        }
                        this.messageBox(this)
                        this.finishSerie = false
                    }
                }
            }else{
                
                this.back ? this.back.destroy() : null
                this.box_title ? this.box_title.destroy() : null
                this.box_message ? this.box_message.destroy() : null

                if(this.amount_time < 3){
                    this.boxMessage = this.amount_time
                }else if(this.amount_time == 3){
                    this.boxMessage = this.amount_time
                    this.box_title ? this.box_title.destroy() : null
                }

                this.messageBox(this)
            }
        }
    }

    messageBox(_this){
        //make a group to hold all the elements
        let msgBox = _this.add.group();
        let back = _this.add.rectangle(0, 0);
        back.setFillStyle(0x000000);
        back.setStrokeStyle(4, 0xffffff)

        let box_title = _this.add.text(0, 0, _this.boxTitle)
            .setStyle({ fontSize: '54px', fontFamily: 'Arial', align: 'center'});

        let box_message = _this.add.text(0, 0, _this.boxMessage)
            .setStyle({ fontSize: (_this.amount_time >= 4) ? '32px' : '70px', fontFamily: 'Arial', align: 'center', color: _this.colorText});

        let max_speed = null
        let min_speed = null

        if(!_this.reaction_game_user['scanning']){
            if(_this.finishSerie){
                max_speed = _this.add.text(0, 0, _this.maxSpeedMessage)
                    .setStyle({ fontSize: '60px', fontFamily: 'Arial', align: 'center', color: '#FFFFFF'});

                min_speed = _this.add.text(0, 0, _this.minSpeedMessage)
                    .setStyle({ fontSize: '60px', fontFamily: 'Arial', align: 'center', color: '#FFFFFF'});
            }
        }

        //make the width of the wrap 90% of the width 
        //of the message box
        box_message.setWordWrapWidth(this.w * .8);

        back.setSize(this.w, this.h)
        
        //add the elements to the group
        msgBox.add(back)
        msgBox.add(box_title)
        msgBox.add(box_message)
        if(!_this.reaction_game_user['scanning']){
            if(_this.finishSerie){
                msgBox.add(max_speed)
                msgBox.add(min_speed)
            }
        }

        msgBox.setXY(_this.aGrid.w / 2, (_this.aGrid.h / 2) + 100)
        msgBox.setOrigin(0.5)

        //set the text in the middle of the message box
        box_message.x = _this.aGrid.w  / 2;
        box_message.y = (_this.aGrid.h  / 2) + 100;
        if(!_this.reaction_game_user['scanning']){
            if(_this.finishSerie){
                box_message.y = (_this.aGrid.h  / 2) + 10;

                max_speed.x = _this.aGrid.w  / 2;
                max_speed.y = (_this.aGrid.h  / 2) + 90;

                min_speed.x = _this.aGrid.w  / 2;
                min_speed.y = (_this.aGrid.h  / 2) + 180;
            }
        }
        
        box_message.setOrigin(0.5);

        box_title.x = _this.aGrid.w  / 2 ;
        box_title.y = (_this.aGrid.h  / 2) - this.h/2 - 100;
        box_title.setOrigin(0.5);

        _this.msgBox = msgBox;
        _this.back = back
        _this.box_message = box_message
        _this.box_title = box_title
        if(!_this.reaction_game_user['scanning']){
            if(_this.finishSerie){
                _this.max_speed = max_speed
                _this.min_speed = min_speed
            }
        }
    }

    endGameMessage(_this){
        _this.stateMessage(_this)
    }

    countFinishMessage(_this){
        _this.finishMessage.remove()
        if(!_this.end_game){
            if(_this.reaction_game_user['scanning']){
                _this.reaction_game_user['scanning'] = false
                _this.reaction_game_user['hits'] = 0
                localStorage.setItem(_this.user_reaction, JSON.stringify(_this.reaction_game_user));
                _this.scene.start('ReactionGameScene', _this);
            }else{
                _this.scene.start('ReactionGameScene', _this);
            }
        }else{
            _this.finishMessageConfig = {delay: _this.finish_message_duration, callback: _this.endGameMessage, args: [_this], loop: false, paused: false}
            _this.finishMessage = _this.time.addEvent(_this.finishMessageConfig)
        }
    }

    reactionStatesMode(_this){
        if(_this.reaction_game_user['scanning']){
            _this.reaction_game_user['scanning_count'] += 1

            if(_this.reaction_game_user['scanning_count'] == _this.series){
                _this.finish_message_enable = true
                _this.reaction_game_user['speed'] = _this.reaction_game_user['speed'] / _this.series
                _this.light.destroy()
                _this.timerProactive ? _this.timerProactive.paused = true : null
                _this.timerDelayLight ? _this.timerDelayLight.paused = true : null
                _this.stateMessage(_this)
                localStorage.setItem(_this.user_reaction, JSON.stringify(_this.reaction_game_user));
                _this.finishMessage = _this.time.addEvent(_this.finishMessageConfig)
            }else{
                _this.scene.start('ReactionGameScene', _this);
            }
        }else{

            _this.porcentage_hits = (_this.reaction_game_user['hits'] * 100)/_this.limit_figures
            _this.reaction_game_user['series_hit'].push(_this.porcentage_hits)
            _this.reaction_game_user['hits'] = 0
            _this.finishSerie = true;

            _this.light.destroy()
            _this.timerReactive ? _this.timerReactive.remove() : null
            _this.timerDelayLight ? _this.timerDelayLight.remove() : null

            let countFiltered = _this.reaction_game_user['series_hit'].filter(function(element){
                return element >= (_this.min_speed_percentage * 100);
            }).length

            if(_this.porcentage_hits >= (_this.min_speed_percentage * 100)){
                _this.correctColorPorcentage = true
            }else{
                _this.correctColorPorcentage = false
            }

            if(_this.reaction_game_user['speeds'].length == 0){
                _this.reaction_game_user['speeds'] = [0]
            }

            _this.stateMessage(_this)
            _this.reaction_game_user['speeds'] = []

            if((_this.reaction_game_user['levels_sub_count'] == _this.series) || (countFiltered == _this.minimum_series)){
                _this.reaction_game_user['levels_sub_count'] = 0
                _this.reaction_game_user['series_hit'] = []

                if(_this.reaction_game_user['try_level_one']){
                    if(_this.reaction_game_user['levels_count'] == 1){
                        if(_this.reaction_game_user['levels_count'] == _this.levels){
                            _this.end_game = true
                        }else{
                            _this.reaction_game_user['last_correct_speed'] = _this.reaction_game_user['speed']
                            if(countFiltered < _this.minimum_series){
                                _this.reaction_game_user['levels_count'] = 1
                                _this.reaction_game_user['try_level_one'] = false
                            }else{
                                _this.reaction_game_user['speed'] -= _this.speed_minus
                                _this.reaction_game_user['levels_count'] += 1
                            }
                        }
                    }else{
                        if(countFiltered < _this.minimum_series){
                            _this.end_game = true
                        }else{
                            if(_this.reaction_game_user['levels_count'] == _this.levels){
                                _this.reaction_game_user['last_correct_speed'] = _this.reaction_game_user['speed']
                                _this.end_game = true
                            }else{
                                _this.reaction_game_user['last_correct_speed'] = _this.reaction_game_user['speed']
                                _this.reaction_game_user['levels_count'] += 1
                                _this.reaction_game_user['speed'] -= _this.speed_minus
                            }
                        }

                    }
                }else{
                    if(countFiltered < _this.minimum_series){
                        _this.end_game = true
                    }else{
                        _this.reaction_game_user['try_level_one'] = true
                    }
                }
            }
            _this.reaction_game_user['levels_sub_count'] += 1

            localStorage.setItem(_this.user_reaction, JSON.stringify(_this.reaction_game_user));
            _this.finishMessage = _this.time.addEvent(_this.finishMessageConfig)
        }
        localStorage.setItem(_this.user_reaction, JSON.stringify(_this.reaction_game_user));
    }
}