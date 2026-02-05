# Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Applications                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │     Web      │  │   iOS/Android│  │   Desktop    │          │
│  │   (React)    │  │ (React Native)│  │  (Electron)  │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼────────────────┼────────────────┼──────────────────────┘
          │                │                │
          │ HTTP/HTTPS     │ HTTP/HTTPS     │ HTTP/HTTPS
          │                │                │
          └────────────────┼────────────────┘
                           │
        ┌──────────────────▼──────────────────┐
        │     CORS-Protected API Gateway      │
        │      (Express.js + Middleware)      │
        │  - Authentication (JWT)             │
        │  - Validation (express-validator)   │
        │  - Error Handling                   │
        │  - Logging & Monitoring             │
        └──────────────────┬──────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │     Route Controllers & Services    │
        │ ┌────────────────────────────────┐  │
        │ │  Authentication Service        │  │
        │ │  - Signup/Login/Profile        │  │
        │ │  - Password Management         │  │
        │ └────────────────────────────────┘  │
        │ ┌────────────────────────────────┐  │
        │ │  Payment Service               │  │
        │ │  - OAYME/CLICK/UZUM Templates  │  │
        │ │  - Transaction Tracking        │  │
        │ │  - Callback Processing         │  │
        │ └────────────────────────────────┘  │
        │ ┌────────────────────────────────┐  │
        │ │  Token Service                 │  │
        │ │  - JWT Generation/Verification │  │
        │ └────────────────────────────────┘  │
        └──────────────────┬──────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │        Database Layer               │
        │ (Supabase PostgreSQL)               │
        │ ┌────────────────────────────────┐  │
        │ │  Tables:                       │  │
        │ │  - Users (with RLS)            │  │
        │ │  - Payments (with RLS)         │  │
        │ └────────────────────────────────┘  │
        └──────────────────┬──────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │   External Services                 │
        │ ┌────────────────────────────────┐  │
        │ │  Payment Gateways              │  │
        │ │  - OAYME (UZB)                 │  │
        │ │  - CLICK (UZB)                 │  │
        │ │  - UZUM (UZB)                  │  │
        │ └────────────────────────────────┘  │
        └─────────────────────────────────────┘
```

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                          │
└─────────────────────────────────────────────────────────────────┘

1. SIGNUP:
   
   User ──POST /auth/signup──> Backend
                                  ↓
                          Validate input
                                  ↓
                          Check email exists
                                  ↓
                          Hash password (bcrypt)
                                  ↓
                          Create user in DB
                                  ↓
                          Generate JWT token
                                  ↓
   User ←──{token, user}─── Backend


2. LOGIN:

   User ──POST /auth/login──> Backend
        (email, password)          ↓
                          Find user by email
                                  ↓
                          Verify password
                                  ↓
                          Update last_login_at
                                  ↓
                          Generate JWT token
                                  ↓
   User ←──{token, user}─── Backend


3. AUTHENTICATED REQUEST:

   User ──GET /auth/profile──> Backend
        (Auth: Bearer TOKEN)       ↓
                          Verify JWT signature
                                  ↓
                          Extract user ID
                                  ↓
                          Fetch user profile
                                  ↓
   User ←──{user profile}─── Backend


4. TOKEN EXPIRATION:

   User ──POST /api/payments──> Backend
        (Auth: Bearer TOKEN)       ↓
                          JWT expired? YES
                                  ↓
   User ←──401 Unauthorized─ Backend
        (Token expired)
                ↓
   User ──POST /auth/login──> Backend (use refresh token)
   or logs in again
```

## Payment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      PAYMENT FLOW                               │
└─────────────────────────────────────────────────────────────────┘

1. INITIATE PAYMENT:

   User ──POST /payments/create──> Backend
    (amount, orderId, method)        ↓
                          Validate input
                                  ↓
                          Create payment record (PENDING)
                                  ↓
              Call payment provider API (OAYME/CLICK/UZUM)
                                  ↓
                          Get payment URL
                                  ↓
   User ←──{paymentUrl, txnId}─ Backend


2. PAYMENT PROCESSING:

   User ──(clicks link)──> Payment Provider
                                  ↓
                          User enters card details
                                  ↓
                          Provider processes payment
                                  ↓
              Provider sends callback to Backend
                   (POST /payments/x/callback)
                                  ↓
                          Backend verifies signature
                                  ↓
                          Update payment status (COMPLETED/FAILED)
                                  ↓
              User redirected to returnUrl
                                  ↓
   Frontend checks payment status
        (GET /payments/status)
                                  ↓
   User sees confirmation


3. PAYMENT STATUS LIFECYCLE:

   PENDING ─────> PROCESSING ─────> COMPLETED
      ↑                                  │
      │                                  ↓
      └──────────────────────────────> FAILED
      
   Additional states:
   - CANCELLED (user aborts)
   - REFUNDED (refund initiated)
```

## Request/Response Cycle

```
┌─────────────────────────────────────────────────────────────────┐
│                   REQUEST/RESPONSE CYCLE                        │
└─────────────────────────────────────────────────────────────────┘

CLIENT REQUEST:
┌─────────────────────────────────┐
│ POST /api/auth/login            │
│ Content-Type: application/json  │
│ {                               │
│   "email": "user@example.com",  │
│   "password": "SecurePass123"   │
│ }                               │
└─────────────────────────────────┘
         ↓
MIDDLEWARE PROCESSING:
┌─────────────────────────────────┐
│ 1. CORS validation              │
│ 2. Body parsing                 │
│ 3. Input validation             │
│ 4. Request logging              │
└─────────────────────────────────┘
         ↓
CONTROLLER:
┌─────────────────────────────────┐
│ 1. Validate email format        │
│ 2. Check password not empty     │
│ 3. Call auth service            │
└─────────────────────────────────┘
         ↓
SERVICE:
┌─────────────────────────────────┐
│ 1. Query database               │
│ 2. Compare password             │
│ 3. Generate JWT token           │
│ 4. Update last_login_at         │
└─────────────────────────────────┘
         ↓
SERVER RESPONSE:
┌─────────────────────────────────┐
│ HTTP 200                        │
│ Content-Type: application/json  │
│ {                               │
│   "success": true,              │
│   "message": "Login successful",│
│   "token": "eyJhbGc...",        │
│   "user": {                     │
│     "id": "uuid-123",           │
│     "email": "user@...",        │
│     "firstName": "John"         │
│   }                             │
│ }                               │
└─────────────────────────────────┘
         ↓
CLIENT:
┌─────────────────────────────────┐
│ 1. Store token in localStorage  │
│ 2. Store user info              │
│ 3. Redirect to dashboard        │
└─────────────────────────────────┘
```

## Payment Provider Integration

```
┌─────────────────────────────────────────────────────────────────┐
│            PAYMENT PROVIDER ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────────┘

OAYME FLOW:
┌─────────────────────────────────────────┐
│ Backend                                 │
├─────────────────────────────────────────┤
│ POST to OAYME API                       │
│ - Merchant ID                           │
│ - Amount (in smallest unit)             │
│ - Transaction ID                        │
│ - Signature (HMAC-SHA256)               │
├─────────────────────────────────────────┤
│ Receives:                               │
│ - Payment URL                           │
│ - OAYME Transaction ID                  │
├─────────────────────────────────────────┤
│ POST callback from OAYME                │
│ - Verify signature                      │
│ - Check amount                          │
│ - Update status in DB                   │
└─────────────────────────────────────────┘

CLICK FLOW:
┌─────────────────────────────────────────┐
│ Backend                                 │
├─────────────────────────────────────────┤
│ Generate payment URL                    │
│ - Service ID                            │
│ - Merchant Transaction ID               │
│ - Amount                                │
│ - Sign Time & Sign String (MD5)         │
├─────────────────────────────────────────┤
│ User enters card on CLICK portal        │
├─────────────────────────────────────────┤
│ POST callback from CLICK                │
│ - Verify MD5 signature                  │
│ - Check status code                     │
│ - Update payment record                 │
└─────────────────────────────────────────┘

UZUM FLOW:
┌─────────────────────────────────────────┐
│ Backend                                 │
├─────────────────────────────────────────┤
│ POST to UZUM API                        │
│ - Merchant ID                           │
│ - Amount (in smallest unit)             │
│ - Merchant Transaction ID               │
│ - Signature (SHA256)                    │
├─────────────────────────────────────────┤
│ Receives:                               │
│ - Payment URL                           │
│ - UZUM Transaction ID                   │
├─────────────────────────────────────────┤
│ POST callback from UZUM                 │
│ - Verify SHA256 signature               │
│ - Check status (SUCCESS/FAILED/PENDING) │
│ - Update payment in DB                  │
└─────────────────────────────────────────┘
```

## Database Schema Relationships

```
┌──────────────────────────────────────────────────────────────┐
│                   DATABASE SCHEMA                            │
└──────────────────────────────────────────────────────────────┘

USERS TABLE:
┌──────────────────────┐
│ id (PK)              │ ◄────┐
│ email (UNIQUE)       │      │
│ first_name           │      │
│ last_name            │      │
│ phone                │      │
│ password_hash        │      │
│ is_email_verified    │      │
│ is_phone_verified    │      │
│ created_at           │      │
│ updated_at           │      │
│ last_login_at        │      │
└──────────────────────┘      │
                              │
                        (ONE-TO-MANY)
                              │
                              │
PAYMENTS TABLE:               │
┌──────────────────────┐      │
│ id (PK)              │      │
│ user_id (FK) ───────────┘
│ order_id             │
│ amount               │
│ currency             │
│ method               │
│ status               │
│ transaction_id       │
│ metadata             │
│ created_at           │
│ updated_at           │
│ completed_at         │
└──────────────────────┘

INDEXES:
- users(email)
- payments(user_id)
- payments(transaction_id)
- payments(status)
- payments(created_at DESC)

ROW LEVEL SECURITY:
- Users can only see their own profile
- Users can only see their own payments
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   DEPLOYMENT OPTIONS                           │
└─────────────────────────────────────────────────────────────────┘

DEVELOPMENT:
┌──────────────────────────────────┐
│ npm run dev:watch                │
│ localhost:5000                   │
│ (with auto-reload)               │
└──────────────────────────────────┘

LOCAL DOCKER:
┌──────────────────────────────────┐
│ docker-compose up -d              │
│ Maps port 5000                   │
│ Hot-reload enabled               │
└──────────────────────────────────┘

PRODUCTION - HEROKU:
┌──────────────────────────────────┐
│ Git push heroku main             │
│ Automatic build & deploy         │
│ Environment variables via CLI    │
└──────────────────────────────────┘

PRODUCTION - CLOUD:
┌──────────────────────────────────┐
│ Docker image build               │
│ Push to registry                 │
│ Deploy to Kubernetes/Cloud Run   │
└──────────────────────────────────┘

PRODUCTION - VPS:
┌──────────────────────────────────┐
│ Clone repo                       │
│ npm install                      │
│ PM2 for process management       │
│ Nginx as reverse proxy           │
│ SSL/TLS certificates             │
└──────────────────────────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING FLOW                          │
└─────────────────────────────────────────────────────────────────┘

REQUEST:
   │
   ├─> Input validation fails
   │   │
   │   └─> Return 400 Bad Request
   │       {
   │         "success": false,
   │         "message": "Validation failed",
   │         "errors": [...]
   │       }
   │
   ├─> Authentication fails
   │   │
   │   └─> Return 401 Unauthorized
   │       {
   │         "success": false,
   │         "message": "Invalid token"
   │       }
   │
   ├─> Authorization fails
   │   │
   │   └─> Return 403 Forbidden
   │       {
   │         "success": false,
   │         "message": "Access denied"
   │       }
   │
   ├─> Resource not found
   │   │
   │   └─> Return 404 Not Found
   │       {
   │         "success": false,
   │         "message": "User not found"
   │       }
   │
   ├─> Business logic error
   │   │
   │   └─> Return 400 Bad Request
   │       {
   │         "success": false,
   │         "message": "Email already registered"
   │       }
   │
   └─> Server error
       │
       └─> Return 500 Internal Server Error
           {
             "success": false,
             "message": "Internal Server Error",
             "error": "Stack trace (dev only)"
           }
           
    LOG:
    [ERROR] timestamp | path | method | statusCode | message
```

---

These diagrams show the complete architecture and flow of the backend system. Refer to them when understanding how different components interact.
