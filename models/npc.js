var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var npcSchema = new Schema(
  {
    name: {type: String, required: true, maxLength: 100},
    desc: {type: String, required: true},
    category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
    loc: {type: String, required: true, maxLength: 100},
    quote: {type: String, required: false, maxLength: 280},
    notes: {type: String, required: false, maxLength: 280},
    image: {type: String, required: false}
  }
);

// Virtual for npc's URL
npcSchema
.virtual('url')
.get(function () {
  return '/npc/' + this._id;
});

//Export model
module.exports = mongoose.model('NPC', npcSchema);