'use strict'

const firebase = require('../database');
const Book = require('../models/book')
const firestore = firebase.firestore();
const mcache = require('memory-cache')

const homeData = async (req,res,next) => {
    try{
        const response = {
            critically_accliamed:[],
            most_read:[],
            newly_added:[],
        }
        //fetching genres at once (to makesure there are less call to backend/firebase)
        const genresCollection = await firestore.collection('genres').get()
        const genresDict = {}
        if(!genresCollection.empty){
            genresCollection.forEach(doc => {
                genresDict[doc.id] = doc.data().genre
            })
        }
        const authorsRef = await firestore.collection('authors').get()
        const authorDict = {}
        if(!authorsRef.empty){
            authorsRef.forEach(doc => {
                authorDict[doc.id] = doc.data().author_name
            })
        }
        //to fetch highest rated book
        const criticallyAcclimedBooks = await firestore.collection('books').orderBy('averageRating','desc').limit(10).get()
        const criticallyAcclimedArray = addBookInHomeResponse(criticallyAcclimedBooks,genresDict,authorDict)
        //to fetch most read book
        const mostReadBooks = await firestore.collection('books').orderBy('totalUsersCount','desc').limit(10).get()
        const mostReadBookArray = addBookInHomeResponse(mostReadBooks,genresDict,authorDict)
        //recently added books 
        const newlyAddedReadBooks = await firestore.collection('books').orderBy('creationDateAndTime','desc').limit(10).get()
        const newlyAddedBookArray = addBookInHomeResponse(newlyAddedReadBooks,genresDict,authorDict)
        //creating response
        response.critically_accliamed = criticallyAcclimedArray;
        response.most_read = mostReadBookArray;
        response.newly_added = newlyAddedBookArray;
        //sending response
        //caching the response for 3 hours
        mcache.put('__critica__home',response,9*540000)
        return res.status(200).send(response)
    }catch(error){
        return res.status(400).send(error)
    }
}

const updateGenre = (genredictionary,genreList) => {
    return genreList.map(val => genredictionary[val])
}


const addBookInHomeResponse = (firestoreRef, genreDict,authorDict ) => {
    const bookList = [];
    if(!firestoreRef.empty){
        for( let i in firestoreRef.docs){
            const doc = firestoreRef.docs[i]
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
            if(genreDict){
                book.genre = updateGenre(genreDict,book.genre)
            }
            book.author = authorDict[book.author]
            bookList.push(book)
        }
    }
    return bookList
}

const getAuthorByID = async (id) => {
    //according to chrome (""+num) is fastest base transformation
    const authorDetails = await firestore.collection('authors').doc(""+id).get()
    return authorDetails.data().author_name
}

module.exports = {
    homeData,
    getAuthorByID,
    updateGenre
}
