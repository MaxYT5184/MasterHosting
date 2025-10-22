require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const supabase = require('./supabase-config');

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
app.get('/admin', async (req, res) => {
  try {
    let orders = [];
    let stats = {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0
    };

    if (supabase) {
      // Fetch all orders from Supabase
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        orders = data || [];
        
        // Calculate stats
        stats.total = orders.length;
        stats.pending = orders.filter(o => o.status === 'pending').length;
        stats.inProgress = orders.filter(o => o.status === 'in_progress').length;
        stats.completed = orders.filter(o => o.status === 'completed').length;
      }
    }

    res.render('admin', { 
      title: 'Admin Dashboard - MasterHosting',
      page: 'admin',
      orders: orders,
      stats: stats,
      description: 'MasterHosting admin dashboard - Manage users, monitor hosting services, and control platform settings.',
      keywords: 'admin dashboard, user management, hosting admin, platform control'
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.render('admin', { 
      title: 'Admin Dashboard - MasterHosting',
      page: 'admin',
      orders: [],
      stats: { total: 0, pending: 0, inProgress: 0, completed: 0 },
      description: 'MasterHosting admin dashboard - Manage users, monitor hosting services, and control platform settings.',
      keywords: 'admin dashboard, user management, hosting admin, platform control'
    });
  }
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

// Order page
app.get('/order', (req, res) => {
  res.render('order', { 
    title: 'Order Free Website - MasterHosting',
    page: 'order',
    recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY || '',
    description: 'Order your free website hosting today! Choose from masterhostinig.online or defendaminecraft.online domains. Fill out our simple form and get your website live in 24-48 hours.',
    keywords: 'order hosting, free website order, get free hosting, website hosting form, order free website, hosting signup, free domain hosting'
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
          to: 'a.tormen2012@gmail.com',
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

// Order form submission (with reCAPTCHA)
app.post('/api/order', async (req, res) => {
  const { 
    fullName, 
    email, 
    discordUsername,
    selectedDomain,
    subdomain,
    websiteType,
    websiteDescription,
    techStack,
    needDatabase,
    needSSL,
    estimatedTraffic,
    githubRepo,
    additionalNotes,
    recaptchaToken 
  } = req.body;
  
  // Validate required fields
  if (!fullName || !email || !selectedDomain || !subdomain || !websiteType || !websiteDescription || !techStack) {
    return res.json({ success: false, message: 'Please fill in all required fields.' });
  }
  
  // Validate subdomain format
  const subdomainRegex = /^[a-z0-9-]+$/;
  if (!subdomainRegex.test(subdomain)) {
    return res.json({ success: false, message: 'Invalid subdomain format. Use only lowercase letters, numbers, and hyphens.' });
  }
  
  // Skip reCAPTCHA verification for faster response (optional - enable if spam becomes an issue)
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
  
  const fullSubdomain = `${subdomain}.${selectedDomain}`;
  
  // Save to Supabase database
  let orderId = null;
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            full_name: fullName,
            email: email,
            discord_username: discordUsername || null,
            selected_domain: selectedDomain,
            subdomain: subdomain,
            full_subdomain: fullSubdomain,
            website_type: websiteType,
            website_description: websiteDescription,
            tech_stack: techStack,
            need_database: needDatabase === 'on' || needDatabase === true,
            need_ssl: needSSL === 'on' || needSSL === true || needSSL !== false,
            estimated_traffic: estimatedTraffic || 'low',
            github_repo: githubRepo || null,
            additional_notes: additionalNotes || null,
            status: 'pending',
            ip_address: req.ip,
            user_agent: req.get('user-agent')
          }
        ])
        .select();
      
      if (error) {
        console.error('❌ Supabase insert error:', error);
      } else {
        orderId = data[0]?.id;
        console.log(`✅ Order saved to Supabase with ID: ${orderId}`);
      }
    } catch (error) {
      console.error('❌ Supabase error:', error);
    }
  }
  
  // Send immediate success response
  res.json({ 
    success: true, 
    message: '🎉 Order received successfully! You\'ll receive a confirmation email shortly. We\'ll set up your website within 24-48 hours!',
    orderId: orderId
  });
  
  // Send email asynchronously (non-blocking)
  if (transporter) {
    setImmediate(async () => {
      try {
        const fullSubdomain = `${subdomain}.${selectedDomain}`;
        
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: 'a.tormen2012@gmail.com',
          subject: `🚀 New Website Order from ${fullName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #6366f1;">🚀 New Website Hosting Order</h2>
              
              <h3 style="color: #4f46e5;">👤 Personal Information</h3>
              <p><strong>Name:</strong> ${fullName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Discord:</strong> ${discordUsername || 'Not provided'}</p>
              
              <h3 style="color: #4f46e5;">🌐 Website Details</h3>
              <p><strong>Full Domain:</strong> <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${fullSubdomain}</code></p>
              <p><strong>Selected Domain:</strong> ${selectedDomain}</p>
              <p><strong>Subdomain:</strong> ${subdomain}</p>
              <p><strong>Website Type:</strong> ${websiteType}</p>
              <p><strong>Description:</strong></p>
              <p style="background: #f9fafb; padding: 12px; border-left: 4px solid #6366f1;">${websiteDescription.replace(/\n/g, '<br>')}</p>
              
              <h3 style="color: #4f46e5;">⚙️ Technical Requirements</h3>
              <p><strong>Technology Stack:</strong> ${techStack}</p>
              <p><strong>Database Needed:</strong> ${needDatabase ? '✅ Yes' : '❌ No'}</p>
              <p><strong>SSL Certificate:</strong> ${needSSL ? '✅ Yes (HTTPS)' : '❌ No'}</p>
              <p><strong>Expected Traffic:</strong> ${estimatedTraffic || 'Not specified'}</p>
              
              <h3 style="color: #4f46e5;">📝 Additional Information</h3>
              <p><strong>GitHub Repository:</strong> ${githubRepo || 'Not provided'}</p>
              <p><strong>Additional Notes:</strong></p>
              <p style="background: #f9fafb; padding: 12px; border-left: 4px solid #6366f1;">${additionalNotes ? additionalNotes.replace(/\n/g, '<br>') : 'None'}</p>
              
              <hr style="margin: 24px 0; border: none; border-top: 2px solid #e5e7eb;">
              
              <p style="color: #6b7280; font-size: 14px;">
                <strong>Next Steps:</strong><br>
                1. Review the order details<br>
                2. Set up hosting environment<br>
                3. Configure subdomain: ${fullSubdomain}<br>
                4. Send credentials to: ${email}<br>
                5. Notify customer when live
              </p>
              
              <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">
                <em>Order received: ${new Date().toLocaleString()}</em>
              </p>
            </div>
          `
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`✅ Order email sent successfully for ${fullSubdomain} (${email})`);
        
        // Send confirmation email to customer
        const customerMailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: '🎉 Your Free Website Order Confirmation - MasterHosting',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #6366f1;">🎉 Order Confirmed!</h2>
              
              <p>Hi ${fullName},</p>
              
              <p>Thank you for ordering your free website with MasterHosting! We've received your order and are excited to get your website up and running.</p>
              
              <div style="background: #f0f9ff; border-left: 4px solid #6366f1; padding: 16px; margin: 24px 0;">
                <h3 style="margin-top: 0; color: #4f46e5;">📋 Order Summary</h3>
                <p><strong>Your Website URL:</strong> <code style="background: white; padding: 4px 8px; border-radius: 4px;">${fullSubdomain}</code></p>
                <p><strong>Website Type:</strong> ${websiteType}</p>
                <p><strong>Technology:</strong> ${techStack}</p>
              </div>
              
              <h3 style="color: #4f46e5;">⏱️ What Happens Next?</h3>
              <ol style="line-height: 1.8;">
                <li><strong>Setup (24-48 hours):</strong> Our team will configure your hosting environment</li>
                <li><strong>Configuration:</strong> We'll set up your subdomain and install necessary software</li>
                <li><strong>Credentials:</strong> You'll receive login details via email</li>
                <li><strong>Go Live:</strong> Your website will be ready to use!</li>
              </ol>
              
              <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 24px 0;">
                <p style="margin: 0;"><strong>💡 Tip:</strong> While you wait, prepare your website files or content. If you provided a GitHub repository, we'll deploy it automatically!</p>
              </div>
              
              <p>If you have any questions, feel free to reply to this email or contact us at <a href="mailto:support@masterhostinig.online">support@masterhostinig.online</a>.</p>
              
              <p style="margin-top: 32px;">
                Best regards,<br>
                <strong>The MasterHosting Team</strong><br>
                <a href="https://masterhostinig.online">masterhostinig.online</a>
              </p>
              
              <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
              
              <p style="color: #6b7280; font-size: 12px;">
                This is an automated confirmation email. Order received on ${new Date().toLocaleString()}.
              </p>
            </div>
          `
        };
        
        await transporter.sendMail(customerMailOptions);
        console.log(`✅ Confirmation email sent to customer: ${email}`);
      } catch (error) {
        console.error('❌ Order email sending error:', error);
      }
    });
  } else {
    console.warn('⚠️ Email transporter not configured - Order received but no email sent');
  }
});

// Update order status (admin only)
app.post('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!supabase) {
    return res.json({ success: false, message: 'Database not configured' });
  }
  
  if (!['pending', 'in_progress', 'completed', 'cancelled'].includes(status)) {
    return res.json({ success: false, message: 'Invalid status' });
  }
  
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: status })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating order status:', error);
      return res.json({ success: false, message: 'Failed to update status' });
    }
    
    res.json({ success: true, message: 'Status updated successfully', order: data[0] });
  } catch (error) {
    console.error('Error updating order:', error);
    res.json({ success: false, message: 'Server error' });
  }
});

// Delete order (admin only)
app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  
  if (!supabase) {
    return res.json({ success: false, message: 'Database not configured' });
  }
  
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting order:', error);
      return res.json({ success: false, message: 'Failed to delete order' });
    }
    
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.json({ success: false, message: 'Server error' });
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
    response = 'Getting started is easy! Just go to our Order page (/order) and fill out the form with your hosting request. Tell us your desired subdomain name and we\'ll set you up! 🚀';
  } else if (userMessage.includes('subdomain') || userMessage.includes('domain')) {
    response = 'Every free hosting plan includes a free subdomain! Choose between masterhostinig.online or defendaminecraft.online. Just let us know what subdomain you\'d like on our Order page! 🌐';
  } else if (userMessage.includes('contact') || userMessage.includes('email') || userMessage.includes('support')) {
    response = 'You can contact us through our Contact page or email us at support@masterhostinig.online. We respond within 24 hours! 📧';
  } else if (userMessage.includes('features') || userMessage.includes('what do you offer')) {
    response = 'MasterHosting offers: ✨ Free hosting for 1-2 websites, 🌐 Free subdomain, 🤖 24/7 AI support (that\'s me!), 🔒 Secure hosting, and ⚡ Fast performance!';
  } else if (userMessage.includes('order') || userMessage.includes('sign up') || userMessage.includes('signup')) {
    response = 'Ready to get started? Visit our Order page at /order to fill out the hosting request form. It only takes a few minutes! 🚀';
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
