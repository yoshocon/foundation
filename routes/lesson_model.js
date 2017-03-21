var mongoose = require('mongoose');
var schema = mongoose.Schema;
var foundationSchema = new mongoose.Schema
({
  user: String,
  lessonID: String,
  name: String,
  count: String,
  building: String,
  floor: String,
  lessonClass: String,
  time: String,
  millionSecond: String,
  period: String,
  people: String,
  note: String,
  aim: String,
  createTime: String,
  modifyTime: String,
  checkSituation: String
});
module.exports = mongoose.model('lessons', foundationSchema);
