'use strict'

const firebase = require('../database');
const firestore = firebase.firestore();
const {sendMailToUser} = require('../notifications/MailConfig')
const {getMailBody} = require('../notifications/MailBody')

const payment =async(req,res,next) => {

}

module.exports ={
    payment
}