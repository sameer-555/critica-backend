'use strict'

const { response } = require('express');
const firebase = require('../database');
const User = require('../models/user')
const {sendMailToUser} = require('../notifications/MailConfig')
const {getMailBody} = require('../notifications/MailBody')
const firestore = firebase.firestore();
const jwt = require('jsonwebtoken')

const addUser = async (req, res, next) => {
    try {
        const data = req.body;
        //basic validations
        if(!data.email){
            return res.status(400).send("Make sure email is set.")
        }
        const userExist =await checkIfUserAlreadyExists(data.email)
        if(userExist){
            const response = await getUserInfo(data.email)
            return res.status(200).send(response)
        }
        else{
            //creating user
            data['creationDateAndTime'] = Date.now()
            const add_fields = ['firstName','lastName','role','makeCriticRequest','isPremium','profilePicture','gender','birthdate','accomplishment','aboutMe']
            add_fields.forEach(field => {
                if(!Object.keys(data).includes(field)){
                    if(['firstName','lastName','profilePicture','accomplishment','aboutMe'].includes(field)){
                        data[field] = ''
                    }
                    if(['role','isPremium','makeCriticRequest','birthdate'].includes(field)){
                        data[field] = 0
                    }
                }
            })
            data['role'] = 1
            await firestore.collection('users').doc().set(data);
            const response = await getUserInfo(data.email)
            //for sending the mail after first login
            if(process.env.BLOCK_MAIL != 1){
                const mailBody = getMailBody('user first login',data['firstName'],data['lastName'],data['email'])
                sendMailToUser(data['email'],"Welcome to critica",mailBody)  
            }   
            return res.status(200).send(response)
        }
    } catch (error ){
        return res.status(400).send(error)
    }
}

const updateUser = async (req,res,next) => {
    try {
        const data = req.body.data
        const userID = req.body.id
        if(!data || !userID){
            return res.status(400).send("please make sure the format is correct, example { 'ud':'userid', 'data':{'firstName':'sameer'}}")
        }
        await firestore.collection('users').doc(userID).update(data)
        if(data.isPremium == 1){
            const userDetails = await firestore.collection('users').doc(userID).get()
            if(process.env.BLOCK_MAIL != 1){
                const mailBody = getMailBody('premium user mail',userDetails.data().firstName,userDetails.data().lastName,userDetails.data().email)
                sendMailToUser(userDetails.data().email,"Thanks for using our Premium Membership!",mailBody)
            }
        }
        return res.status(200).send("Successfully Updated")
    }catch (error){
        return res.status(400).send(error)
    }
}

//get user full name by user ID
const getUserNameAndProfilePic = async(userID) => {
    const response = {
        userName: "",
        profilePicture: ""
    }
    const userRef = await firestore.collection('users').doc(userID).get()
    response.userName = userRef.data().firstName + " " + userRef.data().lastName
    response.profilePicture = userRef.data().profilePicture 
    return response
}

//get user by email ID
const checkIfUserAlreadyExists = async (email) => {
    const userRef = await firestore.collection('users').where('email','==',email).get()
    if(!userRef.empty){
        return true
    }
    else{
        return false
    }
}

//check if user exists

const checkUserExists = async (userID) => {
    const userRef = await firestore.collection('users').doc(userID).get()
    if(userRef.empty){
        return false
    }
    return true
}

//get user info by email
const getUserInfo = async (email) => {
    const userRef = await firestore.collection('users').where('email','==',email).get()
    let userDetails = {}
    for(let i in userRef.docs){
        const doc = userRef.docs[i]
        userDetails = doc.data()
        userDetails['id'] = doc.id
        if (i == 0) break
    }  
    userDetails['access_token'] = jwt.sign({ id:userDetails.id },process.env.ACCESS_TOKEN_SECRET)
    return userDetails
}

//verification of jwt token
const authenticateToken = async(req,res,next) => {
    const authHeader =req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)
    try{
        const decode =  await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        if(!decode.id){
            return res.status(400).send("Token is not valid")
        }else{
            const userRef = await firestore.collection('users').doc(decode.id).get()
            if(userRef.empty){
                return res.statu(400).send("user id is invalid")
            }else{
                next()
            }
        }
    }catch(error){
        return res.send("Token is invalid")
    }

}

// const deleteUser = async
module.exports = {
    addUser,
    updateUser,
    getUserNameAndProfilePic,
    checkUserExists,
    authenticateToken
}
