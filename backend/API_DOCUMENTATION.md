# Lux Furniture Backend - API Documentation

## Overview

Complete backend for Lux Furniture with authentication, and payment integration for Uzbek payment systems (OAYME, CLICK, UZUM).

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Payment provider accounts (OAYME, CLICK, UZUM)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Run development server**
   ```bash
   npm run dev:watch
   ```

## Environment Variables

See `.env.example` for all required variables.

### Key Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - JWT signing secret (change in production!)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase anon key

### Payment Provider Variables

Each payment provider requires:
- Merchant ID
- API Key
- Secret Key
- Callback URL

## API Endpoints

### Authentication

#### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "passwordConfirm": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+998901234567"
}

Response:
{
  "success": true,
  "message": "Signup successful",
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": { ... }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer {token}

Response:
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+998901234567",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "createdAt": "2026-02-03T...",
    "lastLoginAt": "2026-02-03T..."
  }
}
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+998901234567"
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

#### Change Password
```http
POST /api/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword456"
}

Response:
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Payments

#### Create Payment
```http
POST /api/payments/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 500000,
  "orderId": "ORD-12345",
  "description": "Furniture Purchase",
  "method": "click",
  "returnUrl": "https://lux-furniture.com/payment-success",
  "phone": "+998901234567"
}

Response:
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "transactionId": "TXN-1234567890-abc123",
    "paymentUrl": "https://sandbox.click.uz/invoice/pay/..."
  }
}
```

**Supported Methods:**
- `oayme` - OAYME Payment Gateway
- `click` - CLICK Payment Gateway
- `uzum` - UZUM Payment Gateway

#### Get Payment Status
```http
GET /api/payments/status?transactionId=TXN-123&method=click
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "transactionId": "TXN-123",
    "status": "completed|pending|failed|processing"
  }
}
```

#### Get User Payments
```http
GET /api/payments/list
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "orderId": "ORD-123",
      "amount": 500000,
      "currency": "UZS",
      "method": "click",
      "status": "completed",
      "transactionId": "TXN-123",
      "createdAt": "2026-02-03T...",
      "completedAt": "2026-02-03T..."
    }
  ]
}
```

#### Refund Payment
```http
POST /api/payments/refund
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentId": "uuid"
}

Response:
{
  "success": true,
  "message": "Refund initiated successfully",
  "data": {
    "refundId": "REF-123",
    "status": "processing|completed"
  }
}
```

### Payment Callbacks

**OAYME Callback**
```http
POST /api/payments/oayme/callback
Content-Type: application/json

{
  "transaction_id": "TXN-123",
  "merchant_transaction_id": "ORD-123",
  "amount": 500000,
  "status": 1,
  "timestamp": 1234567890,
  "signature": "..."
}
```

**CLICK Callback**
```http
POST /api/payments/click/callback
Content-Type: application/json

{
  "click_trans_id": "CLICK-123",
  "service_id": "SERVICE-ID",
  "merchant_trans_id": "ORD-123",
  "amount": 500000,
  "action": 1,
  "error": 0,
  "sign_time": "...",
  "sign_string": "..."
}
```

**UZUM Callback**
```http
POST /api/payments/uzum/callback
Content-Type: application/json

{
  "transaction_id": "UZUM-123",
  "merchant_transaction_id": "ORD-123",
  "merchant_id": "MERCHANT-ID",
  "amount": 500000,
  "status": "SUCCESS",
  "timestamp": 1234567890,
  "signature": "..."
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  is_email_verified BOOLEAN DEFAULT false,
  is_phone_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  order_id VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'UZS',
  method VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  transaction_id VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
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

## Security Best Practices

1. **JWT Secret** - Change `JWT_SECRET` in production (min 32 characters)
2. **HTTPS** - Always use HTTPS in production
3. **CORS** - Configure allowed origins in production
4. **Payment Keys** - Never commit payment keys to repository
5. **Rate Limiting** - Implement rate limiting for production
6. **Input Validation** - All inputs are validated with express-validator
7. **Password Requirements** - Minimum 8 chars, uppercase, lowercase, number
8. **Signature Verification** - All payment callbacks are signature-verified

## Payment Integration Details

### OAYME
- **Sandbox URL**: https://sandbox-api.oayme.uz
- **Production URL**: https://api.oayme.uz
- **Signature**: HMAC-SHA256

### CLICK
- **Sandbox URL**: https://sandbox.click.uz
- **Production URL**: https://api.click.uz
- **Signature**: MD5

### UZUM
- **Sandbox URL**: https://sandbox-api.uzumbank.uz
- **Production URL**: https://api.uzumbank.uz
- **Signature**: SHA256

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## Deployment Checklist

- [ ] Set up Supabase project and database
- [ ] Configure environment variables
- [ ] Obtain credentials for all payment providers
- [ ] Set payment provider callbacks to `/api/payments/{provider}/callback`
- [ ] Update `FRONTEND_URL` and `API_URL` for production
- [ ] Generate strong `JWT_SECRET`
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS origins
- [ ] Set up monitoring and logging
- [ ] Configure auto-scaling if using cloud deployment
- [ ] Test all payment flows in sandbox mode
- [ ] Perform security audit

## Support

For issues and questions, please refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [OAYME Developer Portal](https://developer.oayme.uz)
- [CLICK Developer Portal](https://developer.click.uz)
- [UZUM Developer Portal](https://developer.uzumbank.uz)
