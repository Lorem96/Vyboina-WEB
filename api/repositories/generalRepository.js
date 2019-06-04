class Repository {
    constructor(model) {
        this.model = model;
    }

    create(data) {
        const newRecord = new this.model(data);

        return newRecord.save().then(savedData => savedData)
            .catch(e => console.log(e));
    }

    findAll() {
        return this.model.find();
    }

    findByOptions(options) {
        return this.model.find(options);
    }

    findById(id) {
        return this.model.find({ '_id': id });
    }
}

module.exports = Repository;