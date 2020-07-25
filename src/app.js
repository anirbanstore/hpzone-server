const express = require('express');
const app = express();

const userRoutes = require('./routes/user.route');
const statusRoutes = require('./routes/status.route');
const reqRoutes = require('./routes/requisition.route');

const base_path = process.env.hp_zone_server_base_path;

const allowedOrigins = ['http://localhost:4200', 'https://anirbanstore.github.io'];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, accept-language');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
	next();
});

app.use(express.json());

app.use(base_path + 'user', userRoutes);
app.use(base_path + 'status', statusRoutes);
app.use(base_path + 'requisition', reqRoutes);

module.exports = app;
