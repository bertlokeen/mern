const Profile = require('../models/Profile');
const User = require('../models/User');

exports.profile = (req, res) => {
    const errors = {};

    Profile.findOne({
        user: req.user.id
    }).populate('user', ['name', 'avatar']).then(profile => {
        errors.noprofile = 'Profile not found';
        if (!profile) {
            return res.status(404).json(errors)
        }
        res.json(profile)
    }).catch(err => res.status(404).json(err));
};

exports.validateProfile = (req, res, next) => {
    req.checkBody('handle', 'Handle is required').notEmpty();
    req.checkBody('status', 'status is required').notEmpty();
    req.checkBody('skills', 'Skills are required').notEmpty();
    req.checkBody('website', 'Not a valid URL').isURL();
    req.checkBody('youtube', 'Not a valid URL').isURL();
    req.checkBody('facebook', 'Not a valid URL').isURL();
    req.checkBody('twitter', 'Not a valid URL').isURL();
    req.checkBody('instagram', 'Not a valid URL').isURL();
    req.checkBody('linkedin', 'Not a valid URL').isURL();

    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).json(errors);
    }

    next();
};

exports.createProfile = (req, res) => {
    const errors = {};

    const profileFields = {
        user: req.user.id,
        handle: req.body.handle,
        company: req.body.company,
        website: req.body.website,
        location: req.body.location,
        bio: req.body.bio,
        status: req.body.status,
        github: req.body.github,
        skills: req.body.skills.split(','),
        social: {
            youtube: req.body.youtube,
            facebook: req.body.facebook,
            twitter: req.body.twitter,
            linkedin: req.body.linkedin,
            instagram: req.body.instagram
        }
    };

    Profile.findOne({
        user: req.user.id
    }).then(profile => {
        if (profile) {
            Profile.findOneAndUpdate({
                user: req.user.id
            }, {
                $set: profileFields
            }, {
                new: true
            }).then(profile => res.json(profile)).catch(err => res.status(400).json(err));
        } else {
            Profile.findOne({
                handle: req.body.handle
            }).then(profile => {
                if (profile) {
                    errors.handle = 'User profile already exist.';
                    res.status(400).json(errors);
                }

                new Profile(profileFields).save().then(profile => res.json(profile)).catch(err => res.status(400).json(err));
            });
        }
    }).catch(err => res.status(400).json(err));
};

exports.getProfileByHandle = (req, res) => {
    const errors = {};

    Profile.findOne({
        handle: req.params.handle
    }).then(profile => {
        if (!profile) {
            errors.noprofile = 'Profile not found.';
            res.status(404).json(errors);
        }

        res.json(profile);
    }).catch(err => res.status(404).json(err));
};

exports.getProfileByUserId = (req, res) => {
    const errors = {};

    Profile.findOne({
        user: req.params.user_id
    }).then(profile => {
        if (!profile) {
            errors.noprofile = 'Profile not found.';
            res.status(404).json(errors);
        }

        res.json(profile);
    }).catch(err => res.status(404).json(errors));
};

exports.getProfiles = (req, res) => {
    const errors = {};

    Profile.find().populate('user', ['name', 'avatar']).then(profiles => {
        if (!profiles) {
            errors.noprofile = 'No Profiles found';
            res.status(404).json(errors);
        }

        res.json(profiles);
    }).catch(err => res.json(404).json(errors));
};

exports.validateExperience = (req, res, next) => {
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('company', 'Company is required').notEmpty();
    req.checkBody('location', 'Location is required').notEmpty();
    req.checkBody('from', 'From is required').notEmpty();
    req.checkBody('description', 'Description is required.').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).json(errors);
    }

    next();
};

exports.addExperience = (req, res) => {
    Profile.findOne({
        user: req.user.id
    }).then(profile => {
        const newExperience = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        };

        profile.experience.unshift(newExperience);

        profile.save().then(profile => res.json(profile));
    });
};

exports.validateEducation = (req, res, next) => {
    req.checkBody('school', 'School is required').notEmpty();
    req.checkBody('degree', 'Degree is required').notEmpty();
    req.checkBody('fieldofstudy', 'Field of study is required').notEmpty();
    req.checkBody('from', 'From is required').notEmpty();
    req.checkBody('description', 'Description is required.').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).json(errors);
    }

    next();
};

exports.addEducation = (req, res) => {
    Profile.findOne({
        user: req.user.id
    }).then(profile => {
        const newEducation = {
            school: req.body.school,
            degree: req.body.degree,
            fieldofstudy: req.body.fieldofstudy,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        };

        profile.education.unshift(newEducation);

        profile.save().then(profile => res.json(profile));
    });
};

exports.deleteExperience = (req, res) => {
    Profile.findOne({
        user: req.user.id
    }).then(profile => {
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        profile.save().then(profile => res.json(profile)).catch(err => res.status(404).json(err));
    }).catch(err => res.status(404).json(err));
};

exports.deleteEducation = (req, res) => {
    Profile.findOne({
        user: req.user.id
    }).then(profile => {
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);

        profile.save().then(profile => res.json(profile)).catch(err => res.status(404).json(err));
    }).catch(err => res.status(404).json(err));
};

exports.deleteUserAndProfile = (req, res) => {
    Profile.findOneAndRemove({
        user: req.user.id
    }).then(() => {
        User.findOneAndRemove({
            _id: req.user.id
        }).then(() => {
            res.json({
                success: true
            });
        }).catch(err => res.status(404).json(err));
    }).catch(err => res.status(404).json(err));;
};