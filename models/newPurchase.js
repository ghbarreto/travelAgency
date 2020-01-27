const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
    location: {
        type: String,
    },
    email: {
        type: String,
    },
    price: {
        type: String,
    },
});

const Purchase = mongoose.model('Purchase', PurchaseSchema);

module.exports = Purchase;