# 📦 Firebase Storage Setup Guide

## 🎉 Big Update: Profile Pictures!

Users can now upload their own profile pictures! Pictures are stored in Firebase Storage.

---

## ✅ What I Added:

1. **Profile Page** (`/profile`) - Users can view and edit their profile
2. **Profile Picture Upload** - Drag & drop or click to upload
3. **Firebase Storage Integration** - Images stored securely
4. **Real-time Progress** - Upload progress bar
5. **Profile Link in Navigation** - Shows when logged in
6. **Firestore Integration** - Profile picture URL saved to database

---

## 🚀 Setup Firebase Storage

### Step 1: Enable Firebase Storage

1. Go to: https://console.firebase.google.com/
2. Select your project: **masterhosting-7e0a7**
3. In the left sidebar, click **Build** → **Storage**
4. Click **Get started**
5. Choose **Start in production mode**
6. Click **Next**
7. Select location: **us-central** (same as Firestore)
8. Click **Done**

---

### Step 2: Set Storage Security Rules

1. In Storage, click **Rules** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Profile pictures - users can only upload their own
    match /profile-pictures/{userId}/{allPaths=**} {
      allow read: if true; // Anyone can view profile pictures
      allow write: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin can do anything
    match /{allPaths=**} {
      allow read, write: if request.auth != null && 
        (request.auth.token.email == 'a.tormen2012@gmail.com' || 
         request.auth.token.email == 'gogojohnny745@gmail.com');
    }
  }
}
```

3. Click **Publish**

---

## 🎯 Features

### Profile Page (`/profile`)

**Features:**
- ✅ View profile information
- ✅ Upload profile picture
- ✅ See account details (email, user ID, created date)
- ✅ Real-time upload progress
- ✅ Image validation (max 5MB, images only)
- ✅ Protected - login required

**Access:**
- URL: https://masterhostinig.online/profile
- Visible in navigation when logged in

### Profile Picture Upload

**How it works:**
1. User clicks camera icon on profile picture
2. Selects image file (JPG, PNG, GIF, etc.)
3. Image is validated (size, type)
4. Upload starts with progress bar
5. Image is stored in Firebase Storage
6. Download URL is saved to Firestore
7. Profile picture updates immediately

**Validation:**
- ✅ Max file size: 5MB
- ✅ Only image files accepted
- ✅ Unique filename with timestamp
- ✅ Stored in user's folder: `profile-pictures/{userId}/`

### Storage Structure

```
profile-pictures/
  ├── {userId1}/
  │   ├── 1697123456789_avatar.jpg
  │   └── 1697123567890_profile.png
  ├── {userId2}/
  │   └── 1697123678901_photo.jpg
  └── ...
```

---

## 🔐 Security

### Storage Rules
- **Read:** Anyone can view profile pictures (public)
- **Write:** Users can only upload to their own folder
- **Delete:** Users can only delete their own pictures
- **Admin:** Full access to all files

### File Validation
- Max size: 5MB
- Allowed types: image/*
- Unique filenames prevent overwrites
- User-specific folders prevent unauthorized access

### Firestore Integration
```javascript
users/{userId} {
  email: "user@example.com",
  profilePicture: "https://firebasestorage.googleapis.com/...",
  updatedAt: "2025-10-13T18:30:00.000Z"
}
```

---

## 🧪 Testing

### Test Profile Picture Upload

1. **Login:**
   - Go to: https://masterhostinig.online/login
   - Login with your account

2. **Go to Profile:**
   - Click **"Profile"** in navigation
   - Or visit: https://masterhostinig.online/profile

3. **Upload Picture:**
   - Click the camera icon on profile picture
   - Select an image file (max 5MB)
   - Watch the upload progress
   - Picture should update immediately

4. **Verify:**
   - Refresh the page
   - Picture should persist
   - Check Firebase Storage console
   - Check Firestore `users` collection

### Test Different Scenarios

**Valid Upload:**
- Image file < 5MB
- Should upload successfully
- Progress bar shows 0-100%
- Success message appears

**Invalid File Type:**
- Try uploading a PDF or text file
- Should show error: "Please select an image file."

**File Too Large:**
- Try uploading image > 5MB
- Should show error: "Image size must be less than 5MB."

**Not Logged In:**
- Visit `/profile` without logging in
- Should see "Please Login" message
- Should redirect to login page

---

## 📊 User Flow

1. **User logs in** → Profile link appears in navigation
2. **User clicks Profile** → Profile page loads
3. **User clicks camera icon** → File picker opens
4. **User selects image** → Validation runs
5. **Upload starts** → Progress bar shows
6. **Upload completes** → Image saved to Storage
7. **URL saved** → Firestore updated
8. **Picture updates** → UI refreshes immediately

---

## 🛠️ Technical Details

### Firebase Storage
- **Bucket:** `masterhosting-7e0a7.firebasestorage.app`
- **Location:** us-central
- **Max file size:** 5MB per file
- **Allowed types:** All image formats

### Upload Process
1. File selected by user
2. Validated (size, type)
3. Uploaded to Storage with progress tracking
4. Download URL retrieved
5. URL saved to Firestore
6. UI updated with new picture

### Code Structure
- **firebase-config.js:** Storage initialization
- **profile.ejs:** Profile page with upload UI
- **server.js:** Profile route
- **layout.ejs:** Profile link in navigation

---

## 🎨 UI Features

### Profile Picture Display
- 150x150px circular avatar
- Camera icon overlay for upload
- Hover effect on camera icon
- Default avatar if no picture

### Upload Progress
- Full-screen overlay during upload
- Animated upload icon
- Progress bar (0-100%)
- Status messages

### Messages
- Success: Green with checkmark
- Error: Red with exclamation
- Auto-dismiss after 5 seconds

---

## 🔍 Troubleshooting

### "Permission denied" in Storage
- Make sure Storage is enabled
- Check security rules are published
- Verify user is logged in
- Check user ID matches folder name

### Upload fails
- Check file size (max 5MB)
- Verify file is an image
- Check internet connection
- Look at browser console for errors

### Picture doesn't show
- Check Firestore for `profilePicture` field
- Verify download URL is valid
- Check Storage rules allow read access
- Clear browser cache

### Profile link not showing
- Make sure user is logged in
- Check `firebase-config.js` is loaded
- Verify `updateAuthUI` function runs
- Check browser console for errors

---

## 📝 Database Schema

### Firestore `users` Collection
```javascript
{
  userId: {
    email: "user@example.com",
    profilePicture: "https://firebasestorage.googleapis.com/v0/b/masterhosting-7e0a7.firebasestorage.app/o/profile-pictures%2F{userId}%2F{timestamp}_{filename}?alt=media&token={token}",
    createdAt: "2025-10-13T17:00:00.000Z",
    updatedAt: "2025-10-13T18:30:00.000Z",
    createdBy: "signup",
    role: "user"
  }
}
```

---

## 🎉 Summary

✅ **Profile page created** - View and edit profile
✅ **Picture upload** - Drag & drop or click to upload
✅ **Firebase Storage** - Secure image storage
✅ **Progress tracking** - Real-time upload progress
✅ **Validation** - Size and type checking
✅ **Navigation link** - Shows when logged in
✅ **Firestore integration** - URL saved to database
✅ **Security rules** - User-specific folders

---

## 🚀 Next Steps

1. **Enable Firebase Storage** (see Step 1)
2. **Set security rules** (see Step 2)
3. **Wait 2-3 minutes** for deployment
4. **Login** to your account
5. **Click Profile** in navigation
6. **Upload** your profile picture
7. **Test** different scenarios

---

**After enabling Storage, users can upload profile pictures!** 🎉

Visit: https://masterhostinig.online/profile
