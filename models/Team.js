//import mongoose
const mongoose = require('mongoose');

//création du modèle
const Team = mongoose.model('Team',{
    users:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    name:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

//export
module.exports = Team;