const nodemailer = require('nodemailer');
const hbs = require('handlebars')
const fs = require('fs')
require('dotenv').config()


const email = process.env.EMAIL
const password = process.env.EMAIL_PASS

interface Idata {
    name: string,
    link?: string,
    code?: string
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: email,
        pass: password
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendEmail = async(emailType:string, recipient:string, data:Idata) => {
    let subject;

    if(emailType == 'verify'){
        subject = 'Verify your email'
    }else if(emailType == '2fa'){
        subject = 'Your Two Factor Authentication Code'
    }

    const templatePath = `./src/utils/emailTemplates/${emailType}.html`;
    const templateFile = fs.readFileSync(templatePath, 'utf-8');
    const template = hbs.compile(templateFile);     
    const html = template(data);
    
    const mailOptions = {
        from: email,
        to: recipient,
        subject: subject,
        html: html
    };

    const response = await transporter.sendMail(mailOptions)
    return response  
}

module.exports = sendEmail