'use strict'

const { response } = require('express');
const firebase = require('../database');
const UserBook = require('../models/userBook')
const firestore = firebase.firestore();

const getUserBooks = async(req,res,next) => {
    const userId = req.params.id
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
                    update_details[field_list[i]] = true
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

module.exports = {
    updateUserBookDetails
}