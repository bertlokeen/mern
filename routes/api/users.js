const express = require('express');
const router = express.Router();
const passport = require('passport');

const UserController = require('../../controllers/UserController');

router.post('/register', UserController.validateRegister, UserController.register);

router.post('/login', UserController.login);

router.get('/user', passport.authenticate('jwt', {
    session: false
}), UserController.getUser);

module.exports = router;