import nodemailer from 'nodemailer';

const sendMail = async ({ email, subject, html }) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: `Real Estate <${process.env.SMTP_USER}>`, // Sender address
        to: email,
        subject: subject,
        html: html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("📧 Email sent via Brevo: " + info.response);
    } catch (error) {
        console.error("❌ Brevo SMTP Error:", error);
        throw error; // Re-throw to trigger bypass
    }
};

export default sendMail;