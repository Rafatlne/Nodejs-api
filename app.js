const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect('mongodb://node-aaroza:'+
    process.env.MONGO_ATLAS_PW+
    '@node-aaroza-shard-00-00-mkjpe.mongodb.net:27017,node-aaroza-shard-00-01-mkjpe.mongodb.net:27017,node-aaroza-shard-00-02-mkjpe.mongodb.net:27017/test?ssl=true&replicaSet=node-aaroza-shard-0&authSource=admin&retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true 
    });

mongoose.Promise = global.Promise;
    
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/uploads/',express.static('uploads'));
// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requsted-With, Content-Type, Accept, Authorization");

    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET,PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }

    next();
});

// Routes which should handle request
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Error Handling 
app.use((req, res, next) =>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message : error.message
        }
    });
});

module.exports = app;