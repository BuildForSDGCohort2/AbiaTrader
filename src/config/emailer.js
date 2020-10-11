import nodemailer from 'nodemailer';
const logger = require('simple-node-logger').createSimpleLogger();

const transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    secure: false,
    auth: {
        user: 'postmaster@sandbox20867911a8c14ef984b200c3807c7ce2.mailgun.org',
        pass: '8a2c4f0189e471b6f114e6ac0ed17aa2-cb3791c4-cd257c6a'
    }
});

const sendEmail = async (email, message) => {
    const mailOptions = {
        from: ' "Food Farm" taofeekhammed@gmail.com',
        to: email,
        subject: 'Food Farm Notification',
        text: message
    };
    try{
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                logger.error(error.message);
            } else {
                logger.info('Email sent: ' + info.response);
            }
        });
    }catch(error){
        logger.error(error.message)
    }
}

export default sendEmail;