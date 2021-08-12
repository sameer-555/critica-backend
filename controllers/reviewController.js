'use strict'

const firebase = require('../database');
const Review = require('../models/review')
const firestore = firebase.firestore();

const addReview = async (req, res, next) => {
    try {
        const data = req.body;
        await updateBookInfoAfterReview(data);
        await firestore.collection('reviews').doc().set(data);
        res.status(200).send("Review Added Successfully")
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

// const deleteUser = async
module.exports = {
    addReview,
    updateReview,
    deleteReview
}