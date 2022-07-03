const {Schema, model} = require('mongoose');
const moment = require('moment');

const UsersSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/]
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thoughts'
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Users'
        }
    ]
},
{
    toJSON: {
        virtuals: true
    },
    id: false
   }
);

UsersSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

// this will create the USers model using the params of the UsersSchema
const Users = model('Users', UsersSchema);

module.exports = Users;