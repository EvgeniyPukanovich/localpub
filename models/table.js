var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TableSchema = new Schema({
    number: { type: Number, required: true },
});

//Export model
module.exports = mongoose.model('Table', TableSchema);