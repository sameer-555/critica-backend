const express = require('express')
const {addBook,deleteBook,updateBook,getBookbyFilterValue,getBookDoc} = require('../controllers/bookController');

const router = express.Router();

router.post('/book',addBook)
router.get('/book',getBookDoc)
router.delete('/book/:id',deleteBook)
router.put("/book/:id",updateBook)
router.post("/books/filtered",getBookbyFilterValue)


module.exports = {
    routes:router
}