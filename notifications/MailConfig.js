"use strict";
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    address: 'smtp.gmail.com',
    port:587,
    service:'gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
const textMailOptions = (sendTo,subject,messageBody) => {
    let mailContent = {
        from: process.env.EMAIL_ADDRESS,
        to: sendTo,
        subject: subject,
        html: messageBody
    }
    return mailContent
};



const sendMailToUser = async (sendTo,subject,messageBody) => {
    const mailOptions = textMailOptions(sendTo,subject,messageBody)
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}
  
module.exports = {
    sendMailToUser
}