const mongoose = require('mongoose');

//création du schéma
const gameSchema = new mongoose.Schema({
    randomNumber: {
        type: Number,
        required: true
    },
    tries : {
        type: Number,
        default: 0
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status:{
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
});

//créer nombre aléatoire
gameSchema.methods.generateRandomNumber = function(){
    this.randomNumber = Math.floor(Math.random() * 100) + 1;
    return this.randomNumber;
};

//comparer le nombre aléatoire avec celui de l'utilisateur
gameSchema.statics.compareNumbers = function(randomNumber, userNumber){
    if(userNumber < randomNumber){
        return {
            error: true,
            msg: 'Le nombre mystère est plus grand',
            type: 'warning'
        };
    } else if(userNumber > randomNumber){
        return {
            error: true,
            msg: 'Le nombre mystère est plus petit',
            type: 'warning'
        };
    } else {
        return {
            error: false,
            msg: 'Bravo, vous avez trouvé le nombre mystère !',
            type: 'success'
        };
    }
};

//création du modèle
const Game = mongoose.model('Game', gameSchema);

//export
module.exports = Game;