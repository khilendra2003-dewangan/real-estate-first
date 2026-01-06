import nodemailer from 'nodemailer';

const sendMail = async ({ email, subject, html }) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.USER,
        to: email,
        subject: subject,
        html: html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("📧 Email sent: " + info.response);
    } catch (error) {
        console.error("❌ Nodemailer Error:", error);
        throw error; // Re-throw to trigger bypass
    }
};

export default sendMail;