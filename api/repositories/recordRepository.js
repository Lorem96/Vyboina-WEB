const Repository = require('./generalRepository');
const recordModel = require('../models/record');

class RecordRepository extends Repository {

}

module.exports = new RecordRepository(recordModel);