export default class ReactionScene extends Phaser.Scene {

    constructor() {
        super({ key: 'ReactionScene' });
    }

    init(data){
        this.reaction_game = data
    }

    preload(){

        let reaction_game_user = {
            hits: 0,
            counting_lights: 0,
            scanning: true,
            speed: 0,
            scanning_count: 0,
            levels_count: 1,
            levels_sub_count: 1,
            try_level_one: true,
            speeds: [],
            series_hit: []
        }

        this.reaction_game.user_reaction = this.reaction_game.id_users_tests + '_reaction'
        localStorage.setItem(this.reaction_game.user_reaction, JSON.stringify(reaction_game_user)); 

        this.reaction_game.scanning_state = {
            "columns": 5,
            "rows": 4,
            "limit_figures": 20,
            "series": 5
        }

        this.reaction_game.levels_state = {
            "columns": 5,
            "rows": 4,
            "limit_figures": 20,
            "series": 5,
            "levels": 5,
            "minimum_series": 3,
            "speed_minus": 30,
            "min_speed_percentage": 0.8
        }

        this.reaction_game.percentageFixation = 0.2
        
        this.scene.start('ReactionGameScene', this.reaction_game);
    }
}