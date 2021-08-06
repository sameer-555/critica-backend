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
        //to fetch highest rated book
        const criticallyAcclimedBooks = await firestore.collection('books').orderBy('averageRating','desc').limit(10).get()
        var criticallyAcclimedArray = [];
        if(!criticallyAcclimedBooks.expty){
            criticallyAcclimedBooks.forEach(doc => {
                const critically_accliamed_book = new Book(
                    doc.id,
                    doc.data().title,
                    doc.data().author,
                    doc.data().genre,
                    doc.data().bookCover,
                    doc.data().description,
                    doc.data().totalRating,
                    doc.data().totalUsersCount,
                    doc.data().totalComments,
                    doc.data().creationDateAndTime,
                    doc.data().averageRating
                )
                criticallyAcclimedArray.push(critically_accliamed_book)
            })
        }
        //to fetch most read book
        const mostReadBooks = await firestore.collection('books').orderBy('totalUsersCount','desc').limit(10).get()
        const mostReadBookArray = []
        if(!mostReadBooks.expty){
            mostReadBooks.forEach(doc => {
                const most_read_book = new Book(
                    doc.id,
                    doc.data().title,
                    doc.data().author,
                    doc.data().genre,
                    doc.data().bookCover,
                    doc.data().description,
                    doc.data().totalRating,
                    doc.data().totalUsersCount,
                    doc.data().totalComments,
                    doc.data().creationDateAndTime,
                    doc.data().averageRating
                )
                mostReadBookArray.push(most_read_book)
            })
        }

        //recently added books 
        const newlyAddedReadBooks = await firestore.collection('books').orderBy('creationDateAndTime','asc').limit(10).get()
        const newlyAddedBookArray = []
        if(!newlyAddedReadBooks.expty){
            newlyAddedReadBooks.forEach(doc => {
                const newly_added_book = new Book(
                    doc.id,
                    doc.data().title,
                    doc.data().author,
                    doc.data().genre,
                    doc.data().bookCover,
                    doc.data().description,
                    doc.data().totalRating,
                    doc.data().totalUsersCount,
                    doc.data().totalComments,
                    doc.data().creationDateAndTime,
                    doc.data().averageRating
                )
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

module.exports = {
    homeData
}
