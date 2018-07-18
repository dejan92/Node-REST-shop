const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//importing route modules
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

//connecting to mongo atlas
mongoose.connect("mongodb+srv://dejan:" +
    process.env.MONGO_ATLAS_PW +
    "@node-rest-shop-uogui.mongodb.net/test?retryWrites=true"
    // , {
    //     useMongoClient: true
    // }
);
//setting up middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE ,GET');
        return res.status(200).json({});
    }
    next();
});

//setting up routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

//handling errors
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

//handling all other errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;