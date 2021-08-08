class Book {
    constructor(id,title,author,genre,bookCover,description,totalRating,totalUsersCount,averageRating,creationDateAndTime,totalComments){
        this.id = id
        this.title = title
        this.author = author
        this.genre = genre
        this.bookCover = bookCover
        this.description = description
        this.totalRating = totalRating
        this.totalUsersCount = totalUsersCount
        this.averageRating = averageRating
        this.creationDateAndTime = creationDateAndTime
        this.totalComments = totalComments
    }
} 

module.exports = Book