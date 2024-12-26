const mongoose = require('mongoose');

const DBConn = {
    connURL: process.env.DB_CONNECTION_URL,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    db: null,
    async init() {
        mongoose.set("strictQuery", false);
        this.db = await mongoose.connect(this.connURL + ':' + this.port + '/' + this.database);
        if (!this.db) {
            console.log('Database connected Fail!');
        } // end if
    },
};

module.exports = DBConn;
