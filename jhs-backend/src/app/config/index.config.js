require('dotenv').config()

// end application configuration constant
module.exports = {
    application_host: process.env.APP_HOST || 'localhost',
    application_port: process.env.APP_PORT || 8000,
};