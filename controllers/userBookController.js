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
            bookData['isInWishlist'] = doc.data().isInWishlist
            bookData['isLiked'] = doc.data().isLiked
            bookData['isRead'] = doc.data().isRead
            bookList.push(bookData)
        }
        response.books = bookList
        return res.status(200).send(response)
    }else{
        return res.status(200).send("No entries found")
    }
}

const updateUserBookDetails = async(req,res,next) => {
    const data = req.body;
    const userBookRef = await firestore.collection('user_books').where('bookID','==',data.bookID).where('userID',"==",data.userID).get()
    if(userBookRef.empty){
        const userbookcreation = await createUserBookRelation(data)
        if(userbookcreation){
            return res.status(200).send("like added")
        }
        else{
            return res.status(400).send("some error occured")
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
                    return res.status(200).send('updated successfully.')
                }
            }

        } catch( error ){
            return res.status(500).send('error while updating like/wishlisting/read.')
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
    let bookdata = {}
    if(firestoreRef.id){
        bookdata = firestoreRef.data()
        bookdata['id'] = firestoreRef.id
        if(genreDict){
            bookdata.genre = updateGenre(genreDict,bookdata.genre)
        }
        bookdata.author = await getAuthorByID(bookdata.author)
    }else{
        bookdata = "no book found with " + bookID +" please check the database."
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