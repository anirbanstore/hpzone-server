const mongoose = require('mongoose');

const requisitionSchema = mongoose.Schema({
    ReqNumber: {
        type: Number,
        required: true,
        trim: true,
        unique: true
    },
    ConsumerNumber: {
        type: String,
        required: true,
        trim: true
    },
    ReqDate: {
        type: Number,
        required: true,
        trim: true
    },
    DeliveryDate: {
        type: Number,
        trim: true
    },
    RequisitionStatus: {
        type: String,
        required: true,
        trim: true
    },
    OrderNumber: {
        type: Number,
        trim: true
    },
    ReqAmount: {
        type: Number,
        trim: true
    },
    Usage: {
        type: Number,
        trim: true,
        default: 0
    },
    CylinderStatus: {
        type: String,
        trim: true
    },
    ReqCreatedBy: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        default: 'anonymous'
    },
    ReqUpdatedBy: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        default: 'anonymous'
    }
}, {
    timestamps: true
});

requisitionSchema.statics.getUpdatableAttributes = function() {
    return ['ReqNumber', 'ConsumerNumber', 'ReqDate', 'DeliveryDate', 'RequisitionStatus',
            'OrderNumber', 'ReqAmount', 'CylinderStatus'];
};

requisitionSchema.statics.getSearchableAttributes = function() {
	return [
        { attr: 'ReqNumber', type: 'Number' },
        { attr: 'OrderNumber', type: 'Number' },
        { attr: 'ReqStartDate', type: 'Number', range: 'start', alias: 'ReqDate' },
        { attr: 'ReqEndDate', type: 'Number', range: 'end', alias: 'ReqDate' },
		{ attr: 'DelStartDate', type: 'Number', range: 'start', alias: 'DeliveryDate' },
        { attr: 'DelEndDate', type: 'Number', range: 'end', alias: 'DeliveryDate' },
        { attr: 'RequisitionStatus', type: 'String' },
        { attr: 'CylinderStatus', type: 'String' }
    ];
}

requisitionSchema.methods.toJSON = function() {
    const requisition = this.toObject();
    delete requisition._id;
    delete requisition.__v;
    return requisition;
};

const Requisition = mongoose.model('requisition', requisitionSchema);

module.exports = Requisition;
