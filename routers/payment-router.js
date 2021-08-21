const express = require('express')
const {authenticateToken} = require('../controllers/userController')
const {payment} = require('../controllers/PaymentController')

const router = express.Router();


router.get('/payment',payment)