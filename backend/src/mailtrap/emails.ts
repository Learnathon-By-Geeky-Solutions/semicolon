import { mailtrapClient } from "./mailtrap.config.js";

import { PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email: string, verificationCode: string) => {
    const recipients = [
        {
            email: email,
        }
    ];
    const html = VERIFICATION_EMAIL_TEMPLATE;

    try {
        await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Verify Your Email",
            html: html.replace("{verificationCode}", verificationCode),
            category: "Verification Email",
        });

        console.log("Verification email sent successfully");
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw error;
    }
}