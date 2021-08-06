'use strict'

const firebase = require('../database');
const User = require('../models/user')
const firestore = firebase.firestore();

const addUser = async (req, res, next) => {
    try {
        const data = req.body;
        await firestore.collection('users').doc().set(data);
        res.status(200).send("User Added Successfully")

    } catch (error ){
        res.status(400).send("")
    }
}

// const deleteUser = async
module.exports = {
    addUser
}
