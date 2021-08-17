'use strict'

const { response } = require('express');
const firebase = require('../database');
const firestore = firebase.firestore();
const {getAuthorByID,updateGenre} = require('../controllers/homeController');

//to fetch the user books in read
const getUserReadBooks = async(req,res,next) => {
    const userId = req.query.id
    const genresCollection = await firestore.collection('genres').get()
    const genresDict = {}
    if(!genresCollection.empty){
        genresCollection.forEach(doc => {
            genresDict[doc.id] = doc.data().genre
        })
    }
    const userBookRef = await firestore.collection('user_books').where('userID',"==",userId).get()
    const response = {
        total: 0,
        books: []
    }
    if(!userBookRef.empty){
        const bookList = [] 
        for(let i in userBookRef.docs){
            response.total += 1 
            const doc = userBookRef.docs[i]
            const bookData = await getBookInfo(doc.data().bookID,genresDict)
            bookList.push(bookData)
        }
        response.books = bookList
        res.status(200).send(response)
    }else{
        res.status(200).send("No entries found")
    }
}

const updateUserBookDetails = async(req,res,next) => {
    const data = req.body;
    const userBookRef = await firestore.collection('user_books').where('bookID','==',data.bookID).get()
    if(userBookRef.empty){
        const userbookcreation = await createUserBookRelation(data)
        if(userbookcreation){
            res.status(200).send("like added")
        }
        else{
            res.status(400).send("some error occured")
        }
    }else{
        try{
            const field_list = ['isRead','isInWishlist','isLiked']
            let userBookID = ''
            userBookRef.forEach(
                doc => {
                    userBookID = doc.id
                }
            )
            for(let i in field_list){
                if(Object.keys(data).includes(field_list[i])){
                    const update_details = {}
                    update_details[field_list[i]] = data[field_list[i]]
                    await firestore.collection('user_books').doc(userBookID).update(update_details);
                    res.status(200).send('updated successfully.')
                }
            }

        } catch( error ){
            res.status(500).send('error while updating like/wishlisting/read.')
        }

    }
}

const createUserBookRelation = async (relationData) => {
    const bookRelationObj = {}
    try{
        const field_list = [ 'isRead','isInWishlist','isLiked']
        field_list.forEach(
        field => {
            bookRelationObj[field] = false
            if(relationData[field]){
                bookRelationObj[field] = true
            }
        })
        bookRelationObj['userID'] = relationData['userID']
        bookRelationObj['bookID'] = relationData['bookID']
        bookRelationObj['creationDateAndTime'] = Date.now()
        await firestore.collection('user_books').doc().set(bookRelationObj);
        return true
    }catch(error){
        return false
    } 
}

const getBookInfo = async (bookID,genreDict) => {
    const firestoreRef = await firestore.collection('books').doc(bookID).get()
    let bookdata = ''
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
            book.author = await getAuthorByID(book.author)
            bookdata = book 
        }
    }
    return bookdata
}


//get user book info by userid and bookid
const getUserBookInfo = async(bookID,userID) => {
    const response = {}
    if(!userID){
        response['userID'] = null
        response['isInWishlist'] = false
        response['isLiked'] = false
        response['isRead'] = false
    }
    else{
        const userBookRef = await firestore.collection('user_books').where('bookID',"==",bookID).where('userID',"==",userID).limit(1).get()
        if(userBookRef.empty){
            response['userID'] = userID
            response['isInWishlist'] = false
            response['isLiked'] = false
            response['isRead'] = false
        }else{
            for(let i in userBookRef.docs){
                const doc = userBookRef.docs[i]
                response['userID'] = doc.id
                response['isInWishlist'] = doc.data().isInWishlist
                response['isLiked'] = doc.data().isLiked
                response['isRead'] = doc.data().isRead
            }
        }
    }
    return response
}


module.exports = {
    updateUserBookDetails,
    getUserReadBooks,
    getUserBookInfo
}