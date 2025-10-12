# 🔑 MasterHosting Credentials Checklist

## ✅ Your .env file has been created!

Location: `/home/max/Desktop/Max-Crafter-YT/.env`

Your domain: **https://masterhostinig.online**

---

## 📋 What You Need to Fill In

### 1. ✅ **Google OAuth** (REQUIRED)
**Status:** ⏳ In Progress

**Get from:** https://console.cloud.google.com/

**Steps:**
1. Create project "MasterHosting"
2. Enable Google+ API
3. Configure OAuth consent screen
4. Create OAuth Client ID (Web application)
5. Add these URIs:
   - **JavaScript origins:**
     - `http://localhost:3000`
     - `https://masterhostinig.online`
   - **Redirect URIs:**
     - `http://localhost:3000/auth/google/callback`
     - `https://masterhostinig.online/auth/google/callback`
6. Copy Client ID and Secret

**Fill in .env:**
```env
GOOGLE_CLIENT_ID=your-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret-here
```

---

### 2. ⏳ **Session Secret** (REQUIRED)

**Generate with this command:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Fill in .env:**
```env
SESSION_SECRET=paste-generated-string-here
```

---

### 3. ⏳ **Gmail App Password** (REQUIRED)

**Get from:** https://myaccount.google.com/security

**Steps:**
1. Enable 2-Step Verification
2. Go to "App passwords"
3. Select app: **Mail**
4. Select device: **Other (Custom name)** → "MasterHosting"
5. Click Generate
6. Copy the 16-character password (remove spaces)

**Fill in .env:**
```env
EMAIL_USER=your-alt-email@gmail.com
EMAIL_PASS=abcdefghijklmnop
```

---

### 4. ⏳ **Google reCAPTCHA** (REQUIRED)

**Get from:** https://www.google.com/recaptcha/admin

**Steps:**
1. Click "+" to register a new site
2. Label: **MasterHosting**
3. reCAPTCHA type: **reCAPTCHA v2** → "I'm not a robot" Checkbox
4. Domains:
   - `localhost`
   - `masterhostinig.online`
5. Accept terms and Submit
6. Copy Site Key and Secret Key

**Fill in .env:**
```env
RECAPTCHA_SITE_KEY=your-site-key-here
RECAPTCHA_SECRET_KEY=your-secret-key-here
```

---

### 5. 🎯 **Google AdSense** (OPTIONAL)

**Get from:** https://www.google.com/adsense/

**Steps:**
1. Sign up for AdSense
2. Get approved (may take a few days)
3. Copy your Publisher ID (format: ca-pub-1234567890123456)

**Fill in .env:**
```env
ADSENSE_CLIENT_ID=ca-pub-your-id-here
```

**Note:** Leave blank for now if you don't have AdSense yet.

---

## 🚀 Quick Start Order

### **Do These First (Required for Testing):**

1. **Google OAuth** ← You're here now!
2. **Session Secret** (1 minute - just run the command)
3. **Gmail App Password** (5 minutes)
4. **Google reCAPTCHA** (5 minutes)

### **Do Later (Optional):**

5. **Google AdSense** (can add anytime)

---

## 🧪 Testing Checklist

Once you've filled in the required credentials:

```bash
# 1. Install dependencies
npm install

# 2. Start server
npm start

# 3. Open browser
# Visit: http://localhost:3000
```

**Test these features:**
- [ ] Homepage loads
- [ ] Click "Login with Google" → redirects to Google
- [ ] Login with your Google account → redirects to dashboard
- [ ] Welcome banner shows your name
- [ ] Click chatbot (bottom right) → responds to messages
- [ ] Go to Contact page → form has reCAPTCHA
- [ ] Submit contact form → email arrives in your Gmail
- [ ] Logout works

---

## 📝 Current Status

Your `.env` file is ready with:
- ✅ Domain set to `masterhostinig.online`
- ✅ Production URL configured
- ✅ Team signature set
- ✅ West Scranton email configured
- ⏳ Waiting for Google OAuth credentials
- ⏳ Waiting for Session Secret
- ⏳ Waiting for Gmail App Password
- ⏳ Waiting for reCAPTCHA keys
- 🎯 AdSense optional (can add later)

---

## 🔒 Security Reminders

- ✅ `.env` is in `.gitignore` (won't be committed to Git)
- ⚠️ **NEVER** share your `.env` file
- ⚠️ **NEVER** commit `.env` to GitHub
- ✅ Keep credentials secure
- ✅ Use different passwords for each service

---

## 🎯 Next Steps

**Right now, you're setting up Google OAuth.**

Once you have your Client ID and Secret from Google Cloud Console:

1. Open `.env` file
2. Replace `YOUR_CLIENT_ID_HERE` with your actual Client ID
3. Replace `YOUR_CLIENT_SECRET_HERE` with your actual Client Secret
4. Save the file

Then we'll move on to generating the Session Secret! 🔐

---

## 💡 Pro Tips

- **Test locally first** before deploying
- **Keep a backup** of your credentials in a secure password manager
- **Update OAuth URIs** when you deploy to production
- **Monitor Gmail quota** (500 emails/day limit)

---

## 📞 Need Help?

If you get stuck on any step, let me know:
- Which credential you're setting up
- What error you're seeing
- Where you're stuck in the process

I'll guide you through it! 🚀
