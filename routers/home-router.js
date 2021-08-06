const express = require('express')
const {addUser} = require('../controllers/userController');
const {homeData} = require('../controllers/homeController');

const router = express.Router();

router.get('/home',homeData)

module.exports = {
    routes:router
}