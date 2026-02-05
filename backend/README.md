# Lux Furniture Backend

A production-ready Node.js/Express backend for the Lux Furniture e-commerce platform with complete authentication, user management, and integrated Uzbek payment systems (OAYME, CLICK, UZUM).

## Features

✅ **User Authentication**
- Secure signup and login with JWT
- Password hashing with bcrypt
- Email validation
- Password strength requirements

✅ **Payment Integration**
- OAYME Payment Gateway
- CLICK Payment Gateway
- UZUM Payment Gateway
- Signature verification
- Transaction tracking

✅ **Security**
- JWT-based authentication
- CORS protection
- Helmet for HTTP security headers
- Password hashing (bcrypt)
- Input validation with express-validator
- Rate limiting ready

✅ **Database**
- Supabase PostgreSQL
- Row-level security (RLS)
- Automatic timestamps
- Payment tracking

✅ **Deployment**
- Docker support
- Multi-environment configuration (dev/prod)
- PM2 ready
- Cloud-agnostic

✅ **Cross-Platform**
- Web (React/Vue/etc)
- iOS (React Native/Flutter/Swift)
- Android (React Native/Kotlin)
- macOS/Windows

## Quick Start

### 1. Prerequisites

- Node.js 18+
- Supabase account
- Payment provider accounts (OAYME, CLICK, UZUM)

### 2. Installation

```bash
# Clone and navigate
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# nano .env  (or use your editor)
```

### 3. Setup Supabase

1. Create a Supabase project
2. Run SQL migration from `supabase/migrations/001_init_schema.sql`
3. Get your credentials (URL and anon key)
4. Add to `.env`

### 4. Start Development Server

```bash
npm run dev:watch
```

Server runs at `http://localhost:5000`

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   │   └── payment/
│   │       ├── oayme.service.ts
│   │       ├── click.service.ts
│   │       └── uzum.service.ts
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   └── server.ts         # Entry point
├── supabase/
│   └── migrations/       # Database migrations
├── .env.example          # Environment template
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Dev docker setup
├── docker-compose.prod.yml  # Production docker setup
├── API_DOCUMENTATION.md  # API reference
├── SETUP_INSTRUCTIONS.md # Setup guide
└── FRONTEND_INTEGRATION.md # Integration guide
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (authenticated)
- `PUT /api/auth/profile` - Update profile (authenticated)
- `POST /api/auth/change-password` - Change password (authenticated)

### Payments
- `POST /api/payments/create` - Create payment (authenticated)
- `GET /api/payments/status` - Check payment status (authenticated)
- `GET /api/payments/list` - Get user payments (authenticated)
- `POST /api/payments/refund` - Refund payment (authenticated)
- `POST /api/payments/oayme/callback` - OAYME webhook
- `POST /api/payments/click/callback` - CLICK webhook
- `POST /api/payments/uzum/callback` - UZUM webhook

## Environment Variables

See `.env.example` for complete list. Key variables:

```
NODE_ENV=development|production
PORT=5000
JWT_SECRET=your-secret-key
SUPABASE_URL=https://...supabase.co
SUPABASE_KEY=your-anon-key
OAYME_MERCHANT_ID=...
CLICK_MERCHANT_ID=...
UZUM_MERCHANT_ID=...
```

## Database Schema

### Users Table
```sql
- id (UUID)
- email (unique)
- first_name, last_name
- phone (optional)
- password_hash
- is_email_verified, is_phone_verified
- created_at, updated_at, last_login_at
```

### Payments Table
```sql
- id (UUID)
- user_id (foreign key)
- order_id, amount, currency
- method (oayme|click|uzum)
- status (pending|processing|completed|failed|refunded)
- transaction_id (unique)
- metadata (JSONB)
- created_at, updated_at, completed_at
```

## Docker Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Scripts

```bash
# Development with auto-reload
npm run dev:watch

# Build TypeScript
npm run build

# Start production server
npm start

# Run tests
npm test

# Watch tests
npm test:watch

# Lint code
npm run lint

# Format code
npm run format
```

## Security Features

- ✅ JWT authentication with expiration
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ CORS protection
- ✅ Helmet HTTP headers
- ✅ Input validation
- ✅ Payment signature verification
- ✅ Row-level security in database
- ✅ Environment-based configuration
- ✅ HTTPS ready

## Multi-Platform Support

### Web (React/Vue/etc)
```typescript
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});
```

### React Native
```typescript
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';
```

### Flutter
```dart
final apiUrl = 'http://localhost:5000/api';
```

### Native iOS
```swift
let apiUrl = "http://localhost:5000/api"
```

### Native Android
```kotlin
val apiUrl = "http://localhost:5000/api"
```

## Payment Integration Status

| Provider | Status | Sandbox | Production | Callback |
|----------|--------|---------|-----------|----------|
| OAYME | ✅ Ready | ✅ | ✅ | ✅ |
| CLICK | ✅ Ready | ✅ | ✅ | ✅ |
| UZUM | ✅ Ready | ✅ | ✅ | ✅ |

## Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Setup Instructions](./SETUP_INSTRUCTIONS.md) - Step-by-step setup guide
- [Frontend Integration](./FRONTEND_INTEGRATION.md) - Integration examples for web/mobile

## Troubleshooting

### Port already in use
```bash
# Find process using port 5000
netstat -ano | findstr :5000  # Windows
lsof -i :5000                  # macOS/Linux

# Kill process (example for Windows)
taskkill /PID 1234 /F
```

### Supabase connection error
- Verify `SUPABASE_URL` and `SUPABASE_KEY`
- Check project status in Supabase dashboard
- Ensure migrations are run

### Payment not working
- Verify credentials in `.env`
- Check sandbox vs production URLs
- Verify callback URLs in payment provider dashboard
- Check signature verification logic

## Cloud Deployment

### Heroku
```bash
heroku create lux-furniture-backend
heroku config:set NODE_ENV=production JWT_SECRET=...
git push heroku main
```

### AWS EC2
1. Create Ubuntu instance
2. Install Node.js and npm
3. Clone repository
4. Set environment variables
5. Use PM2 for process management

### DigitalOcean
Use App Platform for easy GitHub integration and auto-deployment

### Docker Registry
```bash
docker build -t lux-furniture-backend .
docker tag lux-furniture-backend:latest yourname/lux-furniture-backend:latest
docker push yourname/lux-furniture-backend:latest
```

## Performance Optimization

- ✅ Compression middleware enabled
- ✅ Connection pooling (Supabase)
- ✅ Request validation before DB operations
- ✅ Indexed database queries
- ✅ Response caching ready
- ✅ Rate limiting ready

## Monitoring & Logging

- Morgan HTTP request logging
- Error stack traces in development
- Structured error responses
- Health check endpoint at `/health`

## Contributing

1. Create feature branch
2. Make changes
3. Run tests and linting
4. Create pull request

## License

MIT

## Support

For issues and questions:
- Check [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
- Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Check [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)
- Review payment provider documentation

## Payment Provider Links

- [OAYME Developer](https://developer.oayme.uz)
- [CLICK Developer](https://developer.click.uz)
- [UZUM Developer](https://developer.uzumbank.uz)

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT
- **Validation**: express-validator
- **Security**: helmet, bcryptjs
- **Containerization**: Docker
- **Testing**: Vitest
- **Linting**: ESLint
- **Formatting**: Prettier

---

**Status**: ✅ Production Ready
**Version**: 1.0.0
**Last Updated**: February 2026
