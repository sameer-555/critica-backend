const express = require('express')
const {addBook,deleteBook,updateBook} = require('../controllers/bookController');

const router = express.Router();

router.post('/book',addBook)
router.delete('/book/:id',deleteBook)
router.put("/book/:id",updateBook)

module.exports = {
    routes:router
}