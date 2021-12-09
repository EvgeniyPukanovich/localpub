var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TableSchema = new Schema({
    number: { type: Number, required: true },
    capacity: { type: Number, required: true },
    waiter: { type: Schema.Types.ObjectId, ref: 'Waiter', required: true },
    location: { type: String },
});

TableSchema
    .virtual('url')
    .get(function() {
        return '/catalog/table/' + this._id;
    });

//Export model
module.exports = mongoose.model('Table', TableSchema);