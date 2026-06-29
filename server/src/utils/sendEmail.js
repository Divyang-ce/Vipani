const nodemailer = require("nodemailer");

// Transporter — nodemailer no "sender" object
// Gmail SMTP use kariye chhe — port 587 = TLS secure connection
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,  // taro gmail
        pass: process.env.EMAIL_PASS,  // app password (real password nai!)
    },
});

// sendEmail function — to, subject, html pass karo
const sendEmail = async ({ to, subject, html }) => {
    const mailOptions = {
        from: `"Vipani" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    };

    // await karvanu — email send thay tya sudhi wait karo
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;