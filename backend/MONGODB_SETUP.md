# MongoDB Atlas Migration Guide

This document covers the migration from Supabase (PostgreSQL) to MongoDB Atlas.

## Overview

The project has been successfully migrated to use **MongoDB Atlas** with **Mongoose ODM** for data persistence. This provides:

- ✅ Flexible schema with document-based storage
- ✅ Built-in indexing and query optimization
- ✅ Type-safe models with Mongoose schemas
- ✅ Automatic timestamp management
- ✅ Seamless integration with Node.js/Express

---

## Setup Instructions

### 1. Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new project: "lux-furniture"
4. Create a new cluster (M0 Free tier is fine for development)
5. Wait for cluster to be deployed (~10 minutes)

### 2. Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string in format: 
   ```
   mongodb+srv://username:password@cluster-name.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
   ```
4. Replace `username`, `password`, and `database-name` as needed

### 3. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# MongoDB Atlas
MONGODB_URI=mongodb+srv://your_username:your_password@cluster-name.mongodb.net/lux-furniture
MONGODB_DB_NAME=lux-furniture

# Other configurations (unchanged)
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-key
...
```

### 4. Install Dependencies

```bash
cd backend
npm install
```

This installs **Mongoose** (MongoDB ODM) and all dependencies.

### 5. Initialize Database & Collections

Run the seed script to create collections and indexes:

```bash
npm run seed
```

This will:
- Connect to MongoDB Atlas
- Create collections: `users`, `payments`, `uzum_transactions`
- Create necessary indexes for performance
- Display confirmation message

### 6. Start the Development Server

```bash
npm run dev:watch
```

The server will:
- Connect to MongoDB automatically on startup
- Create collections if they don't exist
- Listen on port 5000

---

## Database Schema

### Collections

#### 1. **users**
Stores user authentication and profile information.

```typescript
{
  _id: ObjectId,
  email: string (unique),
  phone?: string,
  firstName: string,
  lastName: string,
  passwordHash: string,
  isEmailVerified: boolean,
  isPhoneVerified: boolean,
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt?: Date
}
```

**Indexes**: `email`, `phone`, `createdAt`

#### 2. **payments**
Tracks all payment transactions across payment providers.

```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  orderId: string,
  amount: number,
  currency: string ('UZS', 'USD', 'EUR'),
  method: string ('payme', 'click', 'uzum'),
  status: string ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'),
  transactionId?: string (unique),
  metadata?: Object,
  completedAt?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: `userId`, `orderId`, `transactionId`, `status`, `method`, `createdAt`

#### 3. **uzum_transactions**
Specific tracking for UZUM Bank webhook-based transactions (per UZUM Merchant API protocol).

```typescript
{
  _id: ObjectId,
  transactionId: string (unique),
  serviceId: number,
  account?: string,
  amount: number,
  status: string ('PENDING', 'CREATED', 'CONFIRMED', 'REVERSED', 'FAILED'),
  transTime?: Date,           // When transaction created in UZUM
  confirmTime?: Date,         // When transaction confirmed
  reverseTime?: Date,         // When transaction reversed
  paymentSource?: string,
  phone?: string,
  cardType?: number,
  processingReferenceNumber?: string,
  paymentId?: ObjectId (ref: Payment),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: `transactionId`, `serviceId`, `status`, `paymentId`, `createdAt`

---

## Mongoose Models

All models are defined in `src/models/`:

- `User.ts` - User authentication model
- `Payment.ts` - Payment transactions
- `UzumTransaction.ts` - UZUM-specific transactions

### Example Usage in Services

```typescript
// Create
const payment = await Payment.create({
  userId,
  orderId,
  amount,
  method: 'payme',
  status: 'pending'
});

// Find by ID
const payment = await Payment.findById(paymentId);

// Find by query
const userPayments = await Payment.find({ userId });

// Update
await Payment.findByIdAndUpdate(paymentId, {
  status: 'completed',
  completedAt: new Date()
});

// Find and update
const updated = await Payment.findOneAndUpdate(
  { transactionId },
  { status: 'completed' },
  { new: true }
);

// Delete
await Payment.findByIdAndDelete(paymentId);
```

---

## Benefits of MongoDB

### 1. **Flexible Schema**
- Add optional fields without migrations
- Modify document structure on-the-fly
- Backward compatible with existing documents

### 2. **Developer Friendly**
- JSON-like document structure matches JavaScript objects
- No impedance mismatch between app and database
- Easy to work with nested data

### 3. **Scalability**
- Horizontal scaling with sharding
- Built-in replication for high availability
- Better performance for certain query patterns

### 4. **Atlas Platform**
- Automatic backups every 24 hours
- Built-in monitoring and alerts
- M0 free tier for development/testing
- Auto-scaling options for production

---

## Migration Checklist

- ✅ Replaced `@supabase/supabase-js` with `mongoose`
- ✅ Created MongoDB config (`src/config/mongodb.ts`)
- ✅ Defined Mongoose schemas (`src/models/`)
- ✅ Updated payment service to use Mongoose
- ✅ Updated UZUM service for MongoDB
- ✅ Updated server startup to connect MongoDB
- ✅ Created seed script for initialization
- ✅ Removed SQL migrations
- ✅ Updated environment variables

---

## Querying Data

### Find Operations

```typescript
// Find one
const user = await User.findById(userId);
const user = await User.findOne({ email: 'user@example.com' });

// Find many
const payments = await Payment.find({ userId });

// With operators
const recent = await Payment.find({ 
  createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
});

// With sorting and limiting
const top = await Payment.find()
  .sort({ createdAt: -1 })
  .limit(10);

// With projection
const partial = await Payment.find({}, { amount: 1, status: 1 });
```

### Update Operations

```typescript
// Update one
await Payment.updateOne(
  { _id: paymentId },
  { status: 'completed' }
);

// Replace entire document
await Payment.replaceOne({ _id: paymentId }, newPaymentData);

// Update many
await Payment.updateMany(
  { status: 'pending', createdAt: { $lt: oldDate } },
  { status: 'failed' }
);
```

### Delete Operations

```typescript
// Delete one
await Payment.deleteOne({ _id: paymentId });

// Delete many
await Payment.deleteMany({ status: 'pending' });
```

---

## Troubleshooting

### Connection Issues

**Error**: "ECONNREFUSED"
- Check MongoDB URI in `.env`
- Verify IP whitelist in MongoDB Atlas > Network Access
- Ensure internet connection

**Error**: "Authentication failed"
- Check username and password in connection string
- Verify user has database access privileges
- Password may contain special characters - URL encode if needed

### Query Issues

**Error**: "Cannot read property '_id' of null"
- The document doesn't exist
- Use `.findOne()` instead of `.findById()` if needed
- Check query conditions

**Error**: "Validation failed"
- Document doesn't match schema requirements
- Check required fields are provided
- Verify field types match schema definition

---

## Performance Tips

1. **Create indexes for frequently queried fields**
   ```typescript
   userSchema.index({ email: 1 });
   ```

2. **Use projections to limit returned fields**
   ```typescript
   await Payment.find({}, { amount: 1, status: 1 });
   ```

3. **Use pagination for large result sets**
   ```typescript
   const page = 1;
   const limit = 20;
   const skip = (page - 1) * limit;
   await Payment.find().skip(skip).limit(limit);
   ```

4. **Use aggregation pipeline for complex queries**
   ```typescript
   const result = await Payment.aggregate([
     { $match: { status: 'completed' } },
     { $group: { _id: '$userId', total: { $sum: '$amount' } } },
     { $sort: { total: -1 } }
   ]);
   ```

---

## Common MongoDB Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$eq` | Equal | `{ status: { $eq: 'completed' } }` |
| `$ne` | Not equal | `{ status: { $ne: 'pending' } }` |
| `$gt` | Greater than | `{ amount: { $gt: 1000 } }` |
| `$gte` | Greater than or equal | `{ amount: { $gte: 1000 } }` |
| `$lt` | Less than | `{ amount: { $lt: 1000 } }` |
| `$lte` | Less than or equal | `{ amount: { $lte: 1000 } }` |
| `$in` | In array | `{ status: { $in: ['completed', 'processing'] } }` |
| `$nin` | Not in array | `{ status: { $nin: ['pending', 'failed'] } }` |
| `$exists` | Field exists | `{ phone: { $exists: true } }` |

---

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Query Language](https://docs.mongodb.com/manual/crud/)
- [MongoDB Performance](https://docs.mongodb.com/manual/administration/optimization/)

---

## Next Steps

1. ✅ Set up MongoDB Atlas cluster
2. ✅ Configure environment variables
3. ✅ Run `npm run seed` to initialize
4. ✅ Start development server with `npm run dev:watch`
5. Test payment flows with each provider
6. Monitor MongoDB Atlas dashboard for performance
7. Set up automated backups in Atlas
