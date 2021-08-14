const express = require('express')
const {getAuthors} = require('../controllers/AuthorController');

const router = express.Router();

router.get('/authors',getAuthors)

module.exports = {
    routes:router
}