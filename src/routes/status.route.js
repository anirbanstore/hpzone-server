const router = require('express').Router();
const Lookup = require('./../models/lookup.model');
const authguard = require('./../middlewares/guard.mw');

router.get('', authguard, async (req, res) => {
    try {
        const statuses = await Lookup.find();
        return res.status(200).send(statuses);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;