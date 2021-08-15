'use strict'

const firebase = require('../database');
const firestore = firebase.firestore();

const addUserComment = async(userID,reviewID,isLiked) => {
    const userCommentExists = await userCommentAlreadyExists(userID,reviewID,isLiked)
    if(!userCommentExists){
        const data = {
            'userID':userID,
            'reviewID': reviewID,
            'isLiked': isLiked
        }
        await firestore.collection('user_comments').doc().set(data);
        return true
    }
    else{
        if(userCommentExists === 'reject'){
            return false
        }
        await updateComment(userCommentExists,isLiked)
        return true
    }

}

const updateComment = async(userCommentID,isLiked) => {
    await firestore.collection('user_comments').doc(userCommentID).update({'isLiked':isLiked})
    return 
}

const userCommentAlreadyExists = async(userID,reviewID,isLiked) => {
    const userCommentRef = await firestore.collection('user_comments').where('userID','==',userID).where('reviewID','==',reviewID).get()
    let inputSimilar = false
    if(userCommentRef.empty){
        return false
    }else{
        let userCommentID = ''
        for(let i in userCommentRef.docs){
            const doc = userCommentRef.docs[i]
            userCommentID = doc.id
            if(isLiked === doc.data().isLiked){
                inputSimilar = true
            }
            break
        }
        //if input is similar please dont update anything
        if(inputSimilar){
            return "reject"
        }
        else{
            return userCommentID
        }    
    }
}

module.exports = {
    addUserComment
}
