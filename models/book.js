class Book {
    constructor(id,title,author,genre,bookCover,description,totalRating,totalUsersCount,averageRating,totalComments,creationDateAndTime){
        this.id = id
        this.title = title
        this.author = author
        this.genre = genre
        this.bookCover = bookCover
        this.description = description
        this.totalRating = totalRating
        this.totalUsersCount = totalUsersCount
        this.totalComments = totalComments
        this.creationDateAndTime = creationDateAndTime
        this.averageRating = averageRating;
    }
}

module.exports = Book