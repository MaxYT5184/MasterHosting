# 💰 Google AdSense Setup - Quick Guide

## ✅ Step 1: Meta Tag Added (DONE!)

I've added the verification meta tag to your website:
```html
<meta name="google-adsense-account" content="ca-pub-330927364569464">
```

This is now in `views/layout.ejs` and deployed to Render.

---

## 🚀 Step 2: Update Render Environment Variable

1. Go to your Render dashboard: https://dashboard.render.com
2. Click on your **masterhosting** service
3. Go to **Environment** tab (left sidebar)
4. Find `ADSENSE_CLIENT_ID` variable
5. Update the value to: `ca-pub-330927364569464`
6. Click **Save Changes**
7. Render will automatically redeploy

---

## ✅ Step 3: Verify in AdSense

1. Wait 2-3 minutes for Render to redeploy
2. Go back to the AdSense verification page
3. Make sure the checkbox **"I've placed the HTML <meta> tag"** is checked
4. Click the blue **"Verify"** button
5. AdSense will check your site for the meta tag

---

## 🎯 What Happens Next

After verification:
- ✅ Your site is verified with AdSense
- ✅ AdSense scripts will load on your site (already configured)
- ✅ You can start placing ad units
- ⏳ Wait for AdSense approval (can take a few days)

---

## 📝 Your AdSense ID

**Publisher ID:** `ca-pub-330927364569464`

This is now configured in:
- ✅ `.env` file (local)
- ⏳ Render environment variables (update manually)
- ✅ `layout.ejs` meta tag
- ✅ AdSense script (will load when ADSENSE_CLIENT_ID is set)

---

## 🐛 Troubleshooting

**If verification fails:**
1. Make sure Render deployment completed
2. Visit your site: https://masterhosting.onrender.com
3. View page source (Ctrl+U)
4. Search for "google-adsense-account"
5. Should see: `<meta name="google-adsense-account" content="ca-pub-330927364569464">`

**If you don't see the meta tag:**
1. Check Render deployment logs
2. Make sure the latest commit is deployed
3. Clear browser cache and try again

---

## ✨ You're All Set!

Once you update the Render environment variable and verify in AdSense, you're done!

**Next Steps:**
1. Update `ADSENSE_CLIENT_ID` in Render
2. Wait for redeploy
3. Click "Verify" in AdSense
4. Wait for AdSense approval

Good luck! 💰
