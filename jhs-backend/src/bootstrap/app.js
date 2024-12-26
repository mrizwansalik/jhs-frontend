const path = require('path');
const fileUpload = require('express-fileupload');

/**
 * Please do not change its position
 */
require('dotenv').config({ path: path.join(process.cwd(), `.env.${process.env.NODE_ENV}`) });

const http = require('http');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('../routes/index.routes'); 
const DBConn = require('./database');
const { Response } = require('../framework');
const { getSocket } = require('../socket/index.socket');

class Application {

  constructor() {
    this.port = process.env.APP_PORT;
    this.url = process.env.APP_HOST;
  } // end function constructor

  initiateApp() {
    this.app = express();
    this.server = http.createServer(this.app);
  } // end function initiateApp

  appConfigurations() {
    // parse application/x-www-form-urlencoded
    this.app.use(bodyParser.urlencoded({ extended: true }));
    // parse application/json
    this.app.use(bodyParser.json());

    this.app.use("/public",express.static(path.join(__dirname, '../../public')));

    // set file upload limit
    // this.app.use(
    //   fileUpload({
    //     limits: {
    //       fileSize: 10000000,
    //     },
    //     abortOnLimit: true,
    //   })
    // );
  } // end function appConfigurations

  globalMiddleware() {
    this.app.use(cors());
  } // end global middleware

  registerRoutes() {
    this.app.use(routes);
  } // end function register routes

  globalErrorHandler() {
    // this.app.use(errorHandler);
    this.app.all('*', (req, res) => {
      res.status(404).json(
        Response.notFound({ message: `Sorry! Couldn't find ${req.originalUrl} on the server!` })
      );
    });
  } // end function global error handler

  async connectDatabase() {
    await DBConn.init();
  } // end function connect database

  async initiateSocket() {
    getSocket(this);
  } // end function initiate socket

  runServer() {
    this.webSocketServer = this.server.listen(this.port, () => {
      //console.log(`Server listening at ${this.url}:${this.port}`);
    });
  } // end function run server

  start() {
    this.initiateApp();
    this.appConfigurations();
    this.globalMiddleware();
    this.registerRoutes();
    this.globalErrorHandler();
    this.connectDatabase();
    this.runServer();
    this.initiateSocket();
  } // end function start
} // end class application

// create Application Object
module.exports = new Application();
