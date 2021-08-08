'use strict'

const firebase = require('../database');
const Book = require('../models/book')
const firestore = firebase.firestore();

const addBook = async (req, res, next) => {
    try {
        const data = req.body;
        ['totalUsersCount','totalComments','averageRating','totalRating'].forEach(
            field => {
                data[field] = 0
            }
        )
        await firestore.collection('books').doc().set(data);
        res.status(200).send("Book Added Successfully")

    } catch (error ){
        res.status(400).send("")
    }
}

const deleteBook = async (req,res,next) => {
    try{
        const id =  req.params.id;
        await firestore.collection("books").doc(id).delete()
        res.status(200).send("record deleted successfully")
    }catch(error){
        res.status(400).send(error)
    }
}

const updateBook = async(req,res,next) => {
    try{
        const id = req.params.id
        const data = req.body
        await firestore.collection('books').doc(id).update(data)
        res.status(200).send("successfully updated")
    }
    catch(error){
        res.status(400).send(error)
    }
}
// const deleteUser = async
module.exports = {
    addBook,
    deleteBook,
    updateBook
}
