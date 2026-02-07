# MongoDB Atlas Migration Summary

## Overview
Successfully migrated the Lux Furniture backend from **Supabase (PostgreSQL)** to **MongoDB Atlas** using **Mongoose ODM**.

---

## Changes Made

### 1. Dependencies Updated
**Removed:**
- `@supabase/supabase-js` - Supabase client library

**Added:**
- `mongoose@^7.5.0` - MongoDB ODM for Node.js

File: `package.json`

### 2. Configuration Updates

#### `src/config/index.ts`
**Before:**
```typescript
SUPABASE_URL: process.env.SUPABASE_URL || '',
SUPABASE_KEY: process.env.SUPABASE_KEY || '',
SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
```

**After:**
```typescript
MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://...',
MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'lux-furniture',
```

#### New File: `src/config/mongodb.ts`
- Replaces `src/config/supabase.ts`
- Manages MongoDB connection
- Handles graceful disconnect on server shutdown
- Automatic connection pooling

File: `src/config/mongodb.ts`

### 3. Models Created

#### `src/models/User.ts`
Mongoose schema for user authentication:
- Email (unique index)
- Phone (sparse index)
- Password hash
- Verification flags
- Timestamps

#### `src/models/Payment.ts`
Mongoose schema for payment transactions:
- References to User
- Payment method (payme, click, uzum)
- Status tracking
- Transaction ID (unique, sparse)
- Metadata storage
- Multiple indexes for performance

#### `src/models/UzumTransaction.ts`
Mongoose schema for UZUM-specific webhooks:
- Transaction lifecycle tracking
- UZUM webhook event timestamps
- Payment source and card details
- Service ID and account mapping
- Status tracking (PENDING, CREATED, CONFIRMED, REVERSED, FAILED)

Files:
- `src/models/User.ts`
- `src/models/Payment.ts`
- `src/models/UzumTransaction.ts`

### 4. Service Updates

#### `src/services/payment.service.ts`
**Before:**
- Used Supabase client: `await this.supabase.from('payments').insert()`

**After:**
- Uses Mongoose models: `await Payment.create({})`
- Removed manual field mapping (snake_case to camelCase)
- Leverages Mongoose validation and hooks
- Automatic ObjectId generation

Key changes:
```typescript
// Before: Supabase
const { error } = await this.supabase.from('payments').insert([{ ... }]);

// After: Mongoose  
const payment = await Payment.create({ ... });
```

#### `src/payments/templates/uzum.service.ts`
**Before:**
- Used Supabase client
- Bearer token authentication (incorrect for UZUM)

**After:**
- Uses UzumTransaction and Payment models
- Proper HTTP Basic Auth verification
- Webhook state tracking with timestamps
- MongoDB native queries

### 5. Server Startup

#### `src/server.ts`
**Before:**
```typescript
const server = app.listen(PORT, () => { ... });
```

**After:**
```typescript
const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, () => { ... });
};

startServer();
```

- Now connects to MongoDB before starting Express server
- Graceful shutdown disconnects MongoDB
- Better error handling for connection failures

### 6. Database Initialization

#### New File: `src/scripts/seed.ts`
- Replaces SQL migrations
- Creates collections and indexes
- Runs with: `npm run seed`
- Provides visual confirmation

Run after environment setup:
```bash
npm run seed
```

### 7. Environment Variables

#### Created: `.env.example`
Template for all environment variables:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
MONGODB_DB_NAME=lux-furniture
```

---

## Comparison: Supabase vs MongoDB

| Aspect | Supabase | MongoDB |
|--------|----------|---------|
| **Database Type** | PostgreSQL (SQL) | NoSQL (Document) |
| **ORM/Driver** | Supabase JS client | Mongoose |
| **Schema** | Rigid (SQL migrations) | Flexible (JSON documents) |
| **ID Type** | UUID string | ObjectId |
| **Timestamps** | Manual management | Auto-managed |
| **Migrations** | SQL files | Mongoose indexes |
| **Field Naming** | snake_case | camelCase (JS native) |
| **Scaling** | Vertical first | Horizontal (sharding) |
| **Backups** | Manual or Supabase managed | MongoDB Atlas managed |

---

## File Structure Changes

### Removed
```
backend/src/config/supabase.ts
backend/supabase/migrations/001_init_schema.sql
backend/supabase/migrations/002_create_uzum_transactions.sql
```

### Added
```
backend/src/config/mongodb.ts
backend/src/models/
  ├── User.ts
  ├── Payment.ts
  └── UzumTransaction.ts
backend/src/scripts/seed.ts
backend/.env.example
backend/MONGODB_SETUP.md
```

### Modified
```
backend/package.json              (dependencies)
backend/src/config/index.ts       (MongoDB env vars)
backend/src/server.ts             (MongoDB connection)
backend/src/services/payment.service.ts  (Mongoose queries)
backend/src/payments/templates/uzum.service.ts (Mongoose queries)
```

---

## Setup Checklist

After pulling these changes:

- [ ] 1. Create MongoDB Atlas account and cluster
- [ ] 2. Get MongoDB URI connection string
- [ ] 3. Update `.env` file with MongoDB credentials:
  ```bash
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lux-furniture
  MONGODB_DB_NAME=lux-furniture
  ```
- [ ] 4. Install dependencies:
  ```bash
  npm install
  ```
- [ ] 5. Initialize database:
  ```bash
  npm run seed
  ```
- [ ] 6. Start development server:
  ```bash
  npm run dev:watch
  ```
- [ ] 7. Test payment flows with each provider

---

## Data Types Mapping

| PostgreSQL | MongoDB | Mongoose Type |
|-----------|---------|---------------|
| BIGINT | Number | `Number` |
| VARCHAR | String | `String` |
| BOOLEAN | Boolean | `Boolean` |
| TIMESTAMP | Date | `Date` |
| UUID | ObjectId | `Schema.Types.ObjectId` |
| JSON | Object | `Schema.Types.Mixed` |
| INTEGER (enum) | String | `String` with enum |

---

## Query Examples

### Before (Supabase)
```typescript
const { data, error } = await supabase
  .from('payments')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

### After (Mongoose)
```typescript
const payments = await Payment.find({ userId })
  .sort({ createdAt: -1 });
```

---

## Performance Considerations

1. **Indexes**
   - Automatically created from Mongoose schema definitions
   - Unique indexes on `email`, `transactionId`
   - Compound indexes on frequently queried combinations

2. **Connection Pooling**
   - Mongoose handles automatic connection pooling
   - Configured with `retryWrites: true` and `w: 'majority'`

3. **Query Optimization**
   - Use `.lean()` for read-only queries to improve performance
   - Use projections to limit returned fields
   - Use aggregation pipeline for complex queries

---

## Troubleshooting

**Connection Error**: Check MongoDB connection string format and IP whitelist in MongoDB Atlas > Network Access

**Query Errors**: Verify field names are camelCase (MongoDB native) not snake_case

**Timeout Errors**: Increase `socketTimeoutMS` in MongoDB connection options if needed

See `MONGODB_SETUP.md` for detailed troubleshooting guide.

---

## Rollback Plan (if needed)

If rollback to Supabase is necessary:
1. Restore `supabase.ts` from git history
2. Restore `seed.ts` original content
3. Reinstall `@supabase/supabase-js`
4. Export MongoDB data to JSON and transform to PostgreSQL schema
5. Update service files back to Supabase client calls

---

## Documentation

- **[MONGODB_SETUP.md](MONGODB_SETUP.md)** - Complete MongoDB setup guide
- **[PAYMENT_COMPLIANCE.md](PAYMENT_COMPLIANCE.md)** - Payment provider compliance
- Source code documentation in each model and service file

---

## Support

For issues:
1. Check `.env` file for correct MongoDB credentials
2. Verify MongoDB Atlas cluster is running
3. Check network access whitelist in MongoDB Atlas
4. Review error logs in `npm run dev:watch` output
5. Check MongoDB Atlas dashboard for connection issues
