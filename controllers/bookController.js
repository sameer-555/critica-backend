'use strict'

const firebase = require('../database');
const Book = require('../models/book')
const firestore = firebase.firestore();
const {getAuthorByID,updateGenre} = require('../controllers/homeController');

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


const getBookbyFilterValue = async (req,res,next) => {
    const data = req.body.filter
    const offset = req.query.offset
    const limit = req.query.limit
    const keys = Object.keys(data)
    //basic checking and validations
    for(let i in keys){
        if( !Array.isArray(data[keys[i]])){
            res.status(400).send("please make sure book filter value is list ")
        }else{
            try{
                if(data[keys[i]].length > 2 || data[keys[i]].length <2){
                    throw "not allowed"
                }
                if(!['==','!=','>','>=','<','<=','in','not-in','array-contains','array-contains-any'].includes(data[keys[i]][0])){
                    res.status(400).send("only allowed operators :- '==','!=','>','>=','<','<=','in','not-in','array-contains','array-contains-any'")
                }
            }catch(error){
                res.status(400).send("please make sure filter is like following example:{ key: ['=',value]}")
            }
        }
    }
    //-------validations ends here

    //fetching genres at once (to makesure there are less call to backend/firebase)
    const genresCollection = await firestore.collection('genres').get()
    let genresDict = {}
    if(!genresCollection.empty){
        genresCollection.forEach(doc => {
            genresDict[doc.id] = doc.data().genre
        })
    }

    //apply filter
    const bookFilterQuery = firestore.collection("books")
    for(let i in keys){
        bookFilterQuery = bookFilterQuery.where(keys[i],data[keys[i]][0],data[keys[i]][1])
    }

    // bookFilterQuery = bookFilterQuery.limit(limit)
    // var lastSeenDoc = ''
    // if(offset){
    //     console.log("0000000000")
    //     const lastSeenDocRef = await firestore.collection('books').doc(offset).get()
    //     lastSeenDocRef.forEach(doc => {
    //         lastSeenDoc = doc
    //     });
    // }
    // console.log(lastSeenDoc,"------000------000----===-----")

    //get books
    const bookFilterQueryRef = await bookFilterQuery.get()
    //response
    const response = {
        total:0,
        books:[]
    }
    

    for(let i in bookFilterQueryRef.docs){
        const doc = bookFilterQueryRef.docs[i]
        response.total += 1
        const book = new Book(
            doc.id,
            doc.data().title,
            doc.data().author,
            doc.data().genre,
            doc.data().bookCover,
            doc.data().description,
            doc.data().totalRating,
            doc.data().totalUsersCount,
            doc.data().averageRating,
            doc.data().creationDateAndTime,
            doc.data().totalComments
        )
        if(genresDict){
            book.genre = updateGenre(genresDict,book.genre)
        }
        book.author = await getAuthorByID(book.author)
        response.books.push(book)
    }
    res.status(200).send(response)
}

// const deleteUser = async
module.exports = {
    addBook,
    deleteBook,
    updateBook,
    getBookbyFilterValue
}
