require('dotenv').config()

// export database configuration
module.exports = {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: process.env.DB_PORT || '27017',
    DB: process.env.DB_DATABASE || 'jhc',
};