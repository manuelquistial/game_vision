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
                "columns": 10,
                "rows": 6
            },
            "reaction_2": {
                "speed": 1000,
                "columns": 10,
                "rows": 6
            },
            "reaction_3": {
                "speed": 500,
                "columns": 10,
                "rows": 6
            },
            "reaction_4": {
                "speed": 500,
                "columns": 12,
                "rows": 10
            },
            "reaction_5": {
                "speed": 300,
                "columns": 12,
                "rows": 10
            }
        }

        this.scene.start('ReactionGameScene', this.reaction_game);
    }
}