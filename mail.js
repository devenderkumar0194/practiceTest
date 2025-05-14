var nodemailer = require('nodemailer');

var transporter =  nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});


const sendMail = async (data) => {
    
  const res  =  await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
          to: data.to,
          subject: data.subject,
          html: data.html
  });
    
}


module.exports = sendMail;
