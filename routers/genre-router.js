const express = require('express')
const {getGenres} = require('../controllers/GenreController');

const router = express.Router();

router.get('/genres',getGenres)

module.exports = {
    routes:router
}