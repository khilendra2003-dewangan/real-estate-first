import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async ({ email, subject, html }) => {
    try {
        const data = await resend.emails.send({
            from: 'Real Estate <onboarding@resend.dev>', // Default testing domain
            to: email,
            subject: subject,
            html: html,
        });
        console.log("📧 Email sent successfully:", data);
    } catch (error) {
        console.error("❌ Resend Error:", error);
        throw error; // Re-throw to be caught by the controller
    }
}

export default sendMail;