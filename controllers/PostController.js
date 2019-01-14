const Post = require('../models/Post');
const Profile = require('../models/Profile');

exports.validatePost = (req, res, next) => {
    req.checkBody('text', 'Say something first.').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).json(errors);
    }

    next();
};

exports.createPost = (req, res) => {
    const newPost = new Post({
        user: req.user.id,
        text: req.body.text
    });

    newPost.save().then(post => res.json(post)).catch(err => res.status(400).json(err));
};

exports.getPosts = (req, res) => {
    Post.find().sort({
        date: -1
    }).then(posts => {
        if (!posts) {
            return res.json(404).json({
                msg: 'Post not found.'
            });
        }

        return res.json(posts);
    }).catch(err => res.status(404).json(err));
};

exports.viewPost = (req, res) => {
    Post.findById(req.params.id).then(post => {
        if (!post) {
            return res.json(404).json({
                msg: 'Post not found.'
            });
        }

        return res.json(post);
    }).catch(err => res.status(404).json(err));
};

exports.deletePost = (req, res) => {
    Profile.findOne({
        user: req.user.id
    }).then(profile => {
        Post.findById(req.params.id).then(post => {
            if (post.user === req.user.id) {
                return res.status(401).json({
                    msg: 'Unauthorized'
                });
            }

            post.remove().then(() => res.json({
                success: 'true'
            })).catch(err => res.status(404).json(err));

        }).catch(err => res.status(404).json(err));
    }).catch(err => res.status(404).json(err));
};

exports.likePost = (req, res) => {
    Profile.findOne({
        user: req.user.id
    }).then(profile => {
        Post.findById(req.params.id).then(post => {
            if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                res.status(400).json({
                    msg: 'Already liked.'
                });
            }

            post.likes.unshift({
                user: req.user.id
            });

            post.save().then(post => res.json(post)).catch(err => res.status(404).json(err));

        }).catch(err => res.status(404).json(err));
    }).catch(err => res.status(404).json(err));
};

exports.unlikePost = (req, res) => {
    Profile.findOne({
        user: req.user.id
    }).then(profile => {
        Post.findById(req.params.id).then(post => {
            if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                res.status(400).json({
                    msg: 'Please like.'
                });
            }

            const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);

            post.likes.splice(removeIndex, 1);

            post.save().then(post => res.json(post)).catch(err => res.status(404).json(err));

        }).catch(err => res.status(404).json(err));
    }).catch(err => res.status(404).json(err));
};

exports.validateComment = (req, res, next) => {
    req.checkBody('text', 'Say something first.').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).json(errors);
    }

    next();
};

exports.commentPost = (req, res) => {
    Post.findById(req.params.id).then(post => {
        const newComment = {
            user: req.user.id,
            text: req.body.text
        };

        post.comments.unshift(newComment);

        post.save().then(post => res.json(post)).catch(err => res.status(404).json(err));

    }).catch(err => res.status(404).json(err));
};

exports.deleteCommentPost = (req, res) => {
    Post.findById(req.params.id).then(post => {
        if (post.comments.filter(item => item._id.toString() === req.params.comment_id).length === 0) {
            return res.status(400).json({
                msg: 'Comment not found'
            });
        }

        const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id);

        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post)).catch(err => res.status(404).json(err));

    }).catch(err => res.status(404).json(err));
};