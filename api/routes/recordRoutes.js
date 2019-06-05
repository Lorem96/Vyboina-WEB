const express = require('express');
const record = express.Router();
const recordService = require('../services/record');

record.route('/')
    .get((req, res) => {
        recordService.findAll()
            .then(records => {
                res.send(records);
            })
            .catch((err) => {
                res.status(404).send(err);
            });
    })
    .post((req, res) => {
        recordService.create(req.body)
            .then(record => {
                res.send(record);
            })
            .catch((err) => {
                res.status(500).send(err);
            });
    });

record.route('/shortInfoAll')
    .get((req, res) => {
        recordService.getShortRecordsInfo()
            .then(records => {
                res.send(records);
            })
            .catch((err) => {
                res.status(404).send(err);
            });
    })

record.route('/:id').get((req, res) => {
    recordService
        .findById(req.params.id)
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            res.status(404).send(err.message);
        });
})

module.exports = record;
