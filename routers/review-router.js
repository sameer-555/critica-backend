const express = require('express')
const {addReview,updateReview} = require('../controllers/reviewController');

const router = express.Router();

router.post('/review',addReview)
router.put('/review/:id',updateReview)

module.exports = {
    routes:router
}