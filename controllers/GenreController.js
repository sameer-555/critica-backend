'use strict'

const firebase = require('../database');
const firestore = firebase.firestore();


const getGenres = async (req,res,next) => {
    const genreRef = await firestore.collection('genres').get()
    const genreResponse = {
        total:0,
        data:[]
    }
    genreRef.forEach( doc =>{
        const genre = {}
        genre[doc.id] = doc.data().genre
        genreResponse.total = genreResponse.total + 1
        genreResponse.data.push(genre)
    })
    return res.status(200).send(genreResponse) 
}

module.exports = {
    getGenres
}