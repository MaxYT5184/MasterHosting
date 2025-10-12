# 🚀 MasterHosting V2.0 - Complete Setup Guide

## 🎉 What's New in V2.0

- ✅ **FREE Hosting** - No more paid plans! Everyone gets 1-2 free websites
- ✅ **Google OAuth Login** - Secure authentication with Google accounts
- ✅ **Custom AI Chatbot** - 24/7 support with no external API needed
- ✅ **Google reCAPTCHA** - Spam protection on contact form
- ✅ **Welcome Banner** - Personalized greeting for logged-in users
- ✅ **User Dashboard** - Manage hosting and view account info
- ✅ **Gmail Integration** - Contact form sends to your Gmail
- ✅ **Team Signature** - Professional email signatures
- ✅ **West Scranton Special Access** - Enhanced features for members
- ✅ **Google AdSense** - Monetize your website
- ✅ **Login Required** - Contact page requires Google login

---

## 📋 Prerequisites

1. **Node.js** (v14 or higher)
2. **Gmail Account** (for receiving contact form emails)
3. **Google Cloud Account** (for OAuth)
4. **Google reCAPTCHA Account** (free)
5. **Google AdSense Account** (optional, for monetization)

---

## 🔧 Step-by-Step Setup

### Step 1: Install Dependencies

```bash
cd /home/max/Desktop/Max-Crafter-YT
npm install
```

This will install all new packages:
- `passport` - Authentication
- `passport-google-oauth20` - Google OAuth
- `express-session` - Session management
- `dotenv` - Environment variables
- `cookie-parser` - Cookie handling
- `helmet` - Security
- `express-rate-limit` - Rate limiting

---

### Step 2: Set Up Google OAuth

#### A. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: **"MasterHosting"**
3. Enable **Google+ API**

#### B. Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. Configure consent screen:
   - App name: **MasterHosting**
   - User support email: Your email
   - Developer contact: Your email
4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: **MasterHosting Web Client**
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `https://your-app.onrender.com` (add after deployment)
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/google/callback`
     - `https://your-app.onrender.com/auth/google/callback`
5. **Copy** the Client ID and Client Secret

---

### Step 3: Set Up Gmail for Contact Form

#### A. Enable 2-Step Verification

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**

#### B. Create App Password

1. Go to **Security** → **2-Step Verification** → **App passwords**
2. Select:
   - App: **Mail**
   - Device: **Other (Custom name)**
   - Name: **MasterHosting**
3. Click **Generate**
4. **Copy** the 16-character password (remove spaces)

---

### Step 4: Set Up Google reCAPTCHA

1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Register a new site:
   - Label: **MasterHosting**
   - reCAPTCHA type: **reCAPTCHA v2** → "I'm not a robot" Checkbox
   - Domains:
     - `localhost`
     - `your-app.onrender.com` (add after deployment)
3. Accept terms and submit
4. **Copy** the Site Key and Secret Key

---

### Step 5: Set Up Google AdSense (Optional)

1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Sign up and get approved
3. Get your **Publisher ID** (starts with `ca-pub-`)

---

### Step 6: Configure Environment Variables

1. Copy the example file:
```bash
cp .env.example .env
```

2. Edit `.env` with your credentials:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Session Secret (generate a random string)
SESSION_SECRET=your-super-secret-random-string-change-this

# Email Configuration (Gmail)
EMAIL_USER=your-alt-email@gmail.com
EMAIL_PASS=your-16-char-app-password

# Google reCAPTCHA v2
RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# Google AdSense
ADSENSE_CLIENT_ID=ca-pub-your-adsense-id

# Team Configuration
TEAM_SIGNATURE=MasterHosting Team
WEST_SCRANTON_ADMIN_EMAIL=andy@westscranton.edu

# Render.com Production URL (update after deployment)
PRODUCTION_URL=https://your-app.onrender.com
```

**Important:** Replace ALL placeholder values with your actual credentials!

---

### Step 7: Generate Session Secret

Generate a secure random string for `SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your `SESSION_SECRET` in `.env`

---

### Step 8: Test Locally

```bash
npm start
```

Visit: `http://localhost:3000`

**Test Checklist:**
- [ ] Homepage loads
- [ ] "Login with Google" button appears
- [ ] Click login → redirects to Google
- [ ] After login → redirects to dashboard
- [ ] Welcome banner shows your name
- [ ] AI chatbot opens and responds
- [ ] Contact page requires login
- [ ] Contact form has reCAPTCHA
- [ ] Form submission sends email to your Gmail
- [ ] Logout works

---

## 🌐 Deployment to Render.com

### Step 1: Prepare for Deployment

1. **Commit your code to GitHub:**
```bash
git init
git add .
git commit -m "MasterHosting V2.0 - Free hosting with Google Auth"
git branch -M main
git remote add origin https://github.com/yourusername/masterhosting.git
git push -u origin main
```

**IMPORTANT:** Make sure `.env` is in `.gitignore` (it already is)!

---

### Step 2: Deploy to Render

1. Go to [Render.com](https://render.com)
2. Sign up/Login
3. Click **New +** → **Web Service**
4. Connect your GitHub repository
5. Configure:
   - **Name:** `masterhosting`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

---

### Step 3: Add Environment Variables on Render

In Render dashboard, go to **Environment** and add ALL variables from your `.env` file:

```
PORT=3000
NODE_ENV=production
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://masterhosting.onrender.com/auth/google/callback
SESSION_SECRET=...
EMAIL_USER=...
EMAIL_PASS=...
RECAPTCHA_SITE_KEY=...
RECAPTCHA_SECRET_KEY=...
ADSENSE_CLIENT_ID=...
TEAM_SIGNATURE=MasterHosting Team
WEST_SCRANTON_ADMIN_EMAIL=andy@westscranton.edu
PRODUCTION_URL=https://masterhosting.onrender.com
```

**Important:** Update `GOOGLE_CALLBACK_URL` and `PRODUCTION_URL` with your actual Render URL!

---

### Step 4: Update Google OAuth Settings

1. Go back to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add to **Authorized JavaScript origins:**
   - `https://masterhosting.onrender.com`
5. Add to **Authorized redirect URIs:**
   - `https://masterhosting.onrender.com/auth/google/callback`
6. Save

---

### Step 5: Update reCAPTCHA Settings

1. Go to [reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Edit your site
3. Add domain: `masterhosting.onrender.com`
4. Save

---

### Step 6: Deploy!

1. Click **Create Web Service** on Render
2. Wait for deployment (5-10 minutes)
3. Your site will be live at: `https://masterhosting.onrender.com`

---

## 🎯 Point Your Domain

### Update DNS for masterhostinig.online

1. Go to your domain registrar
2. Add CNAME record:
   - **Type:** CNAME
   - **Name:** @ or www
   - **Value:** masterhosting.onrender.com
   - **TTL:** 3600

3. In Render dashboard:
   - Go to **Settings** → **Custom Domains**
   - Add `masterhostinig.online`
   - Follow instructions

---

## 🧪 Testing the New Features

### Test Google Login
1. Click "Login with Google"
2. Select your Google account
3. Should redirect to dashboard
4. Welcome banner should show your name

### Test AI Chatbot
1. Click the chatbot button (bottom right)
2. Type: "hello"
3. Should get instant AI response
4. Try: "how much does it cost?"
5. Should say it's FREE

### Test Contact Form
1. Logout and try to access `/contact`
2. Should redirect to homepage with login message
3. Login with Google
4. Go to contact page
5. Fill out message
6. Complete reCAPTCHA
7. Submit
8. Check your Gmail for the message

### Test West Scranton Member
1. Login with a `@westscranton` email
2. Should see special badge
3. Dashboard shows "Premium Access"

---

## 🔒 Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] Never commit `.env` to Git
- [ ] Use strong SESSION_SECRET
- [ ] Gmail App Password (not regular password)
- [ ] reCAPTCHA enabled on contact form
- [ ] Rate limiting enabled (100 requests per 15 min)
- [ ] Helmet.js security headers enabled
- [ ] HTTPS enabled in production (automatic on Render)

---

## 🎨 Customization

### Change Team Signature
Edit `.env`:
```env
TEAM_SIGNATURE=Your Custom Signature
```

### Change West Scranton Admin Email
Edit `.env`:
```env
WEST_SCRANTON_ADMIN_EMAIL=different-admin@example.com
```

### Customize AI Responses
Edit `server.js` lines 228-261 to add more responses

### Add More AI Keywords
Add new conditions in the chatbot logic:
```javascript
else if (userMessage.includes('your-keyword')) {
    response = 'Your custom response';
}
```

---

## 📊 Features Overview

### For All Users
- Free hosting (1-2 websites)
- Free subdomain
- Google login
- 24/7 AI chatbot
- Contact form
- Dashboard

### For West Scranton Members
- Special badge
- Priority support mention
- Enhanced features notice
- Contact Andy for premium access

---

## 🐛 Troubleshooting

### Google Login Not Working
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Verify redirect URIs in Google Cloud Console
- Make sure callback URL matches exactly

### Email Not Sending
- Verify Gmail App Password (16 characters, no spaces)
- Check `EMAIL_USER` and `EMAIL_PASS`
- Make sure 2-Step Verification is enabled

### reCAPTCHA Not Showing
- Check `RECAPTCHA_SITE_KEY` is correct
- Verify domain is added in reCAPTCHA admin
- Check browser console for errors

### Chatbot Not Responding
- Check browser console for errors
- Verify `/api/chat` endpoint is working
- Test with: `curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"message":"hello"}'`

### Session Not Persisting
- Check `SESSION_SECRET` is set
- Verify cookies are enabled
- In production, make sure `NODE_ENV=production`

---

## 📝 Important Notes

1. **Free Tier Limitations:**
   - Render free tier sleeps after 15 min of inactivity
   - First request after sleep takes ~30 seconds
   - Consider upgrading for production

2. **Gmail Sending Limits:**
   - Free Gmail: 500 emails/day
   - Consider SendGrid for higher volume

3. **reCAPTCHA:**
   - v2 Checkbox is user-friendly
   - v3 is invisible but may need score tuning

4. **West Scranton Detection:**
   - Checks if email contains "westscranton"
   - Customize in `server.js` line 57-59

---

## 🎉 You're All Set!

Your MasterHosting V2.0 is ready to go! 

**Next Steps:**
1. Complete all setup steps above
2. Test locally thoroughly
3. Deploy to Render.com
4. Point your domain
5. Start hosting websites for free!

---

## 📞 Need Help?

- Check the AI chatbot on your site
- Review server logs for errors
- Check Render deployment logs
- Verify all environment variables

**Happy Hosting!** 🚀
