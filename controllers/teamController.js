const Team = require("../models/Team");
const User = require("../models/User");

exports.getTeam = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/connexion');
        }

        // Find the team based on the logged-in user
        const team = await Team
            .findOne({ users: req.session.user._id })
            .populate('users', 'name email highscore admin') 
            .sort({ highscore: -1 });
        res.render('team.ejs', { team });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};