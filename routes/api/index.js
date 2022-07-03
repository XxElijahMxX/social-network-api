const router = require('express').Router();
const usersRoutes = require('./users');
const thoughtsRoutes = require('./thoughts');

// routes for users
router.use('/users', usersRoutes);
// routes for thoughts
router.use('/thoughts', thoughtsRoutes);

module.exports = router;