const express = require('express');
const router = express.Router();

// @route   GET api/users/test
// @desc    TEST users route
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: 'Test'
}));

module.exports = router;