require('dotenv').config();
const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const app = express();

// 1. init middlewares

app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//2. nit db
require('./dbs/init.mongodb');
// const { checkOverLoad } = require("./helpers/check.connect");
// checkOverLoad();

// 3. init routes
app.use('/', require('./routes'));
//4. handling errors
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    });
});
module.exports = app;
