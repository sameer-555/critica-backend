'use strict'

const { response } = require('express');
const firebase = require('../database');
const User = require('../models/user')
const firestore = firebase.firestore();

const addUser = async (req, res, next) => {
    try {
        const data = req.body;
        //basic validations
        if(!data.email){
            res.status(400).send("Make sure email is set.")
        }
        const userExist =await checkIfUserAlreadyExists(data.email)
        if(userExist){
            res.status(200).send("User Signed In")
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
            res.status(200).send("User Added Successfully")
        }
    } catch (error ){
        res.status(400).send(error)
    }
}

const updateUser = async (req,res,next) => {
    try {
        const data = req.body.data
        const userID = req.body.id
        if(!data || !userID){
            res.status(400).send("please make sure the format is correct, example { 'ud':'userid', 'data':{'firstName':'sameer'}}")
        }
        await firestore.collection('users').doc(userID).update(data)
        res.status(200).send("Successfully Updated")
    }catch (error){
        res.status(400).send(error)
    }
}

//get user full name by user ID
const getUserName = async(userID) => {
    let userName = ''
    const userRef = await firestore.collection('users').doc(userID).get()
    userName = userRef.data().firstName + " " + userRef.data().lastName
    return userName
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

// const deleteUser = async
module.exports = {
    addUser,
    updateUser,
    getUserName,
    checkUserExists
}
