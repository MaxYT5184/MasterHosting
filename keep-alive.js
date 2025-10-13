// Keep-Alive Script for Render Free Tier
// Pings the server every 10 minutes to prevent spin-down

const https = require('https');

const SITE_URL = 'https://masterhostinig.online';
const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes

function ping() {
  const now = new Date().toISOString();
  
  https.get(SITE_URL, (res) => {
    console.log(`[${now}] ✅ Keep-alive ping successful - Status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error(`[${now}] ❌ Keep-alive ping failed:`, err.message);
  });
}

// Initial ping
console.log('🚀 Keep-alive service started');
console.log(`📍 Pinging: ${SITE_URL}`);
console.log(`⏱️  Interval: Every 10 minutes`);
ping();

// Set up interval
setInterval(ping, PING_INTERVAL);
