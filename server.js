require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
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
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'masterhosting-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    // Check if user is West Scranton member
    const isWestScrantonMember = profile.emails && profile.emails.some(
      email => email.value.includes('westscranton')
    );
    
    const user = {
      id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      firstName: profile.name.givenName,
      photo: profile.photos[0]?.value,
      isWestScrantonMember: isWestScrantonMember
    };
    
    return done(null, user);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Make user available to all templates
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.recaptchaSiteKey = process.env.RECAPTCHA_SITE_KEY || '';
  res.locals.adsenseClientId = process.env.ADSENSE_CLIENT_ID || '';
  next();
});

// ==================== AUTH ROUTES ====================

// Google OAuth login
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// Logout
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) console.error(err);
    res.redirect('/');
  });
});

// ==================== PAGE ROUTES ====================

// Homepage
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'MasterHosting - Free Website Hosting',
    page: 'home'
  });
});

// Dashboard (requires login)
app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/?login=required');
  }
  
  res.render('dashboard', { 
    title: 'Dashboard - MasterHosting',
    page: 'dashboard'
  });
});

// Contact page (requires login)
app.get('/contact', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/?login=required');
  }
  
  res.render('contact', { 
    title: 'Contact Us - MasterHosting',
    page: 'contact'
  });
});

// ==================== API ROUTES ====================

// Contact form submission (requires login + reCAPTCHA)
app.post('/contact', async (req, res) => {
  // Check authentication
  if (!req.isAuthenticated()) {
    return res.json({ success: false, message: 'Please login with Google to send messages.' });
  }
  
  const { message, recaptchaToken } = req.body;
  
  // Verify reCAPTCHA
  if (process.env.RECAPTCHA_SECRET_KEY) {
    try {
      const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
      const response = await fetch(verifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
      });
      
      const data = await response.json();
      
      if (!data.success) {
        return res.json({ success: false, message: 'reCAPTCHA verification failed. Please try again.' });
      }
    } catch (error) {
      console.error('reCAPTCHA error:', error);
      return res.json({ success: false, message: 'Verification error. Please try again.' });
    }
  }
  
  // Send email using Gmail
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: req.user.email,
      subject: `MasterHosting Contact - ${req.user.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${req.user.name}</p>
        <p><strong>Email:</strong> ${req.user.email}</p>
        <p><strong>Google ID:</strong> ${req.user.id}</p>
        <p><strong>West Scranton Member:</strong> ${req.user.isWestScrantonMember ? 'Yes' : 'No'}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>${process.env.TEAM_SIGNATURE || 'MasterHosting Team'}</em></p>
      `
    };

    await transporter.sendMail(mailOptions);
    
    res.json({ 
      success: true, 
      message: 'Message sent successfully! We\'ll respond to your email soon.' 
    });
  } catch (error) {
    console.error('Email error:', error);
    res.json({ 
      success: false, 
      message: 'Failed to send message. Please try again or email us directly.' 
    });
  }
});

// AI Chatbot API (custom, no external API)
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  const userMessage = message.toLowerCase();
  
  // Custom AI responses based on keywords
  let response = '';
  
  if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
    response = 'Hello! 👋 Welcome to MasterHosting! I\'m here to help you 24/7. How can I assist you today?';
  } else if (userMessage.includes('price') || userMessage.includes('cost') || userMessage.includes('free')) {
    response = 'Great news! MasterHosting is completely FREE! 🎉 You can host 1-2 websites with a free subdomain. Just login with Google and contact us to get started!';
  } else if (userMessage.includes('how') && userMessage.includes('work')) {
    response = 'It\'s simple! 1) Login with Google 2) Contact us to request hosting 3) We\'ll set up your subdomain 4) Upload your files and go live! Need help? Just ask!';
  } else if (userMessage.includes('subdomain') || userMessage.includes('domain')) {
    response = 'You\'ll get a free subdomain like yourname.masterhostinig.online! Want a custom domain? Contact us and we can discuss options.';
  } else if (userMessage.includes('contact') || userMessage.includes('email')) {
    response = 'You can contact us through the Contact page (login required) or email us at ' + (process.env.EMAIL_USER || 'support@masterhostinig.online') + '. We respond within 24 hours!';
  } else if (userMessage.includes('west scranton') || userMessage.includes('andy')) {
    response = 'West Scranton Intermediate members get special access! Contact Andy for enhanced features and priority support. 🎓';
  } else if (userMessage.includes('login') || userMessage.includes('sign in')) {
    response = 'Click the "Login with Google" button in the navigation to get started! It\'s quick, secure, and you\'ll have instant access to our services.';
  } else if (userMessage.includes('limit') || userMessage.includes('websites')) {
    response = 'Each user can host 1-2 websites for free! Need more? Contact us and we\'ll see what we can do. 😊';
  } else if (userMessage.includes('support') || userMessage.includes('help')) {
    response = 'I\'m here 24/7 to help! You can also contact our team through the Contact page, and West Scranton members can ask Andy for special assistance.';
  } else if (userMessage.includes('thank')) {
    response = 'You\'re welcome! Happy to help! 😊 Is there anything else you\'d like to know?';
  } else if (userMessage.includes('bye') || userMessage.includes('goodbye')) {
    response = 'Goodbye! Feel free to come back anytime. Have a great day! 👋';
  } else {
    response = 'I\'m here to help! You can ask me about:\n• Free hosting plans\n• How to get started\n• Subdomains\n• Contact information\n• West Scranton member benefits\n\nWhat would you like to know?';
  }
  
  res.json({ response });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { 
    title: '404 - Page Not Found',
    page: '404'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MasterHosting server running on http://localhost:${PORT}`);
  console.log(`📧 Email: ${process.env.EMAIL_USER || 'Not configured'}`);
  console.log(`🔐 Google OAuth: ${process.env.GOOGLE_CLIENT_ID ? 'Configured' : 'Not configured'}`);
});
