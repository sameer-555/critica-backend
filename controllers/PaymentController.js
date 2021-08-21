'use strict'

const firebase = require('../database');
const firestore = firebase.firestore();
const {sendMailToUser} = require('../notifications/MailConfig')
const {getMailBody} = require('../notifications/MailBody');
const { response } = require('express');
const stripe = require('stripe')(process.env.STRIP_SECRET_KEY);

const payment =async(req,res,next) => {
    const client_id = req.body.client_id || null
    const body = req.body
    let client_secret = ''
    if(client_id){
        const getPaymentIntent = await stripe.paymentIntents.retrieve(client_id)
        client_secret = getPaymentIntent.client_secret
        if(!client_secret){
            return res.status(400).send("client id is invalid")
        }
    }else{
        if(!body.amount || !body.currency){
            return res.status(400).send("please make sure amount and currency is set in the body")
        }
        //in strip amount is consider in cents
        body["amount"] = body["amount"] * 100
        console.log(body)
        const createPaymentInfo = await createPaymentIntent(body)
        client_secret = createPaymentInfo
        if(!client_secret){
            return res.status(400).send("error while creating payment intent")
        }
    }
    return res.status(200).send({'client_secret':client_secret})
}


const createPaymentIntent = async(data) => {
    const paymentIntent = await stripe.paymentIntents.create(data);
    return paymentIntent.client_secret
}

module.exports ={
    payment
}