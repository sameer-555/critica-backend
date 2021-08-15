const express = require('express')
const {addReview,updateReview,deleteReview,getReviewsByBookId} = require('../controllers/reviewController');

const router = express.Router();

router.post('/review',addReview)
router.put('/review/:id',updateReview)
router.delete('/review/:id',deleteReview)
router.get('/review/:id',getReviewsByBookId)

module.exports = {
    routes:router
}