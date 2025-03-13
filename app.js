//imports
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const session = require('express-session');
const routes = require('./routes');
const auth = require('./middlewares/auth');

const app = express();
const port = 3000;

//configuration des middlewares
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: false}));

// Configuration de la session
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false
}));

//authentification middleware
app.use(auth);

//connexion avec mongoose
mongoose.connect('mongodb://localhost:27017/brain_app').then(()=>{
    console.log('connected to mongoose server');
}
).catch(err => {
    console.log('error connecting to mongoose', err);
});

//configuration des vues
app.set('view engine', 'ejs'); //moteur de vue ejs
app.set('views', path.join(__dirname, 'views')); //dossier des vues

//dossier static
app.use(express.static('public'));

//routes
app.use('/', routes);

//lancement du serveur
app.listen(port, ()=>{
    console.log(`Server started on http://localhost:${port}`);
});