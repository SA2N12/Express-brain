const Game = require('../models/Game');
const User = require('../models/User');
const {body, validationResult} = require('express-validator');

exports.getGame = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/connexion');
    }

    const game = new Game({
        user: req.session.user._id
    });
    game.generateRandomNumber();
    await game.save();

    res.render('game.ejs', { 
        randomNumber: game.randomNumber,
        tries: game.tries, 
        result: '',
    });
}

exports.postGame = [
    body('userNumber')
        .notEmpty().withMessage('Le nombre est obligatoire')
        .isInt({ min: 1, max: 100 }).withMessage('Le nombre doit être compris entre 1 et 100'),
    async (req, res) => {
        if (!req.session.user) {
            return res.redirect('/connexion');
        }

        const errors = validationResult(req);

        try {
            const game = await Game.findOne({ 
                user: req.session.user._id, 
                status: 'active'
            });

            if (!game) {
                return res.redirect('/jouer');
            }

            if (!errors.isEmpty()) {
                return res.render('game.ejs', {
                    randomNumber: game.randomNumber,
                    tries: game.tries,
                    result: { error: true, msg: errors.array()[0].msg, type: 'error' }
                });
            }

            game.tries += 1;
            const userNumber = parseInt(req.body.userNumber);
            const result = Game.compareNumbers(game.randomNumber, userNumber);

            if (result.type === 'success') {
                game.status = 'completed';
                game.completedAt = new Date();

                const user = await User.findById(req.session.user._id);

                if (user.highscore == null || user.highscore < game.tries) {
                    user.highscore = game.tries;
                    await user.save();
                }
            }

            await game.save();

            res.render('game.ejs', { 
                randomNumber: game.randomNumber,
                tries: game.tries,
                result
            });
        } catch(err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
];

exports.getReset = async (req, res) => {
    res.redirect('/jouer');
}