# 🔍 Uptime Monitoring Setup

## Why "Bad Gateway" Errors Happen

**Render Free Tier Behavior:**
- ⏱️ Server spins down after 15 minutes of inactivity
- 🐌 Takes 30-60 seconds to wake up on first request
- ⚠️ UptimeRobot may timeout before server wakes up

---

## ✅ Solutions Implemented

### 1. Self-Ping Keep-Alive (Built-in)
The server now pings itself every 10 minutes to stay awake:
- ✅ Automatic - no external service needed
- ✅ Only runs in production mode
- ✅ Pings `/health` endpoint
- ✅ Prevents spin-down

### 2. Health Check Endpoint
New endpoint for monitoring: `https://masterhostinig.online/health`

Returns:
```json
{
  "status": "ok",
  "uptime": 12345,
  "timestamp": "2025-10-13T13:11:27.000Z"
}
```

---

## 🔧 UptimeRobot Configuration

### Recommended Settings:

**Monitor Type:** HTTP(s)
**URL to Monitor:** `https://masterhostinig.online/health`
**Monitoring Interval:** 5 minutes (or 10 minutes)
**Timeout:** 60 seconds (important!)

### Why 60 Second Timeout?
- Render takes 30-60 seconds to wake up
- Default 30-second timeout is too short
- 60 seconds gives server time to start

---

## 📊 How It Works

```
Every 10 minutes:
  Server pings itself → /health endpoint
  ↓
  Server stays awake
  ↓
  No spin-down
  ↓
  UptimeRobot always gets fast response
```

---

## 🎯 Expected Behavior

**With Keep-Alive:**
- ✅ Server stays awake 24/7
- ✅ Fast response times (<100ms)
- ✅ No "Bad Gateway" errors
- ✅ 99.9%+ uptime

**Without Keep-Alive:**
- ⚠️ Server spins down after 15 min
- 🐌 First request takes 30-60 sec
- ❌ UptimeRobot may timeout
- 📉 Lower uptime percentage

---

## 🔍 Testing

Test the health endpoint:
```bash
curl https://masterhostinig.online/health
```

Should return:
```json
{"status":"ok","uptime":123.45,"timestamp":"2025-10-13T13:11:27.000Z"}
```

---

## 📝 Notes

- Keep-alive only runs in production (not locally)
- Uses minimal resources (1 request per 10 minutes)
- Complies with Render's fair use policy
- Prevents unnecessary spin-downs

---

## 🚀 Alternative: External Cron Service

If you prefer external monitoring, use:
- **Cron-job.org** - Free cron service
- **EasyCron** - Free tier available
- **UptimeRobot itself** - Can act as keep-alive

Configure to ping `/health` every 10 minutes.

---

**Your server will now stay awake and respond quickly!** ✅
