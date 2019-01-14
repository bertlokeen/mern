const express = require('express');
const router = express.Router();
const passport = require('passport');

const ProfileController = require('../../controllers/ProfileController');

router.get('/', passport.authenticate('jwt', {
    session: false
}), ProfileController.profile);

router.get('/all', ProfileController.getProfiles);

router.get('/user/:user_id', ProfileController.getProfileByUserId);

router.get('/handle/:handle', ProfileController.getProfileByHandle);

router.post('/create-profile', passport.authenticate('jwt', {
    session: false
}), ProfileController.validateProfile, ProfileController.createProfile);

router.post('/experience', passport.authenticate('jwt', {
    session: false
}), ProfileController.validateExperience, ProfileController.addExperience);

router.post('/education', passport.authenticate('jwt', {
    session: false
}), ProfileController.validateEducation, ProfileController.addEducation);

router.post('/experience/:exp_id', passport.authenticate('jwt', {
    session: false
}), ProfileController.deleteExperience);

router.post('/education/:edu_id', passport.authenticate('jwt', {
    session: false
}), ProfileController.deleteEducation);

router.post('/delete', passport.authenticate('jwt', {
    session: false
}), ProfileController.deleteUserAndProfile);

module.exports = router;