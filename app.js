//express
const express = require('express');
const app = express();
const port = 3000;

//express-validator
const {body, validationResult} = require('express-validator');

//express-session
const session = require('express-session');

//path
const path = require('path');
app.use(express.urlencoded({extended: true}));

//body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

//session middleware
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUnititialized: false
}))

//mysteryNumber
const mysteryNumber = require('./mysteryNumber');

//configuration des vues
app.set('view engine', 'ejs'); //moteur de vue ejs
app.set('views', path.join(__dirname, 'views')); //dossier des vues

//spécifier le dossier d'images
app.use(express.static('public'));

//lancement du serveur
app.listen(port, ()=>{
    console.log(`Server started on http://localhost:${port}`);
});

//get index
app.get('/', (req, res)=>{
    res.render('index.ejs');
});

//get jouer
app.get('/jouer',(req, res) => {
    if(!req.session.randomNumber){
        req.session.randomNumber = mysteryNumber.generateRandomNumber();
    }
    res.render('jouer.ejs', { randomNumber: req.session.randomNumber, result: '' });
});

//post jouer
app.post(
    '/jouer', 
    [body('userNumber')
        .notEmpty().withMessage('Le nombre est obligatoire')
        .isInt({min: 1, max: 100}).withMessage('Le nombre doit être compris entre 1 et 100')],
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.render(
                'jouer.ejs',  
                {
                    randomNumber: req.session.randomNumber,
                    result: {
                        error: true, 
                        msg: errors.array()[0].msg, 
                        type: 'error'
                    }
                }
            );
        };
        const userNumber = req.body.userNumber;
        randomNumber = mysteryNumber.getRandomNumber();
        const result = mysteryNumber.compareNumbers(req.session.randomNumber, userNumber);
        res.render('jouer.ejs', { randomNumber: req.session.randomNumber, result });
});

//get reset
app.get('/reset', (req, res) =>{
    req.session.randomNumber = mysteryNumber.generateRandomNumber();
    res.redirect('/jouer');
})

//get connexion
app.get('/connexion', (req, res) => {
    res.render('connexion.ejs', {errors: []});
});

//post connexion
app.post('/connexion',
    [
        body('email').notEmpty().withMessage('Email obligatoire'),
        body('email').isEmail().withMessage('Email invalide'),
        body('password').notEmpty().withMessage('Mot de passe obligatoire'),
        body('password').isLength({min: 6}).withMessage('Mot de passe invalide (minimum 6 caractères)')
    ],
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.render('connexion', {errors: errors.array()});
        }
        res.redirect('/jouer');
});

//get inscription
app.get('/inscription', (req, res) => {
    res.render('inscription.ejs', {errors: []});
});

//post inscription
app.post('/inscription',
    [
        body('name').notEmpty().withMessage('Nom obligatoire'),
        body('name').isLength({min: 3}).withMessage('Nom invalide (minimum 3 caractères)'),
        body('email').notEmpty().withMessage('Email obligatoire'),
        body('email').isEmail().withMessage('Email invalide'),
        body('password').notEmpty().withMessage('Mot de passe obligatoire'),
        body('password').isLength({min: 6}).withMessage('Mot de passe invalide (minimum 6 caractères)'),
        body('passwordConfirmation').custom((value, {req}) => {
            if(value !== req.body.password){
                throw new Error('Les mots de passe ne correspondent pas');
            }
            return true;
        })
    ],
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.render('inscription', {errors: errors.array()});
        }
        res.redirect('/jouer');
});