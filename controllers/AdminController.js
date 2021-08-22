'use strict'

const firebase = require('../database');
const firestore = firebase.firestore();
const {sendMailToUser} = require('../notifications/MailConfig')
const {getMailBody} = require('../notifications/MailBody')


const getCriticRequest = async (req,res,next) => {
    // const userRef = s
    const offset = req.query.offset
    const body = req.body
    const limit = req.query.limit || 3
    const response = {
        total:0,
        data:[]
    }
    //if offset is not set fetch first results
    if(offset==undefined || offset == 0){
        const first = firestore.collection("users").orderBy("creationDateAndTime").where('makeCriticRequest','==',1).limit(limit);
        const firestRef = await first.get()
        const resp = createUserListResponse(firestRef)
        response.total = resp.length
        response.data = resp
        return res.status(200).send(response)
    }else{
        const lastVisibleRef = await firestore.collection('users').orderBy("creationDateAndTime").where('makeCriticRequest','==',1).limit(offset).get();
        const lastVisible = lastVisibleRef.docs[lastVisibleRef.docs.length - 1]
        let userRef = await firestore.collection("users").orderBy("creationDateAndTime").startAfter(lastVisible).where('makeCriticRequest','==',1).limit(limit).get();
        const resp = createUserListResponse(userRef)
        response.total = resp.length
        response.data = resp
        return res.status(200).send(response)
    }
}

//create api to fetch critic requests 
const adminApproveReject = async (req,res,next) =>{
    const body = req.body
    if(!body.userID || body.respond == undefined){
        res.status(400).send("Please make sure the userID and respond is set")
        return
    }
    if(body.respond){
        await firestore.collection('users').doc(body.userID).update({"role":2})
        const userRef = await firestore.collection('users').doc(body.userID).get()
        const mailBody = getMailBody('critic congratulation',userRef.data().firstName,userRef.data().lastName,userRef.data().email)
        sendMailToUser(userRef.data().email,"You are now a Critic on our platform!",mailBody)
        return res.status(200).send("Approved Successfully")
    }
    else{
        await firestore.collection('users').doc(body.userID).update({"makeCriticRequest":0})
        const userRef = await firestore.collection('users').doc(body.userID).get()
        const mailBody = getMailBody('critic request reject',userRef.data().firstName,userRef.data().lastName,userRef.data().email)
        sendMailToUser(userRef.data().email,"Sorry, your request is rejected for now.",mailBody)
        return res.status(200).send("Request Rejected")
    }

}


//create api to approve/ reject user request
const createUserListResponse = (usersData) => {
    const response = []
    if(!usersData.empty){
        usersData.forEach(doc => {
            const user = doc.data()
            user['id'] = doc.id
            response.push(user)
        })
    }
    return response
}


module.exports = {
    getCriticRequest,
    adminApproveReject
}