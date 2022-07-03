const router = require('express').Router();

const {
    getAllThoughts,
    getThoughtsById,
    createThoughts,
    updateThoughts,
    deleteThoughts,
    createReactions,
    deleteReactions
} = require('../../controllers/thoughts');

router
.route('/')
.get(getAllThoughts)
.post(createThoughts);

router
.route('/:id')
.get(getThoughtsById)
.put(updateThoughts)
.delete(deleteThoughts);

router
.route('/:thoughtId/reactions')
.post(createReactions);

router
.route('/:thoughtId/reactions/:reactionId')
.delete(deleteReactions);

module.exports = router;