const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = class sendEmailAPI {
  static async sendEmail({ email, subject, html }) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    try {
      const message = await transporter.sendMail({
        from: '"FOODVC" <congdat147x.email>',
        to: email,
        subject: subject,
        html: `
                    <html>
                    <body>
                        <p><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaiY7zoWFR1t2sM3lg7UsGJT_FUcKx0pwn0NGhpEEDNg&s" alt="Logo"></p>
                        ${html}
                    </body>
                    </html>
                `,
      });
      return message;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
};
