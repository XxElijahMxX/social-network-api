const {Users, Thoughts} = require('../models');

const thoughtsController = {
    // /route is /api/thoughts
    // get all thoughts
    getAllThoughts(req, res) {
        Thoughts.find({})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbThoughtsData => res.json(dbThoughtsData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    // get one thought with an Id
    getThoughtsById({params}, res) {
        Thoughts.findOne({ _id: params.id })
        .populate({
        path: 'reactions',
        select: '-__v'
    })
    .select('-__v')
    .sort({ _id: -1 })
    .then(dbThoughtsData => {
        if (!dbThoughtsData) {
            res.status(404).json({ meessage: 'There were no thoughts found with this id!'});
            return;
        }
        res.json(dbThoughtsData);
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    });
    },
    createThoughts({body}, res) {
        Thoughts.create(body)
        .then(({ _id }) => {
            return Users.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: _id } },
                { new: true }
            );
        })
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({ message: 'There were no users found with this id!'});
                return;
            }
            res.json(dbThoughtsData);
        })
        .catch(err => res.json(err));
    },

    // update a thought using its Id
    updateThoughts({params, body}, res) {
        Thoughts.findOneAndUpdate({ _id: params.id }, body, {new: true })
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({ message: 'There were no thoughts found with this id!'});
                return;
            }
            res.json(dbThoughtsData);
        })
        .catch(err => res.json(err));
    },

    // delete a thought using its Id
    deleteThoughts({params}, res) {
        Thoughts.findOneAndDelete({ _id: params.id })
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({ message: 'There were no thoughts found with this id!'});
                return;
            }
            return Users.findOneAndUpdate(
                { _id: parmas.userId },
                { $pull: { thoughts: params.Id } },
                { new: true }
            )
        })
        .then(dbUsersData => {
            if (!dbUsersData) {
                res.status(404).json({ message: 'There were no users found with this id!'});
                return;
            }
            res.json(dbUsersData);
        })
        .catch(err => res.json(err));
    },

    createReactions({params, body}, res) {
        Thoughts.findOneAndUpdate(
            {_id: params.thoughtId}, 
            {$push: {reactions: body}}, 
            {new: true}
        )
          .populate({path: 'reactions', select: '-__v'})
          .select('-__v')
          .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({ message: 'There were no reactions found with this id!'});
                return;
            }
            res.json(dbThoughtsData);
          })
          .catch(err => res.status(400).json(err))
    },

    deleteReactions({params}, res) {
        Thoughts.findOneAndUpdate(
            { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
    .then(dbThoughtsData => {
        if (!dbThoughtsData) {
            res.status(404).json({ message: 'There were no reactions found with this id!'});
            return;
        }
        res.json(dbThoughtsData);
    })
    .catch(err => res.json(err));
    }
};

module.exports = thoughtsController;