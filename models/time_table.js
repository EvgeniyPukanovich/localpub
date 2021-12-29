var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TimeTableSchema = new Schema({
    table: { type: Schema.Types.ObjectId, ref: 'Table', required: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    reservation_date_from: { type: Date, required: true },
    reservation_date_to: { type: Date, required: true },
    code: { type: Number },
    expireAt: { type: Date }
});

TimeTableSchema.index({ "expireAt": 1 }, { expireAfterSeconds: 0 });

//Export model
module.exports = mongoose.model('TimeTable', TimeTableSchema);