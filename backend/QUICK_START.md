# 🚀 Quick Start Guide - Lux Furniture Backend

Get your backend running in **5 minutes**!

## Step 1: Verify Prerequisites (1 min)

```bash
# Check Node.js version (need 18+)
node --version
# Should output: v18.x.x or higher

# Check npm
npm --version
# Should output: 9.x.x or higher
```

❌ Don't have Node.js? [Download here](https://nodejs.org/)

## Step 2: Clone and Install (2 min)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install
```

## Step 3: Setup Environment (1 min)

```bash
# Copy example environment file
cp .env.example .env
```

**Edit `.env` file:**
```
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secret-key-change-this-32-chars-min
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
```

💡 Need Supabase? [Create free project](https://supabase.com)

## Step 4: Start Server (1 min)

```bash
npm run dev:watch
```

✅ Server running at `http://localhost:5000`

## Test It Works!

### Test 1: Health Check
```bash
curl http://localhost:5000/health
```

### Test 2: Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "passwordConfirm": "TestPass123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Test 3: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

## Next Steps

1. **Read API Documentation** → `API_DOCUMENTATION.md`
2. **Setup Supabase Database** → `SETUP_INSTRUCTIONS.md`
3. **Integrate with Frontend** → `FRONTEND_INTEGRATION.md`
4. **Setup Payment Providers** → See SETUP_INSTRUCTIONS.md

## Common Commands

```bash
# Watch mode development
npm run dev:watch

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Format code
npm run format
```

## Docker Quick Start

```bash
# Start with Docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Troubleshooting

### "Port 5000 already in use"
```bash
# Find what's using port 5000
netstat -ano | findstr :5000  # Windows
lsof -i :5000                  # macOS/Linux

# Kill it (if safe)
taskkill /PID <PID> /F  # Windows
kill -9 <PID>           # macOS/Linux
```

### "Cannot find module" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Supabase connection error
- Check `SUPABASE_URL` and `SUPABASE_KEY` in `.env`
- Verify Supabase project is running
- Run database migrations from `SETUP_INSTRUCTIONS.md`

### CORS errors from frontend
Update `backend/src/server.ts` CORS configuration:
```typescript
const corsOptions = {
  origin: ['http://localhost:5173', 'http://your-domain.com'],
  credentials: true
};
```

## Project Structure

```
backend/
├── src/
│   ├── server.ts              # Main entry point
│   ├── config/                # Configuration
│   ├── routes/                # API routes
│   ├── controllers/           # Route handlers
│   ├── services/              # Business logic
│   ├── middleware/            # Express middleware
│   ├── types/                 # TypeScript types
│   └── utils/                 # Helper functions
├── .env.example               # Environment template
├── README.md                  # Full documentation
├── API_DOCUMENTATION.md       # API reference
└── SETUP_INSTRUCTIONS.md      # Detailed setup guide
```

## API Endpoints Overview

**Authentication**
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile (needs token)

**Payments**
- `POST /api/payments/create` - Start payment
- `GET /api/payments/status` - Check status
- `GET /api/payments/list` - List user payments

**Health**
- `GET /health` - Server health check

## Environment Variables Explained

```bash
# Server
NODE_ENV=development        # development or production
PORT=5000                   # Server port
API_URL=http://localhost:5000  # Your API URL

# Database
SUPABASE_URL=...           # Your Supabase project URL
SUPABASE_KEY=...           # Your Supabase anon key

# Security
JWT_SECRET=...             # Secret for JWT tokens (32+ chars)
JWT_EXPIRES_IN=7d          # Token expiration time

# Optional: Payment Providers
OAYME_MERCHANT_ID=...      # OAYME credentials
CLICK_MERCHANT_ID=...      # CLICK credentials
UZUM_MERCHANT_ID=...       # UZUM credentials
```

## API Request/Response Example

### Request
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### Response
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

## Frontend Integration Quick Example

### React
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
async function login(email, password) {
  const res = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', res.data.token);
  return res.data;
}

// Create payment
async function createPayment(amount, orderId) {
  return api.post('/payments/create', {
    amount,
    orderId,
    method: 'click',
    returnUrl: 'http://localhost:5173/success'
  });
}
```

## Deployment Readiness Checklist

- [ ] Supabase project created and migrations run
- [ ] `.env` configured with production values
- [ ] JWT_SECRET is 32+ characters and secure
- [ ] Payment provider credentials added
- [ ] Docker build successful
- [ ] All tests passing
- [ ] Environment variables never committed to Git
- [ ] HTTPS/SSL configured
- [ ] CORS origins updated for production domain
- [ ] Database backups enabled

## Getting Help

1. **Can't start the server?** → Check troubleshooting above
2. **API not working?** → See `API_DOCUMENTATION.md`
3. **Need payment setup?** → See `SETUP_INSTRUCTIONS.md`
4. **Frontend integration?** → See `FRONTEND_INTEGRATION.md`
5. **Questions about Supabase?** → [Supabase Docs](https://supabase.com/docs)

## What's Next?

✅ Backend is running!

Now:
1. **Setup Supabase** (if not done) - Follow SETUP_INSTRUCTIONS.md
2. **Integrate Frontend** - See FRONTEND_INTEGRATION.md
3. **Setup Payments** - Get credentials from OAYME, CLICK, UZUM
4. **Deploy** - Docker or cloud platform

---

**Questions?** Check the documentation files or payment provider guides.

**Ready to code?** Start building! 🎉
