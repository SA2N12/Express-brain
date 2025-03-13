const mongoose = require('mongoose');

//création du modèle
const User = mongoose.model('User', {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }, 
    admin : {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    highscore: {
        type: Number,
        default: null
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    }
});

//export du modèle
module.exports = User;