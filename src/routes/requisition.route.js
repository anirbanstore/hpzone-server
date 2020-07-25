const router = require('express').Router();
const Requisition = require('./../models/requisition.model');
const authguard = require('./../middlewares/guard.mw');

router.get('', authguard, async (req, res) => {
	const payload = {
		ConsumerNumber: req.user.ConsumerNumber
	};
    try {
		const filter = req.query.filter;
		if (!!filter) {
			const searchableAttributes = Requisition.getSearchableAttributes();
			const filterAttributes = filter.split(';');
			const filterObject = [];
			filterAttributes.forEach(each => {
				filterObject.push({
					attr: each.split(':')[0],
					value: each.split(':')[1]
				});
			});
			filterObject.forEach(attribute => {
				const { attr, type, range, alias } = searchableAttributes.find(searchableAttribute => searchableAttribute.attr === attribute.attr);
				if (!!attr && !!type) {
					if (type === 'Number') {
						if (!!range) {
							if (range === 'start') {
								const value = payload[alias || attr];
								if (!value) {
									payload[alias || attr] = { $gte: +(attribute.value) };
								} else {
									payload[alias || attr] = { ...value, $gte: +(attribute.value) }
								}
							} else {
								const value = payload[alias || attr];
								if (!value) {
									payload[alias || attr] = { $lte: +(attribute.value) };
								} else {
									payload[alias || attr] = { ...value, $lte: +(attribute.value) }
								}
							}
						} else {
							payload[attr] = +(attribute.value);
						}
					} else {
						payload[attr] = { $regex: attribute.value, $options: 'i' };
					}
				}
			});
		}
		const requisitions = await Requisition.find(payload).limit(10).sort({ ReqDate: -1 });
        return res.status(200).send(requisitions);
    } catch(error) {
        res.status(500).send({ error: error.message });
    }
});

router.post('', authguard, async(req, res) => {
    try {
        const newRequisition = new Requisition(req.body);
		newRequisition.ConsumerNumber = req.user.ConsumerNumber;
        newRequisition.ReqCreatedBy = req.user.Username;
        newRequisition.ReqUpdatedBy = req.user.Username;
        await newRequisition.save();
        res.status(201).send(newRequisition);
    } catch(error) {
        res.status(500).send({ error: error.message });
    }
});

router.patch('/:id', authguard, async (req, res) => {
    const payload = req.body;
    const attributesInPayload = Object.keys(payload);
    const updatableAttributes = Requisition.getUpdatableAttributes();

    
    const isValidOperation = attributesInPayload.every(each => updatableAttributes.includes(each));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Attempting to update restricted or non-existent attributes'});
    }
    const ReqNumber = parseInt(req.params.id);
    try {
        const requisition = await Requisition.findOne({ ReqNumber });
        if (!requisition) {
            return res.status(404).send();
        }
        const oldCylinderStatus = requisition.CylinderStatus;
        const newCylinderStatus = payload.CylinderStatus;

        attributesInPayload.forEach(attribute => requisition[attribute] = payload[attribute]);
        requisition.ReqUpdatedBy = req.user.Username;

        if (oldCylinderStatus === 'HP_INUSE' && newCylinderStatus === 'HP_EMPTY') {
            const oldUpdatedAt = requisition.updatedAt;
            const newUpdatedAt = (new Date()).getTime();
            const Usage = +(((newUpdatedAt - oldUpdatedAt) / ((24 * 60 * 60 * 1000))).toFixed(0));
            requisition.Usage = Usage;
        }

        await requisition.save();
        res.status(200).send(requisition);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
