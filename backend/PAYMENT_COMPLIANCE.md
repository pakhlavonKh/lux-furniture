# Payment Provider Compliance Documentation

## Overview
This document outlines the compliance changes made to ensure adherence with payment provider protocols:
- **UZUM Bank**: Merchant API (Webhook-based, HTTP Basic Auth)
- **Paycom (Payme)**: JSON-RPC 2.0 protocol
- **CLICK**: MD5 signature verification

---

## 1. UZUM Bank - Merchant API (CRITICAL UPDATE)

### Protocol: HTTP POST with Basic Auth
**Reference**: https://developer.uzumbank.uz/en/merchant/

### Architecture Change
- **Old**: REST API calls with Bearer token
- **New**: Webhook-based architecture where UZUM Bank initiates requests to your server

### Webhook Endpoints

All endpoints require HTTP Basic Auth header:
```
Authorization: Basic <base64(username:password)>
```

#### 1. `/uzum/check` - Verify Payment Possibility
**When**: User initiates payment
**Response Status**: 200 OK

Request from UZUM Bank:
```json
{
  "serviceId": 101202,
  "timestamp": 1698361456728,
  "params": {
    "account": "123456789"
  }
}
```

Response from your server:
```json
{
  "serviceId": 101202,
  "timestamp": 1698361457021,
  "status": "OK",
  "data": {
    "account": "123456789",
    "fio": "Customer Name",
    "amount": 2500000
  }
}
```

#### 2. `/uzum/create` - Create Transaction
**When**: Transaction created in UZUM system
**Stores**: `trans_time` - when transaction was created

Request from UZUM Bank:
```json
{
  "serviceId": 101202,
  "timestamp": 1698361456728,
  "transId": "5c398d7e-76b6-11ee-96da-f3a095c6289d",
  "params": { "account": 123456789 },
  "amount": 2500000
}
```

Your server must:
- Create transaction record with `trans_time`
- Return `status: "CREATED"` with timestamps

#### 3. `/uzum/confirm` - Confirm Payment
**When**: Transaction confirmed after funds debited
**Stores**: `confirm_time` - when payment was confirmed

Request from UZUM Bank:
```json
{
  "serviceId": 101202,
  "timestamp": 1698361456728,
  "transId": "5c398d7e-76b6-11ee-96da-f3a095c6289d",
  "paymentSource": "INSTALLMENT",
  "tariff": "003",
  "phone": "998901234567",
  "cardType": 2
}
```

Your server must:
- Mark transaction as CONFIRMED
- Store `confirm_time`
- Provide service to user
- Return `status: "CONFIRMED"`

**CRITICAL**: If server error or timeout, UZUM Bank will retry `/status` for up to 10 attempts

#### 4. `/uzum/reverse` - Cancel Transaction
**When**: Transaction must be reversed/refunded
**Stores**: `reverse_time` - when cancellation occurred

#### 5. `/uzum/status` - Check Transaction Status
**When**: UZUM Bank needs to verify transaction status (after server errors)
**Timeout Handling**: Transaction must be marked FAILED if no `/confirm` within 30 minutes

### Configuration Required

Update `backend/src/config/index.ts`:
```typescript
payments: {
  uzum: {
    isDev: process.env.UZUM_DEV === 'true',
    devApiUrl: 'https://sandbox-api.uzumbank.uz',
    prodApiUrl: 'https://api.uzumbank.uz',
    merchantId: process.env.UZUM_MERCHANT_ID,
    username: process.env.UZUM_USERNAME,    // HTTP Basic Auth
    password: process.env.UZUM_PASSWORD,    // HTTP Basic Auth
    secretKey: process.env.UZUM_SECRET_KEY,
    callbackUrl: 'https://yourdomain.com/api/payments/uzum/callback'
  }
}
```

### Database
New table `uzum_transactions` tracks transaction lifecycle:
- `trans_time`: When transaction created in UZUM
- `confirm_time`: When transaction confirmed 
- `reverse_time`: When transaction reversed
- Schema includes all required fields per protocol

### Verification Checklist
- ✅ HTTP 200 responses for all webhook handlers
- ✅ Basic Auth verification on all endpoints
- ✅ Transaction state tracking (trans_time, confirm_time, reverse_time)
- ✅ 30-minute confirmation timeout handling
- ✅ Retry logic support (up to 10 attempts for status checks)

---

## 2. Paycom (Payme) - JSON-RPC 2.0 Protocol

### Protocol: JSON-RPC 2.0 over HTTPS with Basic Auth
**Reference**: https://developer.help.paycom.uz/protokol-merchant-api/

### Architecture Change
- **Old**: REST endpoints with signatures
- **New**: JSON-RPC 2.0 method calls with HTTP Basic Auth

### Implementation

All requests use this structure:
```json
{
  "jsonrpc": "2.0",
  "method": "MethodName",
  "params": {
    "param1": "value1",
    "time": <unix_timestamp_ms>
  },
  "id": <request_id>
}
```

Authorization:
```
Authorization: Basic <base64(username:password)>
```

### Key Changes

1. **CheckTransaction** - Verify account/service
   ```json
   {
     "jsonrpc": "2.0",
     "method": "CheckTransaction",
     "params": {
       "account": { "order_id": "12345" },
       "time": 1698361456728
     },
     "id": 1
   }
   ```

2. **CreateTransaction** - Create payment
   ```json
   {
     "method": "CreateTransaction",
     "params": {
       "amount": 250000000,
       "account": { "order_id": "12345" },
       "description": "Purchase description",
       "return_url": "https://yoursite.com/success"
     }
   }
   ```

3. **GetStatement** - Check status
   ```json
   {
     "method": "GetStatement",
     "params": {
       "from": 1698360000000,
       "till": 1698361456728,
       "transactions": "transaction_id"
     }
   }
   ```

4. **PerformTransaction** - Process payment (callback-style)
5. **CancelTransaction** - Refund payment

### Configuration Required

Update environment variables:
```
PAYME_USERNAME=your_username
PAYME_PASSWORD=your_password
PAYME_MERCHANT_ID=your_merchant_id
PAYME_API_URL=https://gateway.paycom.uz/api/
```

### Compliance Notes
- ✅ All requests return JSON-RPC 2.0 format
- ✅ Basic Auth required for all endpoints
- ✅ Amount in tiyn (smallest unit: 1 UZS = 100 tiyn)
- ✅ Error responses use JSON-RPC error format
- ✅ Request ID tracking for response correlation

---

## 3. CLICK - MD5 Signature Verification

### Protocol: REST with MD5 Signing
**Reference**: https://docs.click.uz/merchant/

### Current Implementation
✅ Already compliant with MD5 signature requirements

**Signature Format**:
```
sign_string = MD5(service_id;click_trans_id;;sign_time;secret_key)
```

### No Changes Required
The CLICK implementation follows the documented protocol correctly.

---

## Database Schema

### New Tables
- `uzum_transactions` - Tracks UZUM Merchant API transaction lifecycle

### Updated Columns
- `payments.transaction_id` - Now tracks all provider transaction IDs
- `payments.metadata` - Stores provider-specific data

---

## Testing Checklist

### UZUM Bank
- [ ] Test /check webhook with valid account
- [ ] Test /create webhook creates transaction record
- [ ] Test /confirm webhook confirms transaction with timestamps
- [ ] Test /reverse webhook for refunds
- [ ] Test /status webhook with nonexistent transaction
- [ ] Verify Basic Auth rejection on missing header
- [ ] Test 30-minute timeout scenario

### Paycom (Payme)
- [ ] Test JSON-RPC 2.0 CheckTransaction
- [ ] Test CreateTransaction method
- [ ] Test GetStatement for status checks
- [ ] Verify Basic Auth in all requests
- [ ] Test error response format (JSON-RPC errors)

### CLICK
- [ ] Verify MD5 signatures still working
- [ ] Test callback processing

---

## Environment Variables Required

```bash
# UZUM Bank
UZUM_DEV=false
UZUM_MERCHANT_ID=your_merchant_id
UZUM_USERNAME=your_username
UZUM_PASSWORD=your_password
UZUM_SECRET_KEY=your_secret_key
UZUM_API_URL=https://api.uzumbank.uz

# Paycom (Payme)
PAYME_USERNAME=your_username
PAYME_PASSWORD=your_password
PAYME_MERCHANT_ID=your_merchant_id
PAYME_API_URL=https://gateway.paycom.uz/api/

# CLICK
CLICK_SERVICE_ID=your_service_id
CLICK_SECRET_KEY=your_secret_key
CLICK_API_URL=https://api.click.uz
```

---

## API Endpoints Summary

```
POST /api/payments/create              - Create payment (authenticated)
GET  /api/payments/status              - Check payment status (authenticated)
GET  /api/payments/list                - List user payments (authenticated)
POST /api/payments/refund              - Refund payment (authenticated)

POST /api/payments/uzum/check          - UZUM check webhook
POST /api/payments/uzum/create         - UZUM create webhook
POST /api/payments/uzum/confirm        - UZUM confirm webhook
POST /api/payments/uzum/reverse        - UZUM reverse webhook
POST /api/payments/uzum/status         - UZUM status webhook

POST /api/payments/payme/callback      - Payme JSON-RPC endpoint
POST /api/payments/click/callback      - CLICK callback endpoint
```

---

## Security Notes

1. **HTTP Basic Auth** (UZUM & Payme)
   - Credentials transmitted in Authorization header (use HTTPS)
   - Decoded in memory only, never logged
   - Verified on every webhook request

2. **Signatures** (CLICK)
   - MD5 commonly used (not cryptographically secure but industry standard)
   - Consider SHA256 for new implementations

3. **HTTPS Required**
   - All payment traffic must use TLS 1.2+
   - Certificates must be valid and not self-signed in production

---

## Migration Path

1. Deploy database migration for `uzum_transactions` table
2. Update environment variables with auth credentials
3. Deploy updated UZUM service (webhook handlers)
4. Deploy updated Payme service (JSON-RPC 2.0)
5. Update payment routes to register new webhook endpoints
6. Test each provider in sandbox environment
7. Verify webhook endpoint accessibility from provider servers
8. Deploy to production

---

## Support Resources

- **UZUM Bank**: https://developer.uzumbank.uz/en/merchant/
- **Paycom**: https://developer.help.paycom.uz/protokol-merchant-api/
- **CLICK**: https://docs.click.uz/merchant/
