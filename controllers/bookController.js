'use strict'

const firebase = require('../database');
const Book = require('../models/book')
const firestore = firebase.firestore();
const {getAuthorByID,updateGenre} = require('../controllers/homeController');
const {checkUserExists} = require("../controllers/userController")
const {getUserBookInfo} = require("../controllers/userBookController")
const { response } = require('express');

const addBook = async (req, res, next) => {
    try {
        const data = req.body;
        ['totalUsersCount','totalComments','averageRating','totalRating'].forEach(
            field => {
                data[field] = 0
            }
        )
        data['title_lowercase'] = data['title'].toLowerCase()
        data['creationDateAndTime'] = Date.now()
        await firestore.collection('books').doc().set(data);
        return res.status(200).send("Book Added Successfully")

    } catch (error ){
        return res.status(400).send("")
    }
}

const deleteBook = async (req,res,next) => {
    try{
        const id =  req.query.id;
        await firestore.collection("books").doc(id).delete()
        return res.status(200).send("record deleted successfully")
    }catch(error){
        return res.status(400).send(error)
    }
}

const updateBook = async(req,res,next) => {
    try{
        const id = req.query.id
        const data = req.body
        await firestore.collection('books').doc(id).update(data)
        return res.status(200).send("successfully updated")
    }
    catch(error){
        return res.status(400).send(error)
    }
}

// getBookSearchFilteredQuery
const getBookbyFilterValue = async (req,res,next) => {
    const data = req.body.filter
    const limit = req.query.limit || 5
    const keys = Object.keys(data)
    const offset = req.query.offset
    //basic validation on filter
    for(let i in keys){
        if (['averageRating','author','genre','title'].includes(keys[i])){
            // || (keys[i] === 'author' && !Array.isArray(data[keys[i]]))
            if((keys[i] === 'genre' && !Array.isArray(data[keys[i]]))){
                return res.status(400).send("Please make sure genre or author value is set in [] example {genre:['sci-fy','fantasy'],author:2}")
            }
            if('title' === keys[i] && !(typeof(data[keys[i]]) === 'string')){
                return res.status(400).send("Please make sure Author or Title value is set in [] example {title:'Animal Farm'}")
            }
            if(data[keys[i]] === 'averageRating' && !(typeof(data[keys[i]]) === 'number')){
                return res.status(400).send("Please make sure AverageRating value is number.")
            }
        }
        else{
            return res.status(400).send("filter avaliable based on Title, AverageRating, Genre and Author Name")
        }
    }

    //fetching genre to use if for mapping the genre with genre
    const genresDict = {}
    const genresCollection = await firestore.collection('genres').get()
    if(!genresCollection.empty){
        genresCollection.forEach(doc => {
            genresDict[doc.id] = doc.data().genre
        })
    }

    let bookQueryRef = firestore.collection('books')
    let copyForLastBookRef = firestore.collection('books')
    for(let i in keys){
        //filtering query for average rating
        if(keys[i] === 'averageRating'){
            let whereClause = getFilterType(keys[i],data[keys[i]])
            bookQueryRef = bookQueryRef.where(whereClause[0],whereClause[1],whereClause[2])
            copyForLastBookRef = copyForLastBookRef.where(whereClause[0],whereClause[1],whereClause[2])
        }
        //filtering query for title
        if(keys[i] === 'title'){
            const title = data[keys[i]].toLowerCase()
            bookQueryRef = bookQueryRef.orderBy('title_lowercase')
            .startAt(title)
            .endAt(`${title}+\uf8ff`)
            copyForLastBookRef = copyForLastBookRef.orderBy('title_lowercase')
            .startAt(title)
            .endAt(`${title}+\uf8ff`)
        }
        //filtering query for genre
        if(keys[i] === 'genre'){
            //applying query filter 
            bookQueryRef = bookQueryRef.where("genre","array-contains-any",data[keys[i]])
            copyForLastBookRef = copyForLastBookRef.where("genre","array-contains-any",data[keys[i]])
        }

        if(keys[i] === 'author'){
            bookQueryRef = bookQueryRef.where("author","==",data[keys[i]])
            copyForLastBookRef = copyForLastBookRef.where("author","==",data[keys[i]])
        }
    }


    if(offset==undefined || offset == 0){
        bookQueryRef = bookQueryRef.limit(limit);
    }else{
        const lastVisibleRef = await copyForLastBookRef.limit(offset).get();
        if(lastVisibleRef.empty){
            return res.status(200).send("No data Avaliable")   
        }
        const lastVisible = lastVisibleRef.docs[lastVisibleRef.docs.length - 1]
        bookQueryRef = bookQueryRef.startAfter(lastVisible).limit(limit)
    }

    const bookQueryData  = await bookQueryRef.get()
    const response = {
        total:0,
        data:[]
    }

    const booksListResponse = await createBookResponse(keys,data,genresDict,bookQueryData)
    response.total = booksListResponse.length
    response.data = booksListResponse
    return res.status(200).send(response)
}


//create filter using attribute 
const getFilterType = (attribute,value) => {
    if(attribute === 'averageRating'){
        return [attribute,'==',value]
    }
}


//create book repsonse
const createBookResponse = async(keys,filter,genresDict,bookRef) => {
    const bookList = []
    for(let i in bookRef.docs){   
        const doc = bookRef.docs[i]
        const book = doc.data()
        book['genre'] = await updateGenre(genresDict,book['genre'])
        book['author'] = await getAuthorByID(book['author'])
        book['id'] = doc.id
        bookList.push(book)
    }
    return bookList
}

//getbook by bookid

const getBookDoc = async (req,res,next) => {
    const genresDict = {}
    const genresCollection = await firestore.collection('genres').get()
    if(!genresCollection.empty){
        genresCollection.forEach(doc => {
            genresDict[doc.id] = doc.data().genre
        })
    }
    const bookID = req.query.bookID
    const userID = req.query.userID
    const response = { 
        data: {},
        ratingInfo: []
    }
    if(!bookID){
        return res.status(400).send("please make sure the id(bookID) parameter is set") 
    }
    if(userID){
        if(!checkUserExists(userID)){
            return res.status(400).send("userID does not exists")
        }
    }
    const bookRef = await firestore.collection('books').doc(bookID).get()
    if(bookRef.empty){
        return res.send(400).send("book id does not exists")
    }else{
        const userBookInfoRef = await getUserBookInfo(bookID,userID)
        let book = {}
        book = bookRef.data()
        book['id'] = bookRef.id
        book['genre'] = await updateGenre(genresDict,book['genre'])
        book['author'] = await getAuthorByID(book['author'])
        let bookAndUserBook = {...book, ...userBookInfoRef}
        response.data = bookAndUserBook
    }
    response.ratingInfo = await getReviewsForBooks(bookID)
    return res.status(200).send(response)
}

//get reviews book
const getReviewsForBooks = async (bookID) => {
    const reviewsRef = await firestore.collection('reviews').where('bookID','==',bookID).get()
    const response = {1:0,2:0,3:0,4:0,5:0}
    if(!reviewsRef.empty){
        for(let i in reviewsRef.docs){
            const doc = reviewsRef.docs[i]
            if(doc.data().rating != 0){
                response[parseInt(doc.data().rating)] = response[parseInt(doc.data().rating)] + 1 
            }
        }
    }
    return response
}


// const deleteUser = async
module.exports = {
    addBook,
    deleteBook,
    updateBook,
    getBookbyFilterValue,
    getBookDoc
}
