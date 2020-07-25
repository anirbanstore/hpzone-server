const router = require('express').Router();
const User = require('./../models/user.model');
const authguard = require('./../middlewares/guard.mw');

router.post('', async (req, res) => {
    const newUser = new User(req.body);
    try {
        await newUser.save();
        return res.status(201).send(newUser);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.authenticate(req.body.Username, req.body.Password);
        const token = await user.generateAuthToken();
        return res.status(200).send({ auth: true, user, token });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/logout', authguard, async (req, res) => {
    try {
        const user = req.user;
        const token = req.token;
        user.Tokens = user.Tokens.filter(eachToken => eachToken.token !== token);
        await user.save();
        return res.status(200).send({ auth: false });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/logoutall', authguard, async (req, res) => {
    try {
        const user = req.user;
        user.Tokens = [];
        await user.save();
        return res.status(200).send({ auth: false });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;