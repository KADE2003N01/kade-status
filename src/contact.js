const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Joi = require('joi');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Nodemailer connection error:', error.message);
  } else {
    console.log('📧 Email service is active and ready');
  }
});

router.post(['/', '/send'], async (req, res) => { // Handles both /api/contact/ and /api/contact/send
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().email().required(),
    message: Joi.string().trim().min(10).max(2000).required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, error: error.details[0].message });
  }

  const { name, email, message } = value;

  try {
    const mailToOwner = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio: New message from ${name}`,
      text: `You received a new message from your portfolio:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    const mailToViewer = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Message Received - David KWIZERA',
      html: `
        <p>Dear ${name},</p>
        <p>Thank you for reaching out! I have received your message and will get back to you as soon as possible.</p>
        <p>Best regards,<br>David KWIZERA</p>
        <hr>
        <p><small>This is an automated confirmation, please do not reply directly to this email.</small></p>
      `,
    };

    await Promise.all([transporter.sendMail(mailToOwner), transporter.sendMail(mailToViewer)]);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

module.exports = router;