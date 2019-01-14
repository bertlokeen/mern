const express = require('express');
const router = express.Router();
const passport = require('passport');

const PostController = require('../../controllers/PostController');

router.post('/create-post', passport.authenticate('jwt', {
    session: false
}), PostController.validatePost, PostController.createPost);

router.get('/', PostController.getPosts);

router.get('/:id', PostController.viewPost);

router.delete('/:id/delete', passport.authenticate('jwt', {
    session: false
}), PostController.deletePost);

router.post('/:id/like', passport.authenticate('jwt', {
    session: false
}), PostController.likePost);

router.post('/:id/unlike', passport.authenticate('jwt', {
    session: false
}), PostController.unlikePost);

router.post('/:id/comment', passport.authenticate('jwt', {
    session: false
}), PostController.validateComment, PostController.commentPost);

router.post('/:id/comment/:comment_id/delete', passport.authenticate('jwt', {
    session: false
}), PostController.deleteCommentPost);

module.exports = router;