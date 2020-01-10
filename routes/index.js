var express = require('express');
var passport = require('passport');
var router = express.Router();
//controllers
const AuthController = require('../controllers/AuthController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET login page. */
router.get('/login', AuthController.login);
/* POST login page. */
router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), AuthController.login_post);

/* GET register page. */
router.get('/register', AuthController.register);
/* POST login page. */
router.post('/register', require('../validators/validateRegister'), AuthController.register_post);


module.exports = router;
