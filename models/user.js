class User {
    constructor(id,firstName,lastName,role,makeCriticRequest,isPremium,profilePicture,quote,
        gender,birthdate,accomplishment,aboutMe,creationDateAndTime){
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.makeCriticRequest = makeCriticRequest;
        this.isPremium = isPremium;
        this.profilePicture = profilePicture;
        this.quote = quote;
        this.gender = gender;
        this.birthdate = birthdate;
        this.accomplishment = accomplishment;
        this.aboutMe = aboutMe;
        this.creationDateAndTime = creationDateAndTime;
    }
}

module.exports = User