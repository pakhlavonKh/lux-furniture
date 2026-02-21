# Production Deployment Guide - macOS, iOS, Safari Compatible

This guide provides instructions to make the Lux Furniture backend production-ready for macOS, iOS, and Safari compatibility.

## Prerequisites

- Node.js v18+ 
- MongoDB Atlas (configured)
- SSL/TLS Certificate (for HTTPS)
- macOS/iOS testing devices

## Server Improvements Made

### 1. **Security Headers** ✅
- **Helmet.js Configuration**: Enhanced CSP, HSTS, X-Frame-Options
- **CORS Optimization**: Dynamic origin validation with subdomain support
- **Mobile-Specific Headers**: iOS Safari compatibility headers
- **Cache Control**: Proper cache directives for API endpoints

### 2. **Authentication** ✅
- JWT-based authentication with secure password hashing (bcryptjs)
- Email format validation
- Password strength requirements
- Last login tracking

### 3. **API Endpoints** ✅
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - Logout (protected)
- `GET /health` - Health check

## Setting Up Production Environment

### Step 1: Configure Environment Variables

Update `.env` file for production:

```bash
# Server
NODE_ENV=production
PORT=5000
API_URL=https://api.lux-furniture.com

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lux-furniture

# Frontend URLs (MUST BE HTTPS for iOS/Safari)
FRONTEND_URL=https://lux-furniture.com
FRONTEND_URL_PROD=https://lux-furniture.com

# JWT (Use strong random key)
JWT_SECRET=generate-strong-random-key-here-min-32-chars
JWT_EXPIRES_IN=7d

# Payment Services
PAYME_MERCHANT_ID=your-production-id
PAYME_API_KEY=your-production-key
PAYME_SECRET_KEY=your-production-secret
# ... add other payment credentials
```

### Step 2: Enable HTTPS/SSL

**Option A: Using Node.js with SSL**

```bash
# Generate self-signed certificate (for testing)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /path/to/key.pem -out /path/to/cert.pem
```

**Option B: Use Reverse Proxy (Recommended)**

Use Nginx or Apache to handle SSL/TLS:

```nginx
# Nginx configuration example
server {
    listen 443 ssl http2;
    server_name api.lux-furniture.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # SSL Security Headers
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Step 3: Deploy on macOS

**Using PM2 for Process Management:**

```bash
# Install PM2 globally
npm install -g pm2

# Create ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'lux-furniture-api',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    watch: ['src'],
    ignore_watch: ['node_modules', '.git'],
    listen_timeout: 3000,
    kill_timeout: 5000,
  }]
};
EOF

# Start the application
pm2 start ecosystem.config.js

# Set to auto-restart on system reboot
pm2 startup
pm2 save
```

### Step 4: Test iOS/Safari Compatibility

**1. Local Testing:**

```bash
# Test from macOS Safari
open https://localhost:5173

# Monitor API calls
# Safari > Settings > Advanced > Show Develop Menu
# Develop > example.com (or your domain)
```

**2. Test from iOS Device:**

1. On iPhone/iPad, go to Settings > Safari > Advanced > Web Inspector (enable)
2. Connect macOS to iOS via USB
3. In Safari Develop menu, select your device
4. Open the app in Safari and inspect network requests

**3. Check Headers:**

```bash
# Test CORS headers
curl -i -X OPTIONS https://api.lux-furniture.com/api/auth/login \
  -H "Origin: https://lux-furniture.com" \
  -H "Access-Control-Request-Method: POST"

# Test health check
curl https://api.lux-furniture.com/health
```

## iOS/Safari Specific Requirements

### ✅ HTTPS Required
- iOS Safari requires HTTPS for all external API calls
- Self-signed certificates will show warnings

### ✅ CORS Headers
- Origin validation enabled
- Credentials support configured
- Custom headers allowed

### ✅ Security Headers
- CSP configured for asset loading
- HSTS enforced for HTTPS
- X-Frame-Options prevents clickjacking
- X-XSS-Protection enabled

### ✅ Mobile Optimizations
- Connection pooling support
- Compression enabled (gzip)
- Proper timeout handling
- Cache headers optimized

## Database Configuration

### MongoDB Atlas Setup

1. Create cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user with strong password
3. Whitelist IP addresses:
   - Your server IP
   - Deployment platform IPs (if using cloud)
4. Use connection string in `MONGO_URI`

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

## Monitoring and Logging

### PM2 Monitoring

```bash
# Real-time logs
pm2 logs lux-furniture-api

# Restart logs
pm2 logs lux-furniture-api --lines 100

# View all processes
pm2 monit
```

### Error Tracking

Implement error tracking for production:

```javascript
// Example: Sentry integration
import Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## Performance Optimization

1. **Enable Compression** ✅ (Already configured)
2. **Database Indexing** ✅ (MongoDB indexes optimized)
3. **Connection Pooling** - MongoDB Atlas handles automatically
4. **Rate Limiting** - Consider adding express-rate-limit
5. **Caching** - Implement Redis for session/token caching

## Security Checklist

- [ ] All environment variables configured
- [ ] HTTPS/SSL certificates installed
- [ ] CORS properly configured for production origins
- [ ] Password hashing enabled (bcryptjs)
- [ ] JWT secret is strong and unique
- [ ] MongoDB credentials rotated
- [ ] Firewall rules configured
- [ ] Regular security updates installed
- [ ] Error messages don't expose sensitive info
- [ ] Rate limiting configured (optional)

## Troubleshooting

### CORS Errors on iOS/Safari
1. Verify HTTPS is enabled
2. Check CORS headers are being sent
3. Ensure frontend URL matches FRONTEND_URL in .env

### Connection Timeout on macOS
1. Check MongoDB Atlas IP whitelist
2. Verify DNS resolution
3. Check firewall rules

### Certificate Errors
1. Use valid SSL certificate (not self-signed)
2. Certificate must match domain
3. Install intermediate certificates if required

## Support

For production deployment assistance, refer to:
- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-performance-best-practices/)
- [MongoDB Atlas Security](https://docs.mongodb.com/atlas/security/)
- [Safari Web Development](https://developer.apple.com/safari/)
