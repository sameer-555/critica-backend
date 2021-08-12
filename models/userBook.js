class UserBook {
    constructor(bookID,userID,isRead,isInWishlist,isLiked,creationDateAndTime){
        this.id = bookID
        this.userID = userID
        this.isRead = isRead
        this.isInWishlist = isInWishlist
        this.isLiked = isLiked
        this.creationDateAndTime = creationDateAndTime
    }
}

module.exports = UserBook