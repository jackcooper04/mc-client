//Import Packages
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

//Initalise Packages
const app = express();
dotenv.config();

//Import Routes
const serverRoutes = require('./routes/server');

//Initalise Web Server
//app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Setup CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With, Content-Type,Accept,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS,PUT"
  );
  next();
});

//Initalise Routes
app.use("/api/server",serverRoutes);

//200 Request
app.get("/",(req,res,next) => {
  res.sendStatus(200);
});

//Export Server
module.exports = app;
