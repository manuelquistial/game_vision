export default class ReactionScene extends Phaser.Scene {

    constructor() {
        super({ key: 'ReactionScene' });
    }

    init(data){
        this.reaction_game = data
    }

    preload(){

        localStorage.setItem('reaction', 1)

        this.reaction_game.reactionStates = {
            "reaction_1": {
                "speed": 1500,
                "columns": 15,
                "rows": 12
            },
            "reaction_2": {
                "speed": 1000,
                "columns": 15,
                "rows": 12
            },
            "reaction_3": {
                "speed": 500,
                "columns": 15,
                "rows": 12
            },
            "reaction_4": {
                "speed": 500,
                "columns": 15,
                "rows": 12
            },
            "reaction_5": {
                "speed": 300,
                "columns": 15,
                "rows": 12
            }
        }

        this.scene.start('ReactionGameScene', this.reaction_game);
    }
}