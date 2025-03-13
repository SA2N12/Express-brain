const {body, validationResult} = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Team = require('../models/Team');

exports.getRegister = (req, res) => {
    res.render('register.ejs', {errors: []});
};

exports.postRegister = [
    [body('name').notEmpty().withMessage('Nom obligatoire'),
        body('name').isLength({min: 3}).withMessage('Nom invalide (minimum 3 caractères)'),
        body('email').notEmpty().withMessage('Email obligatoire'),
        body('email').isEmail().withMessage('Email invalide'),
        body('email').custom(async (value) => {
            const users = await User.find();
            users.forEach(user => {
                if(user.email === value){
                    throw new Error('Email déjà utilisé');
                }
            });
            return true;
        }),
        body('password').notEmpty().withMessage('Mot de passe obligatoire'),
        body('password').isLength({min: 6}).withMessage('Mot de passe invalide (minimum 6 caractères)'),
        body('passwordConfirmation').custom((value, {req}) => {
            if(value !== req.body.password){
                throw new Error('Les mots de passe ne correspondent pas');
            }
            return true;
        })],
        async (req, res) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.render('register', {errors: errors.array()});
            }

            const {name, email, password} = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            try{
                //créer utlisateur sans équipe
                const user = new User({
                    name,
                    email,
                    password: hashedPassword,
                    admin: 'user',
                    team: null
                });
                await user.save();

                //trouver utilisateurs sans équipe
                const usersWithoutTeam = await User.find({team: null}).sort({createdAt: -1});

                //création de l'équipe si 2 utilisateur sans équipe
                if(usersWithoutTeam.length === 2){
                    const team = new Team({
                        name : `Team${Math.floor(Math.random() * 1000)}`,
                        users: [usersWithoutTeam[0]._id, usersWithoutTeam[1]._id]
                    });
                    await team.save();

                    //mettre à jour les utilisateurs qui ont désormais une équipe
                    await User.updateMany(
                        {_id: {$in: [usersWithoutTeam[0]._id, usersWithoutTeam[1]._id]}},
                        {team: team._id}
                    );
                }

                res.redirect('/connexion');
            }catch(err){
                console.log(err);
                res.status(500).send('Internal server error');
            }    
        }
]
