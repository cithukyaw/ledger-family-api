# Ledger Family API Documentation

## Overview
The Ledger Family API is a RESTful API for managing family finances, including users, expenses, categories, ledgers, and budgets. It uses JWT-based authentication and is built with Express.js and Prisma ORM.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Tokens can be provided either:
1. As a Bearer token in the Authorization header
2. As an HTTP-only cookie (if `JWT_COOKIE_NAME` is configured)

## Error Responses
All error responses follow this format:
```json
[
  {
    "field": "fieldName",
    "message": "Error description"
  }
]
```

## API Endpoints

### Authentication

#### Check Email Availability
Check if an email address is available for registration.

**Endpoint:** `POST /auth/availability`
**Authentication:** Not required

**Request Body:**
```json
{
  "email": "string"
}
```

**Responses:**
- `204`: Email is available
- `400`: Email is not available or invalid

#### Register User
Register a new user.

**Endpoint:** `POST /auth/register`
**Authentication:** Not required

**Request Body:**
```json
{
  "name": "string (optional)",
  "email": "string",
  "password": "string (6-20 characters)"
}
```

**Responses:**
- `201`: User created successfully
- `400`: Validation error

#### Pre-check Login
Verify if an email exists and is active before login.

**Endpoint:** `POST /auth/login/precheck`
**Authentication:** Not required

**Request Body:**
```json
{
  "email": "string"
}
```

**Responses:**
- `200`: Email is valid
  ```json
  {
    "id": "number"
  }
  ```
- `400`: Email not found or user inactive

#### Login
Authenticate a user with email and password.

**Endpoint:** `POST /auth/login`
**Authentication:** Not required

**Request Body:**
```json
{
  "email": "string",
  "password": "string (6-20 characters)"
}
```

**Responses:**
- `200`: Login successful
  ```json
  {
    "user": {
      "id": "number",
      "name": "string",
      "email": "string",
      "role": "string",
      "active": "boolean"
    },
    "accessToken": "string",
    "refreshToken": "string"
  }
  ```
- `400`: Invalid credentials

#### Refresh Token
Refresh JWT tokens using a refresh token.

**Endpoint:** `POST /auth/refresh`
**Authentication:** Not required

**Request Body:**
```json
{
  "token": "string"
}
```

**Responses:**
- `200`: New tokens generated
  ```json
  {
    "accessToken": "string",
    "refreshToken": "string"
  }
  ```
- `400`: Invalid token

#### Logout
Invalidate user session.

**Endpoint:** `POST /auth/logout`
**Authentication:** Required

**Request Body:**
```json
{
  "id": "number"
}
```

**Responses:**
- `204`: Logout successful
- `400`: Validation error

### Users

#### Get All Users
Retrieve a list of all users.

**Endpoint:** `GET /users`
**Authentication:** Required

**Responses:**
- `200`: List of users
  ```json
  [
    {
      "id": "number",
      "name": "string",
      "email": "string",
      "role": "string",
      "active": "boolean"
    }
  ]
  ```

#### Get User by ID
Retrieve a specific user by ID.

**Endpoint:** `GET /users/:id`
**Authentication:** Required

**Responses:**
- `200`: User details
  ```json
  {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "string",
    "active": "boolean"
  }
  ```
- `400`: Validation error or unauthorized access
- `404`: User not found

#### Update User
Update user information.

**Endpoint:** `PATCH /users/:id`
**Authentication:** Required

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string (optional, 6-20 characters)"
}
```

**Responses:**
- `200`: Updated user details
  ```json
  {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "string",
    "active": "boolean"
  }
  ```
- `400`: Validation error

#### Get User Ledger
Retrieve a user's ledger for a specific date.

**Endpoint:** `GET /users/:id/ledgers`
**Authentication:** Required

**Query Parameters:**
- `date`: String (format: YYYY-MM-DD) - Optional, defaults to current month

**Responses:**
- `200`: Ledger data
- `400`: Validation error

### Expenses

#### Get Expenses
Retrieve a list of expenses based on filters.

**Endpoint:** `GET /expenses`
**Authentication:** Required

**Query Parameters:**
- `userId`: Number (required)
- `from`: String (format: YYYY-MM-DD, required)
- `to`: String (format: YYYY-MM, required)
- `category`: Number[] (optional)
- `paymentType`: String (optional)
- `keyword`: String (optional)

**Responses:**
- `200`: List of expenses with metadata
  ```json
  {
    "data": [
      {
        "id": "number",
        "userId": "number",
        "categoryId": "number",
        "type": "string",
        "date": "string",
        "title": "string",
        "amount": "number",
        "remarks": "string",
        "createdAt": "datetime",
        "updatedAt": "datetime",
        "deletedAt": "datetime"
      }
    ],
    "meta": {
      "count": "number",
      "total": "number",
      "totalCash": "number",
      "totalBank": "number"
    }
  }
  ```
- `400`: Validation error

#### Create Expense
Create a new expense record.

**Endpoint:** `POST /expenses`
**Authentication:** Required

**Request Body:**
```json
{
  "userId": "number",
  "date": "string (format: YYYY-MM-DD)",
  "title": "string",
  "amount": "number",
  "category": "number (optional)",
  "type": "string",
  "remarks": "string (optional)"
}
```

**Responses:**
- `201`: Created expense
- `400`: Validation error

#### Update Expense
Update an existing expense record.

**Endpoint:** `PUT /expenses/:id`
**Authentication:** Required

**Request Body:**
```json
{
  "userId": "number",
  "date": "string (format: YYYY-MM-DD)",
  "title": "string",
  "amount": "number",
  "category": "number (optional)",
  "type": "string",
  "remarks": "string (optional)"
}
```

**Responses:**
- `201`: Updated expense
- `400`: Validation error

#### Get Expense by ID
Retrieve a specific expense by ID.

**Endpoint:** `GET /expenses/:id`
**Authentication:** Required

**Responses:**
- `200`: Expense details
- `400`: Validation error
- `404`: Expense not found

#### Delete Expense
Delete an expense by ID.

**Endpoint:** `DELETE /expenses/:id`
**Authentication:** Required

**Responses:**
- `200`: Deleted expense
- `400`: Validation error

#### Get Payment Types
Retrieve a list of payment types.

**Endpoint:** `GET /expenses/payment-types`
**Authentication:** Required

**Responses:**
- `200`: Payment types mapping
  ```json
  {
    "cash": "Cash",
    "aya_pay": "AYA Pay",
    "aya_bank": "AYA Banking",
    "cb_pay": "CB Pay",
    "cb_bank": "CB Banking",
    "kpay": "KBZ Pay",
    "kbz_bank": "KBZ Banking",
    "wave_pay": "WavePay"
  }
  ```

### Categories

#### Get Categories
Retrieve a list of all categories.

**Endpoint:** `GET /categories`
**Authentication:** Required

**Responses:**
- `200`: List of categories
  ```json
  [
    {
      "id": "number",
      "name": "string"
    }
  ]
  ```

### Ledgers

#### Upsert Ledger
Create or update a ledger record.

**Endpoint:** `POST /ledgers`
**Authentication:** Required

**Request Body:**
```json
{
  "id": "number (optional)",
  "userId": "number",
  "date": "string (format: YYYY-MM-DD)",
  "current": "number",
  "income": "number",
  "incomePenny": "number (optional)",
  "parentSupport": "number",
  "budget": "number",
  "passiveIncome": "number (optional)",
  "exchangeRate": "number (optional)",
  "currency": "string (optional, enum: YEN, USD, SGD)",
  "remarks": "string (optional)"
}
```

**Responses:**
- `201`: Created/updated ledger
- `400`: Validation error

### Budgets

#### Upsert Budget
Create or update a budget record.

**Endpoint:** `POST /budgets`
**Authentication:** Required

**Request Body:**
```json
{
  "id": "number (optional)",
  "userId": "number",
  "ledgerId": "number",
  "date": "string (format: YYYY-MM-DD)",
  "amount": "number"
}
```

**Responses:**
- `201`: Created/updated budget
- `400`: Validation error

### Passive Income

#### Get Passive Incomes
Retrieve a list of passive income records based on filters.

**Endpoint:** `GET /passive-income`
**Authentication:** Required

**Query Parameters:**
- `userId`: Number (required)
- `from`: String (format: YYYY-MM-DD, required)
- `to`: String (format: YYYY-MM, required)
- `keyword`: String (optional)

**Responses:**
- `200`: List of passive income records with metadata
  ```json
  {
    "data": [
      {
        "id": "number",
        "userId": "number",
        "date": "string",
        "title": "string",
        "amount": "number",
        "type": "string",
        "createdAt": "datetime",
        "updatedAt": "datetime",
        "deletedAt": "datetime"
      }
    ],
    "meta": {
      "count": "number",
      "total": "number"
    }
  }
  ```
- `400`: Validation error

#### Create Passive Income
Create a new passive income record.

**Endpoint:** `POST /passive-income`
**Authentication:** Required

**Request Body:**
```json
{
  "userId": "number",
  "date": "string (format: YYYY-MM-DD)",
  "title": "string",
  "amount": "number",
  "type": "string (optional)"
}
```

**Responses:**
- `201`: Created passive income record
- `400`: Validation error

#### Update Passive Income
Update an existing passive income record.

**Endpoint:** `PUT /passive-income/:id`
**Authentication:** Required

**Request Body:**
```json
{
  "userId": "number",
  "date": "string (format: YYYY-MM-DD)",
  "title": "string",
  "amount": "number",
  "type": "string (optional)"
}
```

**Responses:**
- `201`: Updated passive income record
- `400`: Validation error

#### Get Passive Income by ID
Retrieve a specific passive income record by ID.

**Endpoint:** `GET /passive-income/:id`
**Authentication:** Required

**Responses:**
- `200`: Passive income record details
- `400`: Validation error
- `404`: Passive income record not found

#### Delete Passive Income
Delete a passive income record by ID.

**Endpoint:** `DELETE /passive-income/:id`
**Authentication:** Required

**Responses:**
- `200`: Deleted passive income record
- `400`: Validation error

## Data Models

### User
- `id`: Number (Primary Key)
- `name`: String (Optional)
- `email`: String (Unique)
- `password`: String (Hashed)
- `role`: String (admin/member)
- `active`: Boolean
- `createdAt`: DateTime
- `updatedAt`: DateTime (Optional)
- `deletedAt`: DateTime (Optional)

### AuthToken
- `id`: Number (Primary Key)
- `userId`: Number (Foreign Key to User)
- `accessToken`: String
- `refreshToken`: String
- `createdAt`: DateTime
- `updatedAt`: DateTime (Optional)
- `deletedAt`: DateTime (Optional)

### Category
- `id`: Number (Primary Key)
- `name`: String (Unique)
- `createdAt`: DateTime
- `updatedAt`: DateTime (Optional)
- `deletedAt`: DateTime (Optional)

### Expense
- `id`: Number (Primary Key)
- `userId`: Number (Foreign Key to User)
- `categoryId`: Number (Foreign Key to Category, Optional)
- `type`: String (Payment type)
- `date`: String (YYYY-MM-DD)
- `title`: String
- `amount`: Number
- `remarks`: String (Optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime (Optional)
- `deletedAt`: DateTime (Optional)

### Ledger
- `id`: Number (Primary Key)
- `userId`: Number (Foreign Key to User)
- `date`: String (YYYY-MM-DD)
- `current`: Number (Current balance)
- `income`: Number (Total income)
- `incomePenny`: Number (Small income)
- `parentSupport`: Number (Support from parents)
- `budget`: Number (Reserved for expenses)
- `grossSaving`: Number (income - (parentSupport + budget))
- `expenseCash`: Number (Cash expenses)
- `expenseBank`: Number (Bank expenses)
- `cost`: Number (budget + parentSupport + expenseBank)
- `passiveIncome`: Number (Additional income)
- `netSaving`: Number (income - cost)
- `balance`: Number (Closing balance)
- `nextOpening`: Number (Next month opening)
- `exchangeRate`: Float (Optional)
- `currency`: String (Optional)
- `remarks`: String (Optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime (Optional)
- `deletedAt`: DateTime (Optional)

### Budget
- `id`: Number (Primary Key)
- `userId`: Number (Foreign Key to User)
- `ledgerId`: Number (Foreign Key to Ledger)
- `date`: String (YYYY-MM-DD)
- `amount`: Number
- `createdAt`: DateTime
- `updatedAt`: DateTime (Optional)
- `deletedAt`: DateTime (Optional)

### PassiveIncome
- `id`: Number (Primary Key)
- `userId`: Number (Foreign Key to User)
- `date`: String (YYYY-MM-DD)
- `title`: String
- `amount`: Number
- `type`: String (Optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime (Optional)
- `deletedAt`: DateTime (Optional)