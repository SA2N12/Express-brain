const {body, validationResult} = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getLogin = (req, res) => {
    res.render('login.ejs', {errors: []});
};

exports.postLogin = 
[
    [
        body('email').notEmpty().withMessage('Email obligatoire'),
        body('email').isEmail().withMessage('Email invalide'),
        body('password').notEmpty().withMessage('Mot de passe obligatoire'),
        body('password').isLength({min: 6}).withMessage('Mot de passe invalide (minimum 6 caractères)')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.render('login', {errors: errors.array()});
        }

        const {email, password} = req.body;

        try {
            const user = await User.findOne({email});
            if(!user){
                return res.render('login', {errors: [{msg: 'Email ou mot de passe incorrect'}]});
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                return res.render('login', {errors: [{msg: 'Email ou mot de passe incorrect'}]});
            }
            req.session.user = user;
            res.redirect('/jouer');
        }catch(err){
            console.error(err);
            res.status(500).send('Erreur serveur');
        }

        
    }
]
