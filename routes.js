//imports
const express = require('express');
const router = express.Router();
const indexController = require('./controllers/indexController');
const gameController = require('./controllers/gameController');
const registerController = require('./controllers/registerController');
const loginController = require('./controllers/loginController');
const logoutController = require('./controllers/logoutController');
const usersController = require('./controllers/usersController');
const rankingController = require('./controllers/rankingController');
const teamController = require('./controllers/teamController')
const isAdmin = require('./middlewares/isAdmin');

//index
router.get('/', indexController.getIndex);

//game
router.get('/jouer', gameController.getGame);
router.post('/jouer', gameController.postGame);

//reset
router.get('/reset', gameController.getReset);

//register
router.get('/inscription', registerController.getRegister);
router.post('/inscription', registerController.postRegister);

//login
router.get('/connexion', loginController.getLogin);
router.post('/connexion', loginController.postLogin);

//logout
router.get('/deconnexion', logoutController.getLogout);

//users
router.get('/admin/utilisateurs', isAdmin, usersController.getUsers);

//ranking
router.get('/classement', rankingController.getRanking);

//team
router.get('/equipe', teamController.getTeam)

module.exports = router;