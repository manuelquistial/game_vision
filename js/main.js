import {default as PreloadMain} from "./PreloadMain.js"
import {default as BaseScene} from "./BaseScene.js"
import {default as LetterScene} from "./FigureScene.js"
import {default as DobleCircleScene} from "./DobleCircleScene.js"

var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        width: window.innerWidth,
        height: window.innerHeight,
    },
    parent: 'phaser-game',
    scene: [PreloadMain, BaseScene, LetterScene, DobleCircleScene]
};

var game = new Phaser.Game(config);