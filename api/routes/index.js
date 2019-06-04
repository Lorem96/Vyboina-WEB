const express = require('express');
const router = express.Router();
const record = require('./recordRoutes')
const path = require('path');

router.use("/api/record", record);

module.exports = router;
