const express = require('express')
const {addReview,updateReview,deleteReview} = require('../controllers/reviewController');

const router = express.Router();

router.post('/review',addReview)
router.put('/review/:id',updateReview)
router.delete('/review/:id',deleteReview)

module.exports = {
    routes:router
}