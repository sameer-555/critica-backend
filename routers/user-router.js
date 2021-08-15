const express = require('express')
const {addUser,updateUser} = require('../controllers/userController');

const router = express.Router();

router.post('/user',addUser)
router.put("/user",updateUser)

module.exports = {
    routes:router
}