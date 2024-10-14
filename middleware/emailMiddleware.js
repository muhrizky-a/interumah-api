const nodemailer = require('nodemailer');

const sendEmail = async (req, res, next) => {
    try {
        const { email } = req.user;
        const { subject, htmlContent } = req.mailContent;

        const transporter = await nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_ADDRESS,
                pass: process.env.MAIL_PASSWORD,
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false,
            },
        });

        const message = {
            from: 'Interumah',
            to: email,
            subject,
            html: htmlContent
        };

        // await transporter.sendMail(message);
        transporter.sendMail(message);

        next();
    } catch (error) {
        next(error)
    }
}


module.exports = {
    sendEmail
};