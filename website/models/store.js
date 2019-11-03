const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
    location: {
        type: String,
    },
    img: {
        type: String,
    },
    price: {
        type: Number,
    },
});

const Store = mongoose.model('Store', StoreSchema);

module.exports = Store;