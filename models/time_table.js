var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TimeTableSchema = new Schema({
    table: { type: Schema.Types.ObjectId, ref: 'Table', required: true },
    _12: { type: String, required: true, enum: ['Available', 'Maintenance', 'Reserved', 'Taken'], default: 'Maintenance' },
    _14: { type: String, required: true, enum: ['Available', 'Maintenance', 'Reserved', 'Taken'], default: 'Maintenance' },
    _16: { type: String, required: true, enum: ['Available', 'Maintenance', 'Reserved', 'Taken'], default: 'Maintenance' },
    _18: { type: String, required: true, enum: ['Available', 'Maintenance', 'Reserved', 'Taken'], default: 'Maintenance' },
    _20: { type: String, required: true, enum: ['Available', 'Maintenance', 'Reserved', 'Taken'], default: 'Maintenance' },
    _22: { type: String, required: true, enum: ['Available', 'Maintenance', 'Reserved', 'Taken'], default: 'Maintenance' },
});

TimeTableSchema
    .virtual('url')
    .get(function() {
        return '/catalog/time_table/' + this._id;
    });

//Export model
module.exports = mongoose.model('TimeTable', TimeTableSchema);