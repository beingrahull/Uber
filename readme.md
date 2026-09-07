
```markdown
# 🛡️ Secure User Authentication API

A high-performance, production-ready User Authentication and Management System built with **Node.js**, **Express**, and **MongoDB**. This API provides a complete security layer for applications, implementing industry-standard practices for identity management and session control.

## 🌟 Key Features
- **Secure Registration:** Advanced input validation using `express-validator` and secure password hashing via `bcryptjs`.
- **JWT Session Management:** Stateless authentication using JSON Web Tokens (JWT).
- **Dual-Channel Authorization:** Flexible token verification supporting both **HTTP-Only Cookies** and **Authorization Headers**.
- **Token Revocation (Blacklisting):** A robust logout mechanism that blacklists tokens in MongoDB to prevent "replay attacks" after a user logs out.
- **Automatic Data Cleanup:** TTL (Time-To-Live) indexes on blacklisted tokens to ensure the database remains lean.
- **Input Sanitization:** Strict schema validation to prevent malformed data from entering the database.

---

## ⚙️ Configuration & Setup

### Base URL
`http://localhost:5000/api/user`

### Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_random_key
```

### Authentication Mechanism
The API utilizes **JWT (JSON Web Tokens)** for session handling.
- **Issuance:** Upon successful login/registration, a token is generated and sent as an `Access_Token` cookie.
- **Verification:** The `LoginValidation` middleware checks for the token in:
    1. The `Access_Token` cookie.
    2. The `Authorization` header (Bearer Token).

---

## 🛣️ API Endpoints

### 1. User Registration
Creates a new user account.

- **Endpoint:** `/register`
- **Method:** `POST`
- **Access:** Public
- **Description:** Validates input, ensures email/mobile uniqueness, hashes the password, and returns an initial access token.

**Request Body:**
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "mobileNumber": "1234567890"
}
```

**Success Response:**
- **Code:** `201 Created`
- **Body:**
```json
{
  "message": "User Registration Successful to the Database",
  "token": "eyJhbGciOiJIUzI1...",
  "userRecord": {
    "id": "64f1a...",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com",
    "mobileNumber": "1234567890"
  }
}
```

---

### 2. User Login
Authenticates user credentials and establishes a session.

- **Endpoint:** `/login`
- **Method:** `POST`
- **Access:** Public
- **Description:** Verifies the user's password against the hashed version in the database and issues a JWT.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Success Response:**
- **Code:** `201 Created`
- **Body:**
```json
{
  "message": "Login Successful"
}
```
- **Header:** `Set-Cookie: Access_Token=eyJhbGciOiJIUzI1...`

---

### 3. Get User Profile
Retrieves the details of the currently authenticated user.

- **Endpoint:** `/user-profile`
- **Method:** `GET`
- **Access:** 🔒 Protected (Requires JWT)
- **Description:** Extracts the user ID from the token and returns the corresponding user profile.

**Authentication:**
- **Header:** `Authorization: <your_token>` OR **Cookie:** `Access_Token=<your_token>`

**Success Response:**
- **Code:** `201 Created`
- **Body:**
```json
{
  "message": "Profile fetching successful",
  "userProfile": {
    "_id": "64f1a...",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com",
    "mobileNumber": "1234567890",
    "socketId": "optional_id"
  }
}
```

---

### 4. User Logout
Terminates the user session and invalidates the token.

- **Endpoint:** `/logout`
- **Method:** `GET`
- **Access:** 🔒 Protected (Requires JWT)
- **Description:** Clears the client-side cookie and adds the current token to the **Blacklist** database to prevent further use of that token.

**Success Response:**
- **Code:** `201 Created`
- **Body:**
```json
{
  "message": "Logged out"
}
```

---

## 📊 Database Schemas

### User Model
| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `fullname.firstname` | String | Required, Min 3 chars | User's given name |
| `fullname.lastname` | String | Min 3 chars | User's family name |
| `email` | String | Required, Unique | Valid email address |
| `password` | String | Required, Min 6 chars | Hashed password (hidden by default) |
| `mobileNumber` | String | Unique, Min 10 chars | Contact number |
| `socketId` | String | Optional | Used for real-time communication |

### Blacklist Model
| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `token` | String | Required | The JWT token being invalidated |
| `createdAt` | Date | Default: Now | Timestamp used for auto-deletion (TTL) |

---

## 🚫 Error Reference
| Code | Meaning | Description |
| :--- | :--- | :--- |
| `400` | Bad Request | Validation failed or User already exists |
| `401` | Unauthorized | Invalid credentials, expired token, or missing token |
| `500` | Server Error | Unexpected internal server failure |
```