const mongoose = require("mongoose");
const autoIncrement = require('mongoose-auto-increment');

const recordSchema = new mongoose.Schema({ created: String, data: String, uploaded: Boolean });

recordSchema.plugin(autoIncrement.plugin, 'recordSchema');

module.exports = mongoose.model('record', recordSchema)