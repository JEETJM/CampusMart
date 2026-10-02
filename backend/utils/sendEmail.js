const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("========== SENDING OTP EMAIL ==========");
    console.log("To:", to);
    console.log("From configured:", Boolean(process.env.EMAIL_FROM));

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log("========== EMAIL SENT ==========");
    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);

    return info;
  } catch (error) {
    console.error("========== EMAIL SEND ERROR ==========");
    console.error("Code:", error?.code);
    console.error("Response:", error?.response);
    console.error("Response Code:", error?.responseCode);
    console.error("Message:", error?.message);
    console.error("======================================");

    throw error;
  }
};

module.exports = sendEmail;