const mongoose = require('mongoose');

const lookupSchema = mongoose.Schema({
    LookupCode: {
        type: String,
        required: true
    },
    LookupKey: {
        type: String,
        required: true
    },
    LookupValue: {
        type: String,
        required: true
    },
    DisplaySequence: {
        type: Number,
        required: true,
        default: 0
    }
});

lookupSchema.index({
    LookupCode: 1,
    LookupKey: 1
}, {
    unique: true
});

lookupSchema.methods.toJSON = function() {
    const lookup = this.toObject();
    delete lookup._id;
    delete lookup.__v;
    return lookup;
}

const Lookup = mongoose.model('lookup', lookupSchema);

module.exports = Lookup;
