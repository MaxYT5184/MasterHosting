require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false // Allow external scripts (AdSense, reCAPTCHA)
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    res.status(429).render('error-429', {
      title: '429 - Too Many Requests',
      page: 'error'
    });
  }
});
app.use(limiter);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to pass common variables to all views
app.use((req, res, next) => {
  res.locals.user = null; // No user authentication
  res.locals.recaptchaSiteKey = process.env.RECAPTCHA_SITE_KEY;
  res.locals.adsenseClientId = process.env.ADSENSE_CLIENT_ID;
  next();
});

// ==================== ROUTES ====================

// Homepage
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'MasterHosting - Free Website Hosting',
    page: 'home'
  });
});

// Contact page (no login required)
app.get('/contact', (req, res) => {
  res.render('contact', { 
    title: 'Contact Us - MasterHosting',
    page: 'contact'
  });
});

// Privacy Policy page
app.get('/privacy', (req, res) => {
  res.render('privacy', { 
    title: 'Privacy Policy - MasterHosting',
    page: 'privacy'
  });
});

// Terms of Service page
app.get('/terms', (req, res) => {
  res.render('terms', { 
    title: 'Terms of Service - MasterHosting',
    page: 'terms'
  });
});

// About page
app.get('/about', (req, res) => {
  res.render('about', { 
    title: 'About Us - MasterHosting',
    page: 'about'
  });
});

// Update Log page
app.get('/updates', (req, res) => {
  res.render('updates', { 
    title: 'Update Log - MasterHosting',
    page: 'updates'
  });
});

// Serve ads.txt file
app.get('/ads.txt', (req, res) => {
  res.type('text/plain');
  res.sendFile(path.join(__dirname, 'public', 'ads.txt'));
});

// Serve robots.txt file
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

// ==================== API ROUTES ====================

// Create reusable transporter (outside route for better performance)
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    pool: true, // Use pooled connections
    maxConnections: 5,
    maxMessages: 100
  });
}

// Contact form submission (with reCAPTCHA)
app.post('/contact', async (req, res) => {
  const { name, email, message, recaptchaToken } = req.body;
  
  // Validate input
  if (!name || !email || !message) {
    return res.json({ success: false, message: 'Please fill in all fields.' });
  }
  
  // Skip reCAPTCHA verification for faster response (optional - remove if you want to keep it)
  // You can enable this if spam becomes an issue
  if (process.env.RECAPTCHA_SECRET_KEY && recaptchaToken && false) { // Set to true to enable
    try {
      const verifyURL = `https://www.google.com/recaptcha/api/siteverify`;
      const response = await fetch(verifyURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
      });
      
      const data = await response.json();
      
      if (!data.success) {
        return res.json({ success: false, message: 'reCAPTCHA verification failed. Please try again.' });
      }
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      return res.json({ success: false, message: 'reCAPTCHA verification error.' });
    }
  }
  
  // Send immediate success response, then send email in background
  res.json({ 
    success: true, 
    message: 'Thank you for your message! We\'ll get back to you within 24 hours.' 
  });
  
  // Send email asynchronously (non-blocking)
  if (transporter) {
    setImmediate(async () => {
      try {
    
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `New Contact Form Message from ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><em>- ${process.env.TEAM_SIGNATURE || 'MasterHosting Team'}</em></p>
          `
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully from ${name} (${email})`);
      } catch (error) {
        console.error('❌ Email sending error:', error);
      }
    });
  } else {
    console.warn('⚠️ Email transporter not configured');
  }
});

// AI Chatbot endpoint
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.json({ response: 'Please send a message!' });
  }
  
  const userMessage = message.toLowerCase();
  let response = '';
  
  // AI responses based on keywords
  if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
    response = 'Hello! 👋 Welcome to MasterHosting! How can I help you today?';
  } else if (userMessage.includes('price') || userMessage.includes('cost') || userMessage.includes('how much')) {
    response = 'Great news! MasterHosting is 100% FREE! 🎉 You can host 1-2 websites absolutely free with a free subdomain (yourname.masterhostinig.online). No credit card required!';
  } else if (userMessage.includes('free') || userMessage.includes('pricing')) {
    response = 'Yes! MasterHosting is completely FREE! 🆓 We offer free hosting for 1-2 websites per user, including a free subdomain. No hidden fees, no credit card required!';
  } else if (userMessage.includes('how') || userMessage.includes('start') || userMessage.includes('get started')) {
    response = 'Getting started is easy! Just go to our Contact page and send us a message with your hosting request. Tell us your desired subdomain name and we\'ll set you up! 🚀';
  } else if (userMessage.includes('subdomain') || userMessage.includes('domain')) {
    response = 'Every free hosting plan includes a free subdomain like yourname.masterhostinig.online! Just let us know what subdomain you\'d like when you contact us. 🌐';
  } else if (userMessage.includes('contact') || userMessage.includes('email') || userMessage.includes('support')) {
    response = 'You can contact us through our Contact page or email us at support@masterhostinig.online. We respond within 24 hours! 📧';
  } else if (userMessage.includes('features') || userMessage.includes('what do you offer')) {
    response = 'MasterHosting offers: ✨ Free hosting for 1-2 websites, 🌐 Free subdomain, 🤖 24/7 AI support (that\'s me!), 🔒 Secure hosting, and ⚡ Fast performance!';
  } else if (userMessage.includes('west scranton') || userMessage.includes('scranton')) {
    response = 'West Scranton Intermediate members get special access! Contact Andy at andy@westscranton.edu for enhanced features and priority support! 🎓';
  } else if (userMessage.includes('thank')) {
    response = 'You\'re welcome! Happy to help! 😊 Let me know if you have any other questions!';
  } else if (userMessage.includes('bye') || userMessage.includes('goodbye')) {
    response = 'Goodbye! Thanks for chatting with MasterHosting! Feel free to come back anytime! 👋';
  } else {
    response = 'I\'m here to help! You can ask me about our free hosting, pricing, features, how to get started, or anything else about MasterHosting! 💬';
  }
  
  res.json({ response });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error-404', { 
    title: '404 - Page Not Found',
    page: 'error'
  });
});

// Error handler for rate limiting
app.use((err, req, res, next) => {
  if (err.status === 429) {
    return res.status(429).render('error-429', {
      title: '429 - Too Many Requests',
      page: 'error'
    });
  }
  
  // Generic error handler
  console.error('Error:', err);
  res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MasterHosting server running on http://localhost:${PORT}`);
  console.log(`📧 Email: ${process.env.EMAIL_USER || 'Not configured'}`);
  console.log(`🔐 reCAPTCHA: ${process.env.RECAPTCHA_SITE_KEY ? 'Configured' : 'Not configured'}`);
  console.log(`💰 AdSense: ${process.env.ADSENSE_CLIENT_ID ? 'Configured' : 'Not configured'}`);
});
