const express = require('express')
const {addReview,updateReview,deleteReview,getReviewsByBookId,likeComment} = require('../controllers/reviewController');

const router = express.Router();

router.post('/review',addReview)
router.put('/review/:id',updateReview)
router.delete('/review/:id',deleteReview)
router.get('/review/:id',getReviewsByBookId)
router.put('/reviewlike',likeComment)

module.exports = {
    routes:router
}