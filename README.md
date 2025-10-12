# MasterHosting Website

Professional website hosting service with free subdomains starting at $1.28/month.

## 🚀 Features

- **Modern Design**: Clean, responsive UI built with modern CSS
- **EJS Templating**: Modular and easy-to-edit templates
- **Contact Form**: Working contact form with email integration
- **Showcase Section**: Interactive subdomain preview
- **Pricing Plans**: Clear pricing with $1.28/month starter plan
- **How It Works**: Visual step-by-step process explanation
- **Mobile Responsive**: Fully responsive design for all devices
- **SEO Optimized**: Proper meta tags and semantic HTML

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## 🛠️ Installation

1. **Clone or download this repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your images** (optional)
   - Place your logo in `/public/images/logo.png`
   - Place your favicon in `/public/images/favicon.ico`
   - Place your apple touch icon in `/public/images/apple-touch-icon.png`

4. **Configure email** (optional)
   - Copy `.env.example` to `.env`
   - Add your email credentials for the contact form
   ```bash
   cp .env.example .env
   ```
   - Edit `.env` with your email settings

## 🚀 Running the Website

### Development Mode
```bash
npm run dev
```
This will start the server with nodemon (auto-restart on file changes).

### Production Mode
```bash
npm start
```

The website will be available at `http://localhost:3000`

## 📁 Project Structure

```
masterhosting-website/
├── public/                 # Static files
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   ├── js/
│   │   └── main.js        # JavaScript functionality
│   └── images/            # Image assets
├── views/                 # EJS templates
│   ├── layout.ejs         # Main layout template
│   ├── index.ejs          # Homepage
│   ├── contact.ejs        # Contact page
│   └── 404.ejs            # Error page
├── server.js              # Express server
├── package.json           # Dependencies
└── README.md             # This file
```

## 🌐 Deployment Options

### Option 1: Heroku (Free Tier)

1. Create a Heroku account at https://heroku.com
2. Install Heroku CLI
3. Deploy:
   ```bash
   heroku login
   heroku create masterhosting
   git push heroku main
   ```

### Option 2: Render (Free Tier)

1. Create account at https://render.com
2. Connect your GitHub repository
3. Create new Web Service
4. Set build command: `npm install`
5. Set start command: `npm start`

### Option 3: Railway (Free Tier)

1. Create account at https://railway.app
2. Create new project from GitHub
3. Railway will auto-detect and deploy

### Option 4: Vercel (Free Tier)

1. Create account at https://vercel.com
2. Install Vercel CLI: `npm i -g vercel`
3. Deploy: `vercel`

### Option 5: DigitalOcean App Platform (Free Trial)

1. Create account at https://digitalocean.com
2. Create new App
3. Connect GitHub repository
4. Deploy

## 📧 Contact Form Setup

The contact form currently logs submissions to the console. To enable email sending:

1. Uncomment the nodemailer code in `server.js`
2. Set up environment variables in `.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```
3. For Gmail, you'll need to create an "App Password":
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"

## 🎨 Customization

### Changing Colors

Edit the CSS variables in `/public/css/style.css`:
```css
:root {
    --primary-color: #6366f1;
    --primary-dark: #4f46e5;
    --primary-light: #818cf8;
    /* ... more variables */
}
```

### Editing Content

All content is in the EJS files in the `/views` directory:
- Homepage: `views/index.ejs`
- Contact: `views/contact.ejs`
- Layout (header/footer): `views/layout.ejs`

### Adding New Pages

1. Create a new EJS file in `/views`
2. Add a route in `server.js`:
   ```javascript
   app.get('/your-page', (req, res) => {
     res.render('your-page', { 
       title: 'Your Page Title',
       page: 'your-page'
     });
   });
   ```

## 🔧 Environment Variables

Create a `.env` file with these variables:

```env
# Server
PORT=3000

# Email (optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Port already in use
If port 3000 is already in use, change it in `.env` or run:
```bash
PORT=3001 npm start
```

### Images not showing
Make sure your image files are in `/public/images/` directory.

### Contact form not sending emails
1. Check your `.env` file configuration
2. Make sure you uncommented the email code in `server.js`
3. For Gmail, use an App Password, not your regular password

## 📝 License

MIT License - feel free to use this for your hosting business!

## 🤝 Support

For questions or issues, contact: support@masterhostinig.online

## 🎯 Domain Setup

Your domain: **masterhostinig.online**

To point your domain to your hosting:
1. Get your hosting IP address or URL
2. Update your domain's DNS settings:
   - A Record: Point to your server IP
   - Or CNAME: Point to your hosting URL

## 📊 Features Checklist

- ✅ Responsive design
- ✅ Modern UI/UX
- ✅ Contact form
- ✅ Pricing section
- ✅ How It Works section
- ✅ Showcase section
- ✅ SEO optimized
- ✅ Fast loading
- ✅ Mobile friendly
- ✅ Easy to customize

## 🚀 Next Steps

1. Install dependencies: `npm install`
2. Add your logo and favicon to `/public/images/`
3. Customize colors and content
4. Set up email for contact form
5. Deploy to your preferred hosting platform
6. Point your domain to the hosting
7. Go live! 🎉

---

Built with ❤️ for MasterHosting
