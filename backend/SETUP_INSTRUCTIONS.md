# Backend Setup Instructions

## Prerequisites

Before starting, ensure you have:

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **npm** - Comes with Node.js
3. **Supabase Account** - [Sign up](https://supabase.com)
4. **Payment Provider Accounts**:
   - [OAYME Developer Portal](https://developer.oayme.uz)
   - [CLICK Developer Portal](https://developer.click.uz)
   - [UZUM Developer Portal](https://developer.uzumbank.uz)

## Step 1: Setup Supabase

1. **Create a new Supabase project**
   - Go to https://app.supabase.com
   - Click "New Project"
   - Configure your project settings

2. **Run database migrations**
   - In Supabase dashboard, go to "SQL Editor"
   - Click "New Query"
   - Copy content from `supabase/migrations/001_init_schema.sql`
   - Run the query

3. **Get your credentials**
   - Go to Project Settings → API
   - Copy `URL` and `anon public` key
   - Copy `service_role` key for backend use

## Step 2: Setup Backend

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   Edit `.env` with your values:
   ```
   NODE_ENV=development
   PORT=5000
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   JWT_SECRET=generate-a-strong-secret-32-chars-min
   ```

## Step 3: Payment Provider Setup

### OAYME Setup

1. Register at [OAYME Developer Portal](https://developer.oayme.uz)
2. Create an application
3. Get your credentials:
   - Merchant ID
   - API Key
   - Secret Key
4. Add to `.env`:
   ```
   OAYME_MERCHANT_ID=your-merchant-id
   OAYME_API_KEY=your-api-key
   OAYME_SECRET_KEY=your-secret-key
   OAYME_CALLBACK_URL=https://api.lux-furniture.com/payments/oayme/callback
   ```

### CLICK Setup

1. Register at [CLICK Developer Portal](https://developer.click.uz)
2. Create a service
3. Get your credentials:
   - Merchant ID
   - Service ID
   - API Key
   - Secret Key
4. Add to `.env`:
   ```
   CLICK_MERCHANT_ID=your-merchant-id
   CLICK_SERVICE_ID=your-service-id
   CLICK_API_KEY=your-api-key
   CLICK_SECRET_KEY=your-secret-key
   CLICK_CALLBACK_URL=https://api.lux-furniture.com/payments/click/callback
   ```

### UZUM Setup

1. Register at [UZUM Developer Portal](https://developer.uzumbank.uz)
2. Create a merchant account
3. Get your credentials:
   - Merchant ID
   - API Key
   - Secret Key
4. Add to `.env`:
   ```
   UZUM_MERCHANT_ID=your-merchant-id
   UZUM_API_KEY=your-api-key
   UZUM_SECRET_KEY=your-secret-key
   UZUM_CALLBACK_URL=https://api.lux-furniture.com/payments/uzum/callback
   ```

## Step 4: Running the Backend

### Development Mode
```bash
npm run dev:watch
```

Server will start at http://localhost:5000

### Using Docker

1. **Development with Docker**
   ```bash
   docker-compose up -d
   ```

2. **Production with Docker**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Step 5: Testing

### Test Signup
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

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Test Payment Creation
```bash
curl -X POST http://localhost:5000/api/payments/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000,
    "orderId": "ORD-12345",
    "method": "click",
    "returnUrl": "http://localhost:5173/payment-success",
    "phone": "+998901234567"
  }'
```

## Platform-Specific Setup

### Windows

1. **Install Node.js**
   - Download from https://nodejs.org/
   - Run installer
   - Verify: `node --version`

2. **Setup backend**
   ```bash
   cd backend
   npm install
   copy .env.example .env
   # Edit .env with your values
   npm run dev:watch
   ```

3. **Using Docker on Windows**
   - Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Run: `docker-compose up -d`

### macOS

1. **Install Node.js via Homebrew**
   ```bash
   brew install node
   ```

2. **Setup backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your values
   npm run dev:watch
   ```

3. **Using Docker on macOS**
   - Install [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
   - Run: `docker-compose up -d`

### Linux (Ubuntu/Debian)

1. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Setup backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your values
   npm run dev:watch
   ```

3. **Using Docker on Linux**
   ```bash
   sudo apt-get install docker.io docker-compose
   sudo docker-compose up -d
   ```

### iOS/Android

Since you're developing for mobile:

1. **Backend remains on your server** (Windows/macOS/Linux machine)
2. **Mobile apps connect via**:
   - Development: `http://your-local-ip:5000`
   - Production: `https://api.lux-furniture.com`

3. **Frontend configuration** (in React/React Native app):
   ```typescript
   const API_URL = process.env.NODE_ENV === 'production' 
     ? 'https://api.lux-furniture.com'
     : 'http://your-local-ip:5000'
   ```

## Deployment

### Cloud Platforms

#### Heroku (Easy Deployment)
```bash
# Login to Heroku
heroku login

# Create app
heroku create lux-furniture-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
# ... set all other variables

# Deploy
git push heroku main
```

#### AWS EC2
1. Create Ubuntu instance
2. Install Node.js
3. Clone repository
4. Set environment variables
5. Use PM2 for process management

#### DigitalOcean App Platform
1. Connect GitHub repository
2. Set environment variables
3. Deploy

#### Docker Image to Registry
```bash
# Build image
docker build -t lux-furniture-backend:1.0 .

# Tag for Docker Hub
docker tag lux-furniture-backend:1.0 yourname/lux-furniture-backend:1.0

# Push to Docker Hub
docker push yourname/lux-furniture-backend:1.0
```

## Monitoring & Logs

### Development Logs
```bash
npm run dev:watch
# Logs appear in console
```

### Production Logs (with Docker)
```bash
docker logs -f backend
# or
docker-compose logs -f
```

## Security Checklist

- [ ] JWT_SECRET is 32+ characters
- [ ] All payment keys are in .env (not committed)
- [ ] CORS is configured for your domain
- [ ] HTTPS is enabled in production
- [ ] Database backups are configured
- [ ] Rate limiting is enabled
- [ ] Input validation is active
- [ ] Error messages don't expose sensitive info

## Troubleshooting

### Port 5000 already in use
```bash
# Kill process using port 5000
# Windows: netstat -ano | findstr :5000
# macOS/Linux: lsof -i :5000 | grep LISTEN
```

### Supabase connection error
- Check SUPABASE_URL and SUPABASE_KEY
- Verify network connectivity
- Check Supabase project status

### Payment integration not working
- Verify credentials in .env
- Check payment provider sandbox/production settings
- Verify callback URLs are correctly configured
- Check payment provider logs

## Support Resources

- [Supabase Docs](https://supabase.com/docs)
- [Node.js Docs](https://nodejs.org/en/docs/)
- [Express Docs](https://expressjs.com/)
- [JWT Introduction](https://jwt.io/introduction)
