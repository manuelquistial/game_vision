import {default as PreloadMain} from "./PreloadMain.js"
import {default as MatrixScene} from "./MatrixScene.js"
import {default as FigureScene} from "./FigureScene.js"
import {default as DoubleCircleScene} from "./DoubleCircleScene.js"
import {default as GoNoGoScene} from "./GoNoGoScene.js"
import {default as ReactionScene} from "./ReactionScene.js"
import {default as ReactionGameScene} from "./ReactionGameScene.js"
import {default as ArrowsScene} from "./ArrowsScene.js"

let config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        width: window.innerWidth,
        height: window.innerHeight,
    },
    parent: 'phaser-game'
};

const production = false
let gameType = 1
localStorage.setItem('production', production)

if(production){
    config.backgroundColor = window.parameters.game_background
    gameType = window.parameters.game_type
    localStorage.setItem('gameType', gameType)
}else{
    config.backgroundColor = "#000000"
    localStorage.setItem('gameType', gameType)
}

if(gameType == 1){
    config.scene = [PreloadMain, MatrixScene]
}else if(gameType == 2){
    config.scene = [PreloadMain, FigureScene]
}else if(gameType == 3){
    config.scene = [PreloadMain, FigureScene]
}else if(gameType == 4){
    config.scene = [PreloadMain, FigureScene]
}else if(gameType == 5){
    config.scene = [PreloadMain, DoubleCircleScene]
}else if(gameType == 6){
    config.scene = [PreloadMain, FigureScene]
}else if(gameType == 7){
    config.scene = [PreloadMain, GoNoGoScene]
}else if(gameType == 8){
    config.scene = [PreloadMain, ReactionScene, ReactionGameScene]
}else if(gameType == 9){
    config.scene = [PreloadMain, ArrowsScene]
}else if(gameType == 10){
    config.scene = [PreloadMain, MatrixScene]
}
new Phaser.Game(config);