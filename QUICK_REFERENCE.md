# 🚀 MasterHosting V2.0 - Quick Reference

## 📋 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

---

## 🔑 Required Credentials

### 1. Google OAuth
- **Get from:** [Google Cloud Console](https://console.cloud.google.com/)
- **Variables:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

### 2. Gmail App Password
- **Get from:** [Google Account Security](https://myaccount.google.com/security)
- **Variables:** `EMAIL_USER`, `EMAIL_PASS`

### 3. Google reCAPTCHA
- **Get from:** [reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
- **Variables:** `RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`

### 4. Google AdSense (Optional)
- **Get from:** [Google AdSense](https://www.google.com/adsense/)
- **Variable:** `ADSENSE_CLIENT_ID`

---

## 🎯 Key Features

| Feature | Description | Access |
|---------|-------------|--------|
| **Free Hosting** | 1-2 websites per user | All users |
| **Google Login** | Secure OAuth authentication | All users |
| **AI Chatbot** | 24/7 custom support | All users |
| **Dashboard** | User account management | Logged-in users |
| **Contact Form** | Email with reCAPTCHA | Logged-in users |
| **Welcome Banner** | Personalized greeting | Logged-in users |
| **West Scranton** | Special member access | @westscranton emails |
| **AdSense** | Monetization | Site-wide |

---

## 🌐 Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Homepage | No |
| `/auth/google` | Google login | No |
| `/dashboard` | User dashboard | Yes |
| `/contact` | Contact form | Yes |
| `/logout` | Logout | Yes |
| `/api/chat` | AI chatbot API | No |

---

## 🔧 Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Google OAuth
GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Session
SESSION_SECRET=random-32-char-string

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=16-char-app-password

# reCAPTCHA
RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key

# AdSense (optional)
ADSENSE_CLIENT_ID=ca-pub-your-id

# Team
TEAM_SIGNATURE=MasterHosting Team
WEST_SCRANTON_ADMIN_EMAIL=andy@westscranton.edu

# Production
PRODUCTION_URL=https://your-app.onrender.com
```

---

## 📁 Project Structure

```
Max-Crafter-YT/
├── server.js                 # Main server with OAuth & AI
├── package.json              # Dependencies
├── .env                      # Your credentials (DO NOT COMMIT)
├── .env.example              # Template
├── views/
│   ├── layout.ejs           # Header, footer, nav, chatbot
│   ├── index.ejs            # Homepage (FREE hosting)
│   ├── dashboard.ejs        # User dashboard
│   ├── contact.ejs          # Contact form (reCAPTCHA)
│   └── 404.ejs              # Error page
├── public/
│   ├── css/style.css        # All styles + new features
│   ├── js/main.js           # Chatbot + form handling
│   └── images/              # Logo, favicon
└── docs/
    ├── SETUP_GUIDE_V2.md    # Complete setup guide
    ├── QUICK_REFERENCE.md   # This file
    └── README.md            # Project overview
```

---

## 🎨 Customization Points

### Change Colors
Edit `/public/css/style.css` (lines 4-20)

### Modify AI Responses
Edit `server.js` (lines 228-261)

### Update Team Signature
Edit `.env`: `TEAM_SIGNATURE=Your Team`

### West Scranton Detection
Edit `server.js` (lines 57-59)

---

## 🧪 Testing Checklist

- [ ] `npm install` completes successfully
- [ ] Server starts without errors
- [ ] Homepage loads
- [ ] Google login works
- [ ] Redirects to dashboard after login
- [ ] Welcome banner shows user name
- [ ] AI chatbot responds
- [ ] Contact page requires login
- [ ] reCAPTCHA appears on contact form
- [ ] Email sends to Gmail
- [ ] Logout works
- [ ] West Scranton badge shows (if applicable)

---

## 🚀 Deployment Checklist

### Before Deployment
- [ ] All credentials in `.env`
- [ ] Test locally
- [ ] `.env` in `.gitignore`
- [ ] Code committed to GitHub

### On Render.com
- [ ] Create Web Service
- [ ] Connect GitHub repo
- [ ] Add all environment variables
- [ ] Update callback URLs
- [ ] Deploy

### After Deployment
- [ ] Update Google OAuth redirect URIs
- [ ] Update reCAPTCHA domains
- [ ] Test live site
- [ ] Point domain DNS

---

## 🐛 Common Issues

### "Google OAuth Error"
→ Check redirect URIs match exactly

### "Email not sending"
→ Verify Gmail App Password (16 chars, no spaces)

### "reCAPTCHA not showing"
→ Check site key and domain settings

### "Session not persisting"
→ Set `SESSION_SECRET` in `.env`

### "Chatbot not responding"
→ Check `/api/chat` endpoint in browser console

---

## 📞 Support Resources

- **Setup Guide:** `SETUP_GUIDE_V2.md`
- **AI Chatbot:** Click button on site
- **Server Logs:** Check terminal output
- **Render Logs:** Dashboard → Logs tab

---

## 🎯 Quick Commands

```bash
# Generate session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Test AI chatbot
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"hello"}'

# Check if server is running
curl http://localhost:3000

# View logs
npm start 2>&1 | tee server.log
```

---

## ✨ Feature Highlights

### 🆓 100% Free Hosting
- No credit card required
- 1-2 websites per user
- Free subdomain included

### 🔐 Secure Google Login
- OAuth 2.0 authentication
- No password management
- Automatic user detection

### 🤖 Custom AI Chatbot
- No external API needed
- Instant responses
- 24/7 availability
- Keyword-based intelligence

### 📧 Smart Contact Form
- Requires login (spam prevention)
- reCAPTCHA protection
- Sends to your Gmail
- User info auto-filled

### 🎓 West Scranton Benefits
- Auto-detected by email
- Special badge display
- Premium access mention
- Contact Andy for enhanced features

---

## 🎉 You're Ready!

Follow `SETUP_GUIDE_V2.md` for detailed instructions.

**Happy Hosting!** 🚀
