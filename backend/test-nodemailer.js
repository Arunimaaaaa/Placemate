const nodemailer = require('nodemailer');

async function testEmail() {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com', // Replace with your email
        pass: 'your-email-password'   // Replace with your email password or app password
      }
    });

    let info = await transporter.sendMail({
      from: '"Test" <your-email@gmail.com>', // sender address
      to: 'your-email@gmail.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'This is a test email from nodemailer', // plain text body
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

testEmail();
