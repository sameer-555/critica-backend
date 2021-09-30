const express = require('express')
const {addUser} = require('../controllers/userController');
const {homeData} = require('../controllers/homeController');
const {cache} = require("../cache")

const router = express.Router();

router.get('/home',cache(),homeData)

module.exports = {
    routes:router
}