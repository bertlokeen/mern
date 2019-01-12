const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

exports.validateRegister = (req, res, next) => {
    req.sanitize('name');
    req.checkBody('name', 'Name is required.').notEmpty();
    req.checkBody('email', 'Email is must be valid.').isEmail();
    req.checkBody('email', 'Email is required.').notEmpty();
    req.checkBody('password', 'Password is required.').notEmpty();
    req.checkBody('password-confirm', 'Confirmed Password is required').notEmpty();
    req.checkBody('password-confirm', 'Passwords do not match.').equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).json(errors);
    }

    next();
};

exports.register = (req, res) => {
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (user) {
            errors.email = 'Email already exist';
            return res.status(400).json(errors);
        } else {
            avatar = gravatar.url(req.body.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save().then(user => res.json(user)).catch(err => console.log(err));
                })
            })
        }
    });
}

exports.login = (req, res) => {
    const {
        errors,
        isValid
    } = validateLoginInput(req.body);


    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        email
    }).then(user => {
        if (!user) {
            errors.email = 'User not found.';
            return res.status(400).json(errors);
        }

        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const payload = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                };

                jwt.sign(payload, process.env.SECRET, {
                    expiresIn: 36000
                }, (err, token) => {
                    res.json({
                        success: true,
                        token: `Bearer ${token}`
                    });
                });
            } else {
                errors.password = 'Password incorrect.';
                return res.status(400).json(errors);
            }
        });
    });
}

exports.getUser = (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
}