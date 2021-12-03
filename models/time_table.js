var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TimeTableSchema = new Schema({
    table: { type: Schema.Types.ObjectId, ref: 'Table', required: true },
    status: { type: String, required: true, enum: ['Available', 'Maintenance', 'Reserved', 'Taken'], default: 'Maintenance' },

});

TimeTableSchema
    .virtual('url')
    .get(function() {
        return '/catalog/time_table/' + this._id;
    });

//Export model
module.exports = mongoose.model('TimeTable', TimeTableSchema);