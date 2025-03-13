const Game = require("../models/Game");

exports.getRanking = async (req, res) => {
    try{
        const games = await Game.find({status: 'completed'})
        .populate('user', 'email')
        .sort({tries: 1});
    res.render('ranking.ejs', { games });
    }catch(err){
        console.error(err);
        res.status(500).send('Server error');
    }
}