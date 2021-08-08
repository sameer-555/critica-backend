class Review{
    constructor(userID,bookID,comment,rating,totalLikes,creationDateAndTime){
        this.userID = userID
        this.bookID = bookID
        this.comment = comment 
        this.rating = rating
        this.totalLikes = totalLikes
        this.creationDateAndTime = creationDateAndTime
    }
}

module.exports = Review