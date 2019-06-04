
const Service = require('./generalService');
const recordRepository = require("../repositories/recordRepository");

class RecordService extends Service {

    getShortRecordsInfo() {
        return recordRepository.findAll().then(records => {
            return records.map(record => {
                return {
                    id: record._id,
                    created: record.created
                };
            });
        });
    }
}

module.exports = new RecordService(recordRepository);