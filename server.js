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

// Rate limiting with detailed logging
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs (increased for monitoring services)
  
  // Standardized message
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  
  // Custom handler with logging
  handler: (req, res, next, options) => {
    console.error('🚫 429 ERROR - Too Many Requests');
    console.error('  IP:', req.ip);
    console.error('  Path:', req.path);
    console.error('  Method:', req.method);
    console.error('  User-Agent:', req.get('user-agent'));
    console.error('  Time:', new Date().toISOString());
    console.error('  Limit:', options.max, 'requests per', options.windowMs / 60000, 'minutes');
    console.error('---');
    
    res.status(429).render('error-429', {
      title: '429 - Too Many Requests',
      page: 'error'
    });
  },
  
  // Skip rate limiting for health checks
  skip: (req) => {
    const isHealthCheck = req.path === '/health';
    if (isHealthCheck) {
      console.log('✅ Skipping rate limit for health check');
    }
    return isHealthCheck;
  }
});

// Log all requests to track patterns
app.use((req, res, next) => {
  console.log(`📊 ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
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
    page: 'home',
    description: 'Get free website hosting with custom subdomains! Host 1-2 websites absolutely free with 24/7 support, 99.9% uptime, and easy setup. Start hosting today!',
    keywords: 'free web hosting, free website hosting, custom subdomain, free domain hosting, website hosting free, free hosting service, web hosting'
  });
});

// Info / About the Creator
app.get('/info', (req, res) => {
  res.render('info', { 
    title: 'About the Creator - MasterHosting',
    page: 'info',
    description: 'Learn about Andy T (Max Crafter YT), the high school student behind MasterHosting, providing free hosting with no scams.',
    keywords: 'Andy T, Max Crafter YT, MasterHosting creator, free hosting, student entrepreneur'
  });
});

// Login page
app.get('/login', (req, res) => {
  res.render('login', { 
    title: 'Login - MasterHosting',
    page: 'login',
    description: 'Login to your MasterHosting account to manage your free websites, access hosting dashboard, and control your custom subdomains.',
    keywords: 'login, sign in, account login, hosting login, website management, dashboard access'
  });
});

// Admin Dashboard
app.get('/admin', (req, res) => {
  res.render('admin', { 
    title: 'Admin Dashboard - MasterHosting',
    page: 'admin',
    description: 'MasterHosting admin dashboard - Manage users, monitor hosting services, and control platform settings.',
    keywords: 'admin dashboard, user management, hosting admin, platform control'
  });
});

// Profile page
app.get('/profile', (req, res) => {
  res.render('profile', { 
    title: 'My Profile - MasterHosting',
    page: 'profile',
    description: 'View and manage your MasterHosting profile, account settings, and hosting information.',
    keywords: 'user profile, account settings, profile management, hosting account'
  });
});

// Contact page (protected - requires login)
app.get('/contact', (req, res) => {
  // Check for auth query parameter - must be exactly 'true' from client-side auth
  const isAuthenticated = req.query.auth === 'true';
  
  res.render('contact', { 
    title: 'Contact Us - MasterHosting',
    page: 'contact',
    recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY || '',
    requireAuth: true,
    isAuthenticated: isAuthenticated,
    description: 'Contact MasterHosting support team for hosting questions, technical support, or general inquiries. We\'re here to help 24/7!',
    keywords: 'contact support, hosting support, customer service, technical support, help desk, contact us'
  });
});

// Privacy Policy page
app.get('/privacy', (req, res) => {
  res.render('privacy', { 
    title: 'Privacy Policy - MasterHosting',
    page: 'privacy',
    description: 'MasterHosting Privacy Policy - Learn how we protect your data, handle user information, and ensure privacy in our hosting services.',
    keywords: 'privacy policy, data protection, user privacy, data security, privacy terms'
  });
});

// Terms of Service page
app.get('/terms', (req, res) => {
  res.render('terms', { 
    title: 'Terms of Service - MasterHosting',
    page: 'terms',
    description: 'Read MasterHosting Terms of Service - Understand our hosting policies, user agreements, and service terms for free website hosting.',
    keywords: 'terms of service, user agreement, hosting terms, service policy, legal terms'
  });
});

// About page
app.get('/about', (req, res) => {
  res.render('about', { 
    title: 'About Us - MasterHosting',
    page: 'about',
    description: 'Learn about MasterHosting - Your trusted free website hosting provider. Discover our mission, features, and commitment to providing quality hosting services.',
    keywords: 'about us, hosting company, free hosting provider, web hosting service, company information'
  });
});

// Info page (About the Creator)
app.get('/info', (req, res) => {
  res.render('info', { 
    title: 'About the Creator - MasterHosting',
    page: 'info',
    description: 'Meet Andy T (Max Crafter YT), the high school student behind MasterHosting. Learn about our mission to provide 100% free website hosting with no scams or hidden fees.',
    keywords: 'Andy T, Max Crafter YT, MasterHosting creator, free hosting founder, student entrepreneur, anti-scam hosting, about creator'
  });
});

// Update Log page
app.get('/updates', (req, res) => {
  res.render('updates', { 
    title: 'Latest Updates - MasterHosting',
    page: 'updates',
    description: 'Stay updated with the latest MasterHosting news, features, improvements, and announcements. Check out our changelog and new releases.',
    keywords: 'updates, changelog, news, announcements, new features, hosting updates, platform news'
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

// Serve sitemap.xml file
app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
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
} else {
  console.warn('⚠️ Email transporter not initialized. Missing EMAIL_USER or EMAIL_PASS in environment.');
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
        const recipientEmail = process.env.EMAIL_TO || process.env.EMAIL_USER;
        if (!recipientEmail) {
          console.error('❌ EMAIL_TO and EMAIL_USER are both undefined. Unable to send contact email.');
          return;
        }

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: recipientEmail,
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

// Error logging endpoint
app.post('/api/log-error', (req, res) => {
  const { type, error, message, email } = req.body;
  
  console.error('🔥 Firebase Auth Error:');
  console.error('  Type:', type);
  console.error('  Error Code:', error);
  console.error('  Message:', message);
  console.error('  Email:', email);
  console.error('  Timestamp:', new Date().toISOString());
  console.error('---');
  
  res.json({ success: true });
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

// Keep-alive endpoint for uptime monitoring
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Rate limit status endpoint (for debugging)
app.get('/api/rate-limit-status', (req, res) => {
  res.json({
    ip: req.ip,
    rateLimit: {
      limit: 500,
      windowMinutes: 15,
      message: 'Check server logs for detailed rate limit information'
    }
  });
});

// Self-ping to prevent Render spin-down (every 10 minutes)
if (process.env.NODE_ENV === 'production') {
  const https = require('https');
  const SITE_URL = process.env.SITE_URL || 'https://masterhostinig.online';
  
  setInterval(() => {
    https.get(`${SITE_URL}/health`, (res) => {
      console.log(`✅ Keep-alive ping - Status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error('❌ Keep-alive ping failed:', err.message);
    });
  }, 10 * 60 * 1000); // Every 10 minutes
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MasterHosting server running on http://localhost:${PORT}`);
  console.log(`📧 Email: ${process.env.EMAIL_USER || 'Not configured'}`);
  console.log(`🔐 reCAPTCHA: ${process.env.RECAPTCHA_SITE_KEY ? 'Configured' : 'Not configured'}`);
  console.log(`💰 AdSense: ${process.env.ADSENSE_CLIENT_ID ? 'Configured' : 'Not configured'}`);
  console.log(`⏱️  Keep-alive: ${process.env.NODE_ENV === 'production' ? 'Enabled' : 'Disabled (dev mode)'}`);
});
