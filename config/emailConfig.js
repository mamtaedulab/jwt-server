const nodemailer=require('nodemailer')

let transporter= nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:25,
    secure: false, // true for 465, false for other ports
    auth: {
      user:'mamtavish2603@gmail.com', 
      pass:'vldnxkuzmpsedwpy', 
    },
    tls: {
        rejectUnauthorized: false
      }
})


module.exports=transporter;
