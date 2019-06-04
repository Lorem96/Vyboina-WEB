var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
const autoIncrement = require('mongoose-auto-increment');

const mongoose = require('mongoose');
const connectUri = "mongodb+srv://lorem:102938abC@vyboina-xzst9.mongodb.net/records?retryWrites=true";

mongoose.connect(connectUri).then(() => {
    console.log('Database connection successful');
}).catch(err => {
    console.error('Database connection error', err);
})

autoIncrement.initialize(mongoose.connection);

var indexRouter = require('./routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    const fileDirectory = path.join(__dirname, "public");

    res.sendFile("index.html", { root: fileDirectory }, err => {
        res.end();
    });
});

app.use(indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
