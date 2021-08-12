const express = require('express')
const {updateUserBookDetails} = require('../controllers/userBookController');

const router = express.Router();

router.put('/update/userbookdetails',updateUserBookDetails)

module.exports = {
    routes:router
}