var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var catSchema = new Schema(
  {
    name: {type: String, required: true, maxLength: 100}
  }
);

// Virtual for npc's URL
catSchema
.virtual('url')
.get(function () {
  return '/cat/' + this._id;
});

//Export model
module.exports = mongoose.model('cat', catSchema);