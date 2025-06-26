import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    clientId: process.env.MAIL_CLIENT_ID,
    clientSecret: process.env.MAIL_CLIENT_SECRET,
    refreshToken: process.env.MAIL_REFRESH_TOKEN,
  },
});

export async function sendEmailNotification({
  receiver,
  subject,
  html,
}: {
  receiver: string;
  subject: string;
  html: string;
}) {
  const mailOptions = {
    from: `"Relxnote" <${process.env.MAIL_USERNAME}>`,
    to: receiver,
    subject: subject,
    html: html,
    text: stripHtml(html),
  };

  return transporter.sendMail(mailOptions);
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, "");
}

export const createAccountTemplate = (email: string, password: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .content { margin: 20px 0; }
        .credentials { background: #f9f9f9; padding: 15px; border-radius: 5px; }
        .footer { margin-top: 20px; font-size: 0.8em; color: #777; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Account Created Successfully</h2>
        </div>
        <div class="content">
            <p>Your account has been created successfully. Please use the credentials below to log in.</p>
            <p>You can change your password at any time in the app.</p>
            
            <div class="credentials">
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Temporary Password:</strong> ${password}</p>
            </div>
        </div>
        <div class="footer">
            <p>If you didn't request this, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
`;
