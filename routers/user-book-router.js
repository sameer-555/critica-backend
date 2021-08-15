const express = require('express')
const {updateUserBookDetails,getUserReadBooks} = require('../controllers/userBookController');

const router = express.Router();

router.put('/userbook/userbookdetails',updateUserBookDetails)
router.get('/userbook/getbooks/:id',getUserReadBooks)

module.exports = {
    routes:router
}