class Service {
    constructor(repository) {
        this.repository = repository;
    }

    create(data) {
        return this.repository.create(data);
    }

    findAll() {
        return this.repository.findAll();
    }

    findByOptions(options) {
        return this.repository.findByOptions(options);
    }

    findById(id) {
        return this.repository.findById(id);
    }

    updateById(id, data) {
        return this.repository.updateById(id, data);
    }

    deleteById(id) {
        return this.repository.deleteById(id);
    }
}

module.exports = Service;