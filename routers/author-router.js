const express = require('express')
const {getAuthors} = require('../controllers/AuthorController');

const router = express.Router();

router.get('/author',getAuthors)

module.exports = {
    routes:router
}