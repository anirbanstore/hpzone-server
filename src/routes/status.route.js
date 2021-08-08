const router = require('express').Router();
const Lookup = require('./../models/lookup.model');
const authguard = require('./../middlewares/guard.mw');

router.post('', authguard, async (req, res) => {
    const newLookup = new Lookup(req.body);
    try {
        await newLookup.save();
        return res.status(201).send(newLookup);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('', authguard, async (req, res) => {
    try {
        const statuses = await Lookup.find();
        return res.status(200).send(statuses);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;