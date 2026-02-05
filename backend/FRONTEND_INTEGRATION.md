# Integration Guide for Frontend

## Quick Start

### 1. Install SDK in Frontend

```bash
cd ../src  # Go to frontend directory
npm install axios
```

### 2. Create API Client

Create `src/services/api.ts`:

```typescript
import axios, { AxiosInstance } from 'axios';
import { useLanguageContext } from '@/contexts/useLanguageHook';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 3. Authentication Service

Create `src/services/auth.service.ts`:

```typescript
import api from './api';

export interface SignupData {
  email: string;
  password: string;
  passwordConfirm: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  signup: (data: SignupData) => api.post('/auth/signup', data),
  login: (data: LoginData) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (data: any) => api.post('/auth/change-password', data)
};

export default authService;
```

### 4. Payment Service

Create `src/services/payment.service.ts`:

```typescript
import api from './api';

export interface PaymentRequest {
  amount: number;
  orderId: string;
  description: string;
  method: 'oayme' | 'click' | 'uzum';
  returnUrl: string;
  phone?: string;
}

export const paymentService = {
  createPayment: (data: PaymentRequest) => api.post('/payments/create', data),
  checkStatus: (transactionId: string, method: string) =>
    api.get('/payments/status', { params: { transactionId, method } }),
  getUserPayments: () => api.get('/payments/list'),
  refundPayment: (paymentId: string) =>
    api.post('/payments/refund', { paymentId })
};

export default paymentService;
```

### 5. Update Environment Variables

Create `.env` in frontend:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_PAYMENT_RETURN_URL=http://localhost:5173/payment-success
```

For production:

```
REACT_APP_API_URL=https://api.lux-furniture.com/api
REACT_APP_PAYMENT_RETURN_URL=https://lux-furniture.com/payment-success
```

## Usage Examples

### Signup

```typescript
import { authService } from '@/services/auth.service';

const handleSignup = async (formData) => {
  try {
    const response = await authService.signup(formData);
    localStorage.setItem('accessToken', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    // Redirect to dashboard
  } catch (error) {
    console.error('Signup failed:', error);
  }
};
```

### Login

```typescript
import { authService } from '@/services/auth.service';

const handleLogin = async (email, password) => {
  try {
    const response = await authService.login({ email, password });
    localStorage.setItem('accessToken', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    // Redirect to dashboard
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Create Payment

```typescript
import { paymentService } from '@/services/payment.service';

const handlePayment = async (amount, orderId) => {
  try {
    const response = await paymentService.createPayment({
      amount,
      orderId,
      description: 'Furniture Purchase',
      method: 'click', // or 'oayme', 'uzum'
      returnUrl: window.location.href,
      phone: '+998901234567'
    });

    // Redirect to payment URL
    window.location.href = response.data.data.paymentUrl;
  } catch (error) {
    console.error('Payment failed:', error);
  }
};
```

### Check Payment Status

```typescript
import { paymentService } from '@/services/payment.service';

const checkPaymentStatus = async (transactionId, method) => {
  try {
    const response = await paymentService.checkStatus(transactionId, method);
    console.log('Payment status:', response.data.data.status);
  } catch (error) {
    console.error('Status check failed:', error);
  }
};
```

## Mobile App Integration

### React Native Example

```typescript
import axios from 'axios';

const API_BASE_URL = 'https://api.lux-furniture.com/api'; // Use your server IP for development

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const createPayment = async (amount, orderId, method, token) => {
  const response = await api.post(
    '/payments/create',
    {
      amount,
      orderId,
      method,
      returnUrl: 'com.luxfurniture://payment-success',
      description: 'Furniture Purchase'
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};
```

### Flutter Example

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

const String API_BASE_URL = 'https://api.lux-furniture.com/api';

Future<Map<String, dynamic>> login(String email, String password) async {
  final response = await http.post(
    Uri.parse('$API_BASE_URL/auth/login'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({'email': email, 'password': password}),
  );

  if (response.statusCode == 200) {
    return jsonDecode(response.body);
  } else {
    throw Exception('Login failed');
  }
}

Future<Map<String, dynamic>> createPayment(
  String token,
  int amount,
  String orderId,
  String method,
) async {
  final response = await http.post(
    Uri.parse('$API_BASE_URL/payments/create'),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    },
    body: jsonEncode({
      'amount': amount,
      'orderId': orderId,
      'method': method,
      'returnUrl': 'https://lux-furniture.com/payment-success',
      'description': 'Furniture Purchase',
    }),
  );

  if (response.statusCode == 200) {
    return jsonDecode(response.body);
  } else {
    throw Exception('Payment creation failed');
  }
}
```

## Authentication Flow

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │ POST /auth/signup or /auth/login
       ▼
┌─────────────────┐
│   Backend API   │
│  - Verify creds │
│  - Hash password│
│  - Generate JWT │
└────────┬────────┘
         │ Returns token & refreshToken
         ▼
┌─────────────────────────────────────┐
│  Store in localStorage/Secure Storage│
│  - accessToken (7 days)             │
│  - refreshToken (30 days)           │
└─────────────────────────────────────┘
         │
         │ All requests include Bearer token
         ▼
┌──────────────────────────┐
│  Protected Routes        │
│  /api/auth/profile       │
│  /api/payments/create    │
└──────────────────────────┘
```

## Payment Flow

```
┌──────────────────┐
│  User selects    │
│  payment method  │
└─────────┬────────┘
          │
          ▼
┌──────────────────────────────────┐
│  POST /api/payments/create       │
│  - Amount, OrderID, Method, etc. │
└─────────┬────────────────────────┘
          │
          ▼
┌──────────────────────────────────┐
│  Backend                         │
│  - Create payment record         │
│  - Call payment provider API     │
│  - Get payment URL               │
└─────────┬────────────────────────┘
          │ Returns paymentUrl & transactionId
          ▼
┌──────────────────────────────────┐
│  Frontend                        │
│  - Redirect to payment URL       │
│  - User enters card details      │
└─────────┬────────────────────────┘
          │
          ▼
┌──────────────────────────────────┐
│  Payment Provider                │
│  (OAYME, CLICK, UZUM)            │
│  - Process payment               │
│  - Send callback                 │
└─────────┬────────────────────────┘
          │
          ▼
┌──────────────────────────────────┐
│  POST /api/payments/{provider}/  │
│        callback                  │
│  - Verify signature              │
│  - Update payment status         │
└─────────┬────────────────────────┘
          │
          ▼
┌──────────────────────────────────┐
│  Frontend                        │
│  - Check payment status          │
│  - Show confirmation             │
│  - Complete order                │
└──────────────────────────────────┘
```

## CORS Configuration

The backend is already configured to accept requests from:
- `http://localhost:5173` (development)
- Your production domain (update in `.env`)

If you're making requests from a different URL, update CORS in the backend.
