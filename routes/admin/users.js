const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../../middlewares/ensureLoggedIn');
//controllers
const UsersController = require('../../controllers/admin/UsersController');

//employee activate
router.get(
    '/users',
    require('connect-ensure-login').ensureLoggedIn(),
    UsersController.index
);


module.exports = router;
