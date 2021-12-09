var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
});

CustomerSchema
    .virtual('url')
    .get(function() {
        return '/catalog/customer/' + this._id;
    })

module.exports = mongoose.model('Customer', CustomerSchema);