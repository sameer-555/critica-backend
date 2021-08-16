const express = require('express')
const {getCriticRequest,adminApproveReject} = require('../controllers/AdminController');

const router = express.Router();

router.get('/criticsrequests',getCriticRequest)
router.post('/adminresponse',adminApproveReject)

module.exports = {
    routes:router
}