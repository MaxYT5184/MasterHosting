# Deployment Guide for MasterHosting

This guide covers multiple free hosting options for your MasterHosting website.

## 🚀 Quick Deploy Options

### 1. Render.com (Recommended - Easiest)

**Why Render?**
- Free tier available
- Automatic deployments from Git
- Custom domains supported
- SSL certificates included
- Easy setup

**Steps:**
1. Push your code to GitHub
2. Go to https://render.com and sign up
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: masterhosting
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
6. Add environment variables if using email:
   - `EMAIL_USER`: your-email@gmail.com
   - `EMAIL_PASS`: your-app-password
7. Click "Create Web Service"
8. Wait for deployment (5-10 minutes)
9. Your site will be live at: `https://masterhosting.onrender.com`

**Custom Domain:**
- Go to Settings → Custom Domain
- Add `masterhostinig.online`
- Update your domain's DNS:
  - Add CNAME record pointing to your Render URL

---

### 2. Railway.app (Fast & Simple)

**Why Railway?**
- $5 free credit monthly
- Instant deployments
- GitHub integration
- Easy environment variables

**Steps:**
1. Push code to GitHub
2. Go to https://railway.app
3. Click "Start a New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Railway auto-detects Node.js and deploys
7. Add environment variables in Variables tab
8. Get your URL from Settings

**Custom Domain:**
- Settings → Domains → Add Custom Domain
- Enter `masterhostinig.online`
- Update DNS as instructed

---

### 3. Heroku (Classic Option)

**Why Heroku?**
- Well-established platform
- Free tier (with credit card)
- Easy CLI deployment

**Steps:**
1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Login:
   ```bash
   heroku login
   ```
3. Create app:
   ```bash
   heroku create masterhosting
   ```
4. Set environment variables:
   ```bash
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASS=your-app-password
   ```
5. Deploy:
   ```bash
   git push heroku main
   ```
6. Open your app:
   ```bash
   heroku open
   ```

**Custom Domain:**
```bash
heroku domains:add masterhostinig.online
```
Then update your DNS as instructed.

---

### 4. Vercel (Serverless)

**Why Vercel?**
- Free tier
- Fast deployments
- Great for Node.js
- Automatic SSL

**Steps:**
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Deploy:
   ```bash
   vercel
   ```
3. Follow prompts:
   - Link to existing project? No
   - Project name: masterhosting
   - Directory: ./
   - Override settings? No
4. Add environment variables:
   ```bash
   vercel env add EMAIL_USER
   vercel env add EMAIL_PASS
   ```
5. Redeploy:
   ```bash
   vercel --prod
   ```

**Custom Domain:**
- Go to Vercel dashboard
- Project Settings → Domains
- Add `masterhostinig.online`
- Update DNS as shown

---

### 5. DigitalOcean App Platform

**Why DigitalOcean?**
- $200 free credit (60 days)
- Professional infrastructure
- Scalable

**Steps:**
1. Sign up at https://digitalocean.com
2. Go to App Platform
3. Click "Create App"
4. Connect GitHub repository
5. Configure:
   - Resource Type: Web Service
   - Build Command: `npm install`
   - Run Command: `npm start`
   - HTTP Port: 3000
6. Add environment variables
7. Choose plan (Basic - $5/month, but free with credit)
8. Launch app

**Custom Domain:**
- Settings → Domains
- Add `masterhostinig.online`
- Update DNS records

---

## 🌐 Domain Configuration

### DNS Settings for masterhostinig.online

After deploying, update your domain's DNS settings:

**For CNAME (subdomain or with www):**
```
Type: CNAME
Name: www
Value: your-hosting-url.com
TTL: 3600
```

**For A Record (root domain):**
```
Type: A
Name: @
Value: [Your hosting IP]
TTL: 3600
```

**For both www and non-www:**
Add both records above, or set up a redirect.

---

## 📧 Email Configuration

### Using Gmail for Contact Form

1. **Enable 2-Step Verification:**
   - Go to Google Account → Security
   - Enable 2-Step Verification

2. **Create App Password:**
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "MasterHosting"
   - Copy the generated password

3. **Add to Environment Variables:**
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=generated-app-password
   ```

### Alternative: SendGrid (Recommended for Production)

1. Sign up at https://sendgrid.com (Free tier: 100 emails/day)
2. Get API key
3. Update `server.js` to use SendGrid instead of Gmail
4. Add `SENDGRID_API_KEY` to environment variables

---

## 🔒 SSL/HTTPS

All recommended platforms provide free SSL certificates automatically:
- ✅ Render: Automatic
- ✅ Railway: Automatic
- ✅ Heroku: Automatic
- ✅ Vercel: Automatic
- ✅ DigitalOcean: Automatic

---

## 📊 Monitoring & Analytics

### Add Google Analytics

1. Get tracking ID from https://analytics.google.com
2. Add to `views/layout.ejs` before `</head>`:
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'YOUR-GA-ID');
   </script>
   ```

---

## 🚨 Troubleshooting

### Build Fails
- Check Node.js version in `package.json`
- Ensure all dependencies are in `package.json`
- Check build logs for errors

### App Crashes
- Check environment variables are set
- Review application logs
- Ensure PORT is not hardcoded (use `process.env.PORT`)

### Domain Not Working
- Wait for DNS propagation (up to 48 hours)
- Check DNS settings with https://dnschecker.org
- Ensure SSL certificate is active

### Email Not Sending
- Verify environment variables
- Check email credentials
- Review server logs for errors
- Consider using SendGrid instead of Gmail

---

## 🎯 Recommended Setup

**For Best Results:**

1. **Hosting**: Render.com (easiest) or Railway.app (fastest)
2. **Email**: SendGrid (more reliable than Gmail)
3. **Analytics**: Google Analytics
4. **Monitoring**: UptimeRobot (free uptime monitoring)
5. **Domain**: Point to hosting via CNAME

---

## 📝 Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Logo and favicon added to `/public/images/`
- [ ] Email credentials ready (if using contact form)
- [ ] Domain DNS access ready
- [ ] Environment variables documented
- [ ] Test locally: `npm start`
- [ ] All placeholder content updated
- [ ] Social media links updated
- [ ] Contact email updated in footer

---

## 🎉 Post-Deployment

After successful deployment:

1. **Test Everything:**
   - Homepage loads correctly
   - All navigation links work
   - Contact form submits
   - Mobile responsive
   - All images load

2. **Set Up Monitoring:**
   - UptimeRobot for uptime monitoring
   - Google Analytics for traffic
   - Google Search Console for SEO

3. **Marketing:**
   - Submit to search engines
   - Share on social media
   - Update business listings

---

## 💡 Tips

- **Free Tier Limitations**: Most free tiers sleep after inactivity. Consider upgrading for production.
- **Backups**: Keep your code in GitHub for easy rollbacks
- **Updates**: Use CI/CD for automatic deployments on push
- **Security**: Never commit `.env` file to Git
- **Performance**: Use CDN for images if needed

---

## 📞 Need Help?

- Check platform documentation
- Review deployment logs
- Test locally first
- Contact platform support

Good luck with your deployment! 🚀
