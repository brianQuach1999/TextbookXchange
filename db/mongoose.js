'use strict';
const mongoose = require('mongoose')

// connect to our database
//user and password for mongo account is admin and admin 
const mongoURI = "mongodb+srv://admin:admin@cluster0-tntrx.mongodb.net/test?retryWrites=true"
//const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/TextbookAPI'

mongoose.connect(mongoURI, { useNewUrlParser: true, useCreateIndex: true});

module.exports = { mongoose }