import { createTransport } from "nodemailer"

const sendMail = async ({ email, subject, html }) => {
    const transporter = createTransport({
        service: "gmail",
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