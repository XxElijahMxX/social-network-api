const {Users, Thoughts} = require('../models');

const usersController = {
    //get all userss
    // route is /api/users
    getAllUsers(req, res) {
        Users.find({})
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbUsersData => res.json(dbUsersData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    // gets one user with id
    getUsersById({params}, res) {
        Users.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .then(dbUsersData => {
            if (!dbUsersData) {
                res.status(404).json({ message: 'There were no users found with this id!'});
                return;
            }
            res.json(dbUsersData);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    // POST(create a user)
    createUsers({body}, res) {
        Users.create(body)
        .then(dbUsersData => res.json(dbUsersData))
        .catch(err => res.json(err));
    },

    // PUT(update user with specific Id)
    updateUsers({params, body}, res) {
        Users.findOneAndUpdate({ _id: params.id }, body, {new: true })
        .then(dbUsersData => {
            if (!dbUsersData) {
                res.status(404).json({ message: 'There were no users found with this id!'});
                return;
            }
            res.json(dbUsersData);
        })
        .catch(err => res.json(err));
    },

    // DELETE a user and their thoughts
    deleteUsers({params}, res) {
        Thoughts.deleteMany({ userId: params.id })
        .then(() => {
            Users.findOneAndDelete({ userId: params.id })
        .then(dbUsersData => {
            if (!dbUsersData) {
                res.status(404).json({ message: 'There were no users found with this id!'});
                return;
            }
            res.json(dbUsersData);
        });
      })
      .catch(err => res.json(err));
    },

    // the route is /api/users/:userid/friends/:friendId
    addFriend({params}, res) {
        Users.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId } },
            { new: true }
        )
        .then((dbUsersData) => {
            if (!dbUsersData) {
                res.status(404).json({ message: 'There were no users find with this id!'});
                return;
            }
            res.json(dbUsersData)
        })
        .catch((err) => res.status(400).json(err));
    },

    deleteFriend({params}, res) {
        Users.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
        .then((dbUsersData) => {
          if (!dbUsersData) {
            res.status(404).json({ message: 'There were no users found with this id!'});
            return;
          }
          res.json(dbUsersData);
        })
        .catch((err) => res.status(400).json(err));
    }
};

module.exports = usersController