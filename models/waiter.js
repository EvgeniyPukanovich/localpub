var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var WaiterSchema = new Schema(
  {
    first_name: {type: String, required: true, maxLength: 100},
    last_name: {type: String, required: true, maxLength: 100},
    date_of_birth: {type: Date},
  }
);

// Virtual for author's full name
WaiterSchema
.virtual('name')
.get(function () {
  return this.first_name + ', ' + this.last_name;
});

// Virtual for waiter's URL
WaiterSchema
.virtual('url')
.get(function () {
  return '/catalog/waiter/' + this._id;
});

//Export model
module.exports = mongoose.model('Waiter', WaiterSchema);