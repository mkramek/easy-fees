const express = require('express');
const app = express();
const authRouter = require('./auth');
const orderRouter = require('./order');
const itemRouter = require('./item');

/* GET home page. */
app.use('/', function (req, res, next) {
    res.status(200).send({
        error: false,
        message: 'EasyFees API'
    });
});

app.use('/auth', authRouter);
app.use('/order', orderRouter);
app.use('/item', itemRouter);

module.exports = app;
