require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.json());
sgMail.setApiKey('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')

app.post('/send-email', (req, res) => {
    const msg = {
      to: req.body.toSendEmail, // Change to your recipient
      from: 'sashankwork8225@gmail.com', // Change to your verified sender
      subject: 'Code to Change Daily Limit - Instagram Limiter',
      text: `Your code is ${req.body.code}`,
    };
  
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent with code:', req.body.code);
        res.send('Email sent successfully');
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error sending email');
      });
  });

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

