const mongoose = require('mongoose');
require('dotenv').config();

let connectionURL = '';
const app_environment = process.env.app_environment;

if (app_environment === 'dev') {
    connectionURL = process.env.mongodb_local_connection_url;
} else if (app_environment === 'prod') {
    connectionURL = process.env.mongodb_atlas_connection_url;
}

mongoose
.connect(connectionURL, {
    autoIndex: true,
    autoCreate: true,
})
.catch((err) => console.error('Failed to connect to mongodb', err));

module.exports = mongoose;
