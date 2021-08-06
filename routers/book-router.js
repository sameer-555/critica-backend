const express = require('express')
const {addBook,deleteBook} = require('../controllers/bookController');

const router = express.Router();

router.post('/book',addBook)
router.delete('/book/:id',deleteBook)

module.exports = {
    routes:router
}