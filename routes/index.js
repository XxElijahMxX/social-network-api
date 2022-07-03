const router = require('express');
const apiRoutes = require('./api');

// this makes sure that /api is applied to my api routes
router.use('/api', apiRoutes);
router.use((req, res) => {
    res.status(404).send('<h1>Error!</h1>');
});

module.exports = router;