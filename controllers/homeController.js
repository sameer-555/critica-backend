'use strict'

const firebase = require('../database');
const Book = require('../models/book')
const firestore = firebase.firestore();

const homeData = async (req,res,next) => {
    try{
        var response = {
            critically_accliamed:[],
            most_read:[],
            newly_added:[],
        }
        //fetching genres at once (to makesure there are less call to backend/firebase)
        const genresCollection = await firestore.collection('genres').get()
        var genresDict = {}
        if(!genresCollection.expty){
            genresCollection.forEach(doc => {
                genresDict[doc.id] = doc.data().genre
            })
        }
        //to fetch highest rated book
        const criticallyAcclimedBooks = await firestore.collection('books').orderBy('averageRating','desc').limit(10).get()
        var criticallyAcclimedArray = [];
        if(!criticallyAcclimedBooks.expty){
            criticallyAcclimedBooks.forEach(async (doc) => {
                const critically_accliamed_book = new Book(
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
                    critically_accliamed_book.genre = updateGenre(genresDict,critically_accliamed_book.genre)
                }
                critically_accliamed_book.author = await getAuthorByID(critically_accliamed_book.author)      
                criticallyAcclimedArray.push(critically_accliamed_book)
            })
        }
        //to fetch most read book
        const mostReadBooks = await firestore.collection('books').orderBy('totalUsersCount','desc').limit(10).get()
        const mostReadBookArray = []
        if(!mostReadBooks.expty){
            mostReadBooks.forEach(async (doc) => {
                const most_read_book = new Book(
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
                most_read_book.genre = updateGenre(genresDict,most_read_book.genre)
                }
                most_read_book.author = await getAuthorByID(most_read_book.author)
                mostReadBookArray.push(most_read_book)
            })
        }

        //recently added books 
        const newlyAddedReadBooks = await firestore.collection('books').orderBy('creationDateAndTime','asc').limit(10).get()
        const newlyAddedBookArray = []
        if(!newlyAddedReadBooks.expty){
            newlyAddedReadBooks.forEach(async (doc) => {
                const newly_added_book = new Book(
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
                newly_added_book.genre = updateGenre(genresDict,newly_added_book.genre)
                }
                newly_added_book.author = await getAuthorByID(newly_added_book.author)
                newlyAddedBookArray.push(newly_added_book)
            })
        }
        //creating response
        response.critically_accliamed = criticallyAcclimedArray;
        response.most_read = mostReadBookArray;
        response.newly_added = newlyAddedBookArray;

        //sending response
        res.status(200).send(response)
    }catch(error){
        res.status(400).send(error)
    }
}

const updateGenre = (genredictionary,genreList) => {
    return genreList.map(val => genredictionary[val])
}

const getAuthorByID = async (id) => {
    const authorDetails = await firestore.collection('authors').doc(id).get()
    return authorDetails.data().author_name
}

module.exports = {
    homeData
}
