'use strict'

const firebase = require('../database');
const Book = require('../models/book')
const firestore = firebase.firestore();
const {getAuthorByID,updateGenre} = require('../controllers/homeController');
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
                res.status(400).send("Please make sure genre or author value is set in [] example {genre:['sci-fy','fantasy'],author:[1,2]}")
            }
            if('title' === keys[i] && !(typeof(data[keys[i]]) === 'string')){
                res.status(400).send("Please make sure Author or Title value is set in [] example {title:'Animal Farm'}")
            }
            if(data[keys[i]] === 'averageRating' && !(typeof(data[keys[i]]) === 'number')){
                res.status(400).send("Please make sure AverageRating value is number.")
            }
        }
        else{
            res.status(400).send("filter avaliable based on Title, AverageRating, Genre and Author Name")
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
            .endAt(`${title}\uf8ff`)
            copyForLastBookRef = copyForLastBookRef.orderBy('title_lowercase')
            .startAt(title)
            .endAt(`${title}\uf8ff`)
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
            res.status(200).send("No data Avaliable")
            return
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
    res.status(200).send(response)
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
        //in firebase you cannot use array contains and in operator at the same time, so filtering the author programmatically
        // if(keys.includes('author')){
        //     if(!filter['author'].includes(doc.data().author)){
        //         continue
        //     }
        // }
        const book = doc.data()
        book['genre'] = await updateGenre(genresDict,book['genre'])
        book['author'] = await getAuthorByID(book['author'])
        book['id'] = doc.id
        bookList.push(book)
    }
    return bookList
}

// const deleteUser = async
module.exports = {
    addBook,
    deleteBook,
    updateBook,
    getBookbyFilterValue
}
