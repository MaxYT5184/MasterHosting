# 🔧 Fix Google OAuth Scope Errors

## ⚠️ The Problem

Google is showing warnings because your OAuth consent screen has sensitive/restricted scopes configured that you don't actually need.

You only need:
- ✅ `profile` (basic profile info)
- ✅ `email` (email address)

You DON'T need any of these (they're causing the errors):
- ❌ BigQuery scopes
- ❌ Cloud Platform scopes
- ❌ Cloud Storage scopes
- ❌ Developer Console scopes
- ❌ Any other Google service scopes

---

## 🔧 Fix in Google Cloud Console

### **Step 1: Go to OAuth Consent Screen**

1. Open: **https://console.cloud.google.com/**
2. Select **MasterHosting** project
3. Go to **"APIs & Services"** → **"OAuth consent screen"**

### **Step 2: Edit App**

Click **"EDIT APP"** button

### **Step 3: Go to Scopes Section**

1. Click **"SAVE AND CONTINUE"** on the first page (App information)
2. You'll reach the **"Scopes"** page

### **Step 4: Remove All Sensitive Scopes**

On the Scopes page:

1. Look at the **"Your sensitive scopes"** or **"Your restricted scopes"** section
2. You should see a list of scopes with **REMOVE** buttons
3. **Click REMOVE on ALL of them** except:
   - ✅ Keep: `.../auth/userinfo.email`
   - ✅ Keep: `.../auth/userinfo.profile`  
   - ✅ Keep: `openid`
   - ❌ Remove everything else (BigQuery, Cloud Platform, Storage, etc.)

### **Step 5: Verify Only These Scopes Remain**

After removing, you should ONLY have these 3 scopes:

```
✅ .../auth/userinfo.email
✅ .../auth/userinfo.profile
✅ openid
```

**All other scopes should be REMOVED!**

### **Step 6: Save**

1. Click **"UPDATE"** or **"SAVE"**
2. Click **"SAVE AND CONTINUE"**
3. Continue through remaining screens
4. Click **"BACK TO DASHBOARD"**

---

## 🎯 Why This Happens

The error occurs when:
- You accidentally added extra scopes during setup
- Google Cloud Console auto-suggested scopes you don't need
- Previous testing added unnecessary permissions

**Solution:** Only keep the 3 basic scopes listed above!

---

## ✅ What You Should See After Fixing

In the OAuth consent screen, under **"Scopes for Google APIs"**, you should see:

**Non-sensitive scopes:**
- `.../auth/userinfo.email` - See your primary Google Account email address
- `.../auth/userinfo.profile` - See your personal info, including any personal info you've made publicly available
- `openid` - Associate you with your personal info on Google

**Sensitive scopes:** (should be EMPTY)
- Nothing here!

---

## 🧪 Test After Fixing

1. Wait 5-10 minutes for changes to propagate
2. Go to your website
3. Click "Login with Google"
4. Should work without warnings! ✨

---

## 📝 Our App Only Needs

We only use Google OAuth for:
- ✅ User's name
- ✅ User's email address
- ✅ User's profile photo

We DON'T need access to:
- ❌ Google Drive
- ❌ Gmail
- ❌ Google Cloud services
- ❌ BigQuery
- ❌ Cloud Storage
- ❌ Any other Google services

---

## 🔒 Privacy Compliance

By using only basic scopes:
- ✅ Faster OAuth approval
- ✅ Users trust your app more
- ✅ No verification required
- ✅ Complies with Google's Limited Use policy
- ✅ No security review needed

---

## 🚨 If You Still See Errors

If errors persist after removing scopes:

1. **Clear browser cache and cookies**
2. **Try in incognito/private window**
3. **Wait 15-30 minutes** for Google to fully update
4. **Revoke app access** in your Google Account:
   - Go to: https://myaccount.google.com/permissions
   - Find "MasterHosting"
   - Click "Remove Access"
   - Try logging in again

---

## 📞 Need Help?

If you're stuck:
1. Take a screenshot of the Scopes page
2. Show me which scopes are listed
3. I'll help you identify which ones to remove

---

**The key: Only keep the 3 basic scopes (email, profile, openid). Remove everything else!** 🔑
