'use strict'

const firebase = require('../database');
const firestore = firebase.firestore();


const getAuthors = async (req,res,next) => {
    const authorRef = await firestore.collection('authors').get()
    const authorResponse = {
        total:0,
        data:[]
    }
    authorRef.forEach( doc =>{
        const author = {}
        author[doc.id] = doc.data().author_name
        authorResponse.total = authorResponse.total + 1
        authorResponse.data.push(author)
    })
    return res.status(200).send(authorResponse) 
}

module.exports = {
    getAuthors
}