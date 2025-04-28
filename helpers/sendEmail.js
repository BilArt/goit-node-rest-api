import nodemailer from "nodemailer";

const { UKR_NET_USER, UKR_NET_PASS, BASE_URL } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_USER,
    pass: UKR_NET_PASS,
  },
});

export const sendEmail = async (to, verificationToken) => {
  const mailOptions = {
    from: UKR_NET_USER,
    to,
    subject: "Email Verification",
    html: `<p>To verify your email, please click <a href="${BASE_URL}/api/auth/verify/${verificationToken}">here</a>.</p>`,
  };

  await transporter.sendMail(mailOptions);
};
