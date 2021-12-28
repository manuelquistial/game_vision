import {default as PreloadMain} from "./PreloadMain.js"
import {default as BaseScene} from "./BaseScene.js"
import {default as LetterScene} from "./FigureScene.js"
import {default as DoubleCircleScene} from "./DoubleCircleScene.js"
import {default as GoNoGoScene} from "./GoNoGoScene.js"
import {default as ReactionScene} from "./ReactionScene.js"
import {default as ReactionGameScene} from "./ReactionGameScene.js"

var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        width: window.innerWidth,
        height: window.innerHeight,
    },
    parent: 'phaser-game',
    scene: [PreloadMain, BaseScene, LetterScene, DoubleCircleScene, GoNoGoScene, ReactionScene, ReactionGameScene]
};

var game = new Phaser.Game(config);