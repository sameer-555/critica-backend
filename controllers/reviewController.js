'use strict'

const firebase = require('../database');
const firestore = firebase.firestore();
const {getUserName} = require("../controllers/userController")
const {addUserComment} = require("../controllers/UserCommentController")


const addReview = async (req, res, next) => {
    try {
        const data = req.body;
        const exists = await checkIfReviewAlreadyExists(data)
        if(exists){
            res.status(400).send('Review for this book already exists by the user.')
        }else{
            await updateBookInfoAfterReview(data);
            data['creationDateAndTime'] = Date.now()
            data["totalLikes"] = 0
            await firestore.collection('reviews').doc().set(data);
            res.status(200).send("Review Added Successfully")
        }
    } catch (error ){
        res.status(400).send(error)
    }
}

const updateReview = async (req,res,next) => {
    try {
        const reviewId = req.params.id
        const updatedReviewData = req.body
        const reviewRef = await firestore.collection('reviews').doc(reviewId).get()
        const reviewInfo = reviewRef.data()
        await removingUserReviewFromBook(reviewInfo)
        await updateBookInfoAfterReview(updatedReviewData)
        await firestore.collection('reviews').doc(reviewId).update(updatedReviewData)
        res.status(200).send("successfully updated")
    }catch (error){
        res.status(400).send(error)
    }
}

const deleteReview = async (req,res,next) => {
    const reviewId= req.params.id
    const reviewRef = await firestore.collection('reviews').doc(reviewId).get()
    await removingUserReviewFromBook(reviewRef.data())
    await firestore.collection('reviews').doc(reviewId).delete()
    res.status(200).send("Deleted updated")
}

//updating book accordingly as soon new review is added.
const updateBookInfoAfterReview = async (reviewInfo) => {
    const bookID = reviewInfo.bookID
    const bookRef = await firestore.collection('books').doc(bookID).get()
    const bookUpdatedInfo = bookRef.data()
    bookUpdatedInfo.totalComments = bookUpdatedInfo.totalComments + 1
    bookUpdatedInfo.totalRating = bookUpdatedInfo.totalRating + reviewInfo.rating
    bookUpdatedInfo.totalUsersCount = bookUpdatedInfo.totalUsersCount + 1
    bookUpdatedInfo.averageRating = bookUpdatedInfo.totalRating/bookUpdatedInfo.totalUsersCount
    await firestore.collection('books').doc(bookID).set(bookUpdatedInfo)
    return 
}

//deleteting book review
const removingUserReviewFromBook = async (reviewInfo) => {
    //planning to use this while editing the review or deleting the review
    const bookID = reviewInfo.bookID
    const bookRef = await firestore.collection('books').doc(bookID).get()
    const bookUpdatedInfo = bookRef.data()
    bookUpdatedInfo.totalComments = bookUpdatedInfo.totalComments - 1
    bookUpdatedInfo.totalRating = bookUpdatedInfo.totalRating - reviewInfo.rating
    bookUpdatedInfo.totalUsersCount = bookUpdatedInfo.totalUsersCount - 1
    bookUpdatedInfo.averageRating = bookUpdatedInfo.totalRating/bookUpdatedInfo.totalUsersCount
    await firestore.collection('books').doc(bookID).set(bookUpdatedInfo)
    return 
}

const getReviewsByBookId = async (req,res,next) => {
    const bookID = req.params.id
    const reviewRef = await firestore.collection('reviews').orderBy('creationDateAndTime').where('bookID',"==",bookID).get()
    const response = {
        total:0,
        data:[]
    }
    if(!reviewRef.empty){
        for(let i in reviewRef.docs){
            const doc = reviewRef.docs[i]
            const review = doc.data()
            review['id'] = doc.id
            review['userFullName'] = await getUserName(doc.data().userID)
            response.data.push(review)
            response.total = response.total + 1
        }
    }
    else{
        res.status(200).send("No Review in Book.")
    }
    res.status(200).send(response)
}

//add likes to comment and save user id on the comments
const likeComment = async (req,res,next) => {
    const reviewID = req.body.id
    const isLiked = req.body.isLiked
    const userID = req.body.userID
    const reviewRef = await firestore.collection('reviews').doc(reviewID).get()
    const updateUserComment = await addUserComment(userID,reviewID,isLiked)
    const updateReview = {}
    if(isLiked){      
        if(updateUserComment){
            updateReview['totalLikes'] = reviewRef.data().totalLikes + 1
            await firestore.collection('reviews').doc(reviewID).update(updateReview)
            res.status(200).send("like added to the review")
            return
        }
        else{
            res.status(200).send("isLike is already set currently updated value")
        }
    }
    else{
        if(updateUserComment){
            updateReview['totalLikes'] = reviewRef.data().totalLikes - 1
            await firestore.collection('reviews').doc(reviewID).update(updateReview)
            res.status(200).send("like removed to the review")
            return
        }
        else{
            res.status(200).send("isLike is already set currently updated value")
        }
    }
}


const checkIfReviewAlreadyExists = async(reviewData) => {
    const reviewRef = await firestore.collection('reviews').where('userID','==',reviewData.userID).where('bookID','==',reviewData.bookID).get()
    if(reviewRef.empty){
        return false
    }
    else{
        return true
    }
}

// const deleteUser = async
module.exports = {
    addReview,
    updateReview,
    deleteReview,
    getReviewsByBookId,
    likeComment
}