import { mailtrapClient, sender } from "./mailtrap.config.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

export const sendVerificationEmail = async (
  email: string,
  verificationCode: string,
) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.exec(email)) {
    throw new Error("Invalid email format");
  }
  const sanitizedCode = encodeURIComponent(verificationCode);

  const recipients = [
    {
      email: email,
    },
  ];
  const html = VERIFICATION_EMAIL_TEMPLATE;

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Verify Your Email",
      html: html.replace("{verificationCode}", sanitizedCode),
      category: "Verification Email",
    });

    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  const recipients = [
    {
      email: email,
    },
  ];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      template_uuid: "7905cca5-b2d0-42ac-b7ad-1570f3037508",
      template_variables: {
        name: name,
      },
    });

    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  resetURL: string,
) => {
  const recipient = [{ email }];

  const html = PASSWORD_RESET_REQUEST_TEMPLATE;

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset Your Password",
      html: html.replace("{resetURL}", resetURL),
      category: "password reset",
    });

    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

export const sendResetSuccessEmail = async (email: string) => {
  const recipient = [{ email }];

  const html = PASSWORD_RESET_SUCCESS_TEMPLATE;

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successfully",
      html: html,
      category: "password reset",
    });

    console.log("Password reset successfully", response);
  } catch (error) {
    console.error("Error in password reset", error);
    throw error;
  }
};
