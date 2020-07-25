const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const client_secret = process.env.hp_zone_server_client_secret;
const client_password_hash_cycle = process.client_password_hash_cycle || 8;
const MIN_PASSWORD_HASH_CYCLE = 8;

const userSchema = mongoose.Schema({
    Username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    Password: {
        type: String,
        required: true,
        minlength: 8
    },
    ConsumerNumber: {
        type: String,
        required: true,
        trim: true,
        maxLength: [2, 'Consumer number can be of maximum 6 characters']
    },
    Tokens: [
        {
            token: {
                type: String,
                required: true,
                trim: true
            }
        }
    ]
});

userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user._id;
    delete user.__v;
    delete user.Password;
    delete user.Tokens;
    return user;
};

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = await jwt.sign({ _id: user._id.toString() }, client_secret);
    user.Tokens = user.Tokens.concat({ token });
    await user.save();
    return token;
};

userSchema.statics.authenticate = async function(Username, Password) {
    const user = await User.findOne({ Username });
    if (!user) {
        throw new Error('Failed to authenticate HP-Zone system');
    }
    const match = await bcrypt.compare(Password, user.Password);
    if (!match) {
        throw new Error('Failed to authenticate HP-Zone system');
    }
    return user;
};

userSchema.pre('save', async function(next) {
    const user = this;
    let password_hash_cycle = client_password_hash_cycle;
    if (password_hash_cycle < MIN_PASSWORD_HASH_CYCLE) {
        password_hash_cycle = MIN_PASSWORD_HASH_CYCLE;
    }
    if(user.isModified('Password')) {
        user.Password = await bcrypt.hash(user.Password, password_hash_cycle);
    }
    next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;
