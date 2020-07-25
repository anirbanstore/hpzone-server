const User = require('./../models/user.model');
const jwt = require('jsonwebtoken');

const client_secret = process.env.hp_zone_server_client_secret;

const authguard = async (req, res, next) => {
    try {
        const authheader = req.header('Authorization');
        if (!authheader || !authheader.startsWith('Bearer ')) {
            return res.status(401).send({ error: 'Cannot authenticate incoming request' });
        }
        const token = authheader.split(' ')[1];
        const decoded = jwt.decode(token, client_secret);

        const user = await User.findOne({ _id: decoded._id, 'Tokens.token': token });
        if (!user) {
            return res.status(401).send({ error: 'Cannot authenticate incoming request' });
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).send({ error: 'Cannot authenticate incoming request' });
    }
};

module.exports = authguard;
