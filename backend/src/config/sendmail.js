import { createTransport } from "nodemailer"

const sendMail = async ({ email, subject, html }) => {
    const transporter = createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        logger: true,
        debug: true,
        tls: {
            rejectUnauthorized: true
        },
        family: 4,
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD
        }
    })
    await transporter.sendMail({
        from: process.env.USER,
        to: email,
        subject,
        html,
    })
}
export default sendMail;