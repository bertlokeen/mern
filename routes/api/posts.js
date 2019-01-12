const express = require('express');
const router = express.Router();

// @route   GET api/posts/test
// @desc    TEST posts route
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: 'Test'
}));

module.exports = router;