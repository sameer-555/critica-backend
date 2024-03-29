'use strict'

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config')
const userRoutes = require('./routers/user-router');
const homeRoutes = require("./routers/home-router")
const bookRoutes = require("./routers/book-router")
const reviewRoutes = require("./routers/review-router")
const userBookRoutes = require("./routers/user-book-router")
const authorRoutes = require("./routers/author-router")
const genreRoutes = require("./routers/genre-router")
const adminRoutes = require("./routers/admin-router")
const paymentRoutes = require("./routers/payment-router")

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api',userRoutes.routes);
app.use('/api',homeRoutes.routes);
app.use('/api',bookRoutes.routes);
app.use('/api',reviewRoutes.routes)
app.use('/api',userBookRoutes.routes)
app.use('/api',authorRoutes.routes)
app.use('/api',genreRoutes.routes)
app.use('/api',adminRoutes.routes)
app.use('/api',paymentRoutes.routes)


if (process.env.NODE_ENV !== 'test') {
    app.listen(config.port, () => console.log("app is running on this port",config.port))
}

module.exports = {
    app
}