# Secure User Authentication API

A production‑ready **User Authentication and Management System** built with **Node.js**, **Express**, and **MongoDB**. This repository implements industry best practices for secure registration, stateless session handling with JWT, dual‑channel authorization, and token revocation via a blacklist. The API issues JWTs as an `Access_Token` cookie on successful authentication. 

---

## Key Features
- **Secure Registration** — Input validation with `express-validator` and password hashing with `bcryptjs`.  
- **JWT Session Management** — Stateless authentication using JSON Web Tokens issued at login and registration.   
- **Dual‑Channel Authorization** — Middleware accepts tokens from HTTP‑Only cookies or the `Authorization` header.  
- **Token Revocation** — Blacklist stored in MongoDB prevents reuse of tokens after logout.  
- **Automatic Cleanup** — Blacklisted tokens use a TTL index so expired entries are removed automatically.  
- **Clear Error Handling** — Consistent HTTP status codes for validation, authentication, and server errors.

---

## Quick Setup

### Requirements
- Node.js 16+  
- MongoDB (Atlas or local)  
- Environment variables configured (see below)

### Environment Variables
Create a `.env` file in the project root:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_random_key
```

### Install and Run
```bash
npm install
npm start
```

---

## API Reference

**Base URL**  
```
http://localhost:5000/api/user
```

### Common Headers and Cookies
- **Cookie:** `Access_Token=<jwt>`  
- **Header:** `Authorization: Bearer <jwt>`  

---

### Register User
- **Endpoint:** `/register`  
- **Method:** `POST`  
- **Access:** Public  
- **Description:** Validates input, ensures email/mobile uniqueness, hashes the password, creates a user, and returns an access token.

**Request Body**
```json
{
  "fullname": { "firstname": "John", "lastname": "Doe" },
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "mobileNumber": "1234567890"
}
```

**Success Response**
- **Code:** `201 Created`
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

### Login User
- **Endpoint:** `/login`  
- **Method:** `POST`  
- **Access:** Public  
- **Description:** Verifies credentials and issues a JWT. The token is set as an `Access_Token` cookie on success.

**Request Body**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Success Response**
- **Code:** `201 Created`
```json
{
  "message": "Login Successful"
}
```
**Response Behavior**
- Sets cookie: `Set-Cookie: Access_Token=<jwt>; HttpOnly; Secure` (recommended production flags)

---

### Get User Profile
- **Endpoint:** `/user-profile`  
- **Method:** `GET`  
- **Access:** Protected (Requires JWT)  
- **Description:** Returns the authenticated user profile by decoding the token and fetching the user record.

**Success Response**
- **Code:** `201 Created`
```json
{
  "message": "Profile fetching successful",
  "userProfile": {
    "_id": "64f1a...",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com",
    "mobileNumber": "1234567890"
  }
}
```

---

### Logout User
- **Endpoint:** `/logout`  
- **Method:** `GET`  
- **Access:** Protected (Requires JWT)  
- **Description:** Clears the `Access_Token` cookie on the client and stores the token in the **Blacklist** collection so it cannot be used again. The blacklist uses a TTL index to automatically remove expired entries. 

**Authentication**
- Provide the token either as:
  - **Cookie:** `Access_Token=<token>`  
  - **Header:** `Authorization: Bearer <token>`

**Schema Payload**
- **Headers:**  
  - `Authorization: Bearer <token>` (optional if cookie is present)  
- **Cookies:**  
  - `Access_Token=<token>`  

**Success Response**
- **Code:** `201 Created`
```json
{
  "message": "Logged out"
}
```

**Server Behavior**
- Clears cookie: `res.clearCookie("Access_Token")`  
- Reads token from cookie or `Authorization` header and creates a blacklist record: `{ token: "<token>" }`  
- Blacklist entries expire automatically (TTL) to keep the collection lean.

---

## Database Schemas

### User Model Summary
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `fullname.firstname` | String | Required, Min 3 chars | Given name |
| `fullname.lastname` | String | Min 3 chars | Family name |
| `email` | String | Required, Unique | Valid email |
| `password` | String | Required, Min 6 chars | Hashed password |
| `mobileNumber` | String | Unique, Min 10 chars | Contact number |
| `socketId` | String | Optional | Real‑time socket id |

### Blacklist Model Summary
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `token` | String | Required | JWT token being invalidated |
| `createdAt` | Date | Default: Now, TTL 24h | Auto‑deletes expired tokens |

---

## Error Codes and Responses
| Code | Meaning | When returned |
|------|---------|---------------|
| `400` | Bad Request | Validation failed or user already exists |
| `401` | Unauthorized | Invalid credentials, missing token, blacklisted token |
| `500` | Server Error | Unexpected internal failure |

---

## Development Notes
- **Middleware**: `LoginValidation` checks cookies and `Authorization` header, verifies JWT, and rejects blacklisted tokens.  
- **Blacklist TTL**: Blacklist documents include `createdAt` with an `expires` index to auto‑remove entries after 24 hours. 

---

## Example Usage with curl

**Register**
```bash
curl -X POST http://localhost:5000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"John","lastname":"Doe"},"email":"john.doe@example.com","password":"securePassword123","mobileNumber":"1234567890"}'
```

**Login**
```bash
curl -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","password":"securePassword123"}' \
  -c cookies.txt
```

**Get Profile**
```bash
curl -X GET http://localhost:5000/api/user/user-profile \
  -b cookies.txt
```

**Logout**
```bash
curl -X GET http://localhost:5000/api/user/logout \
  -b cookies.txt
```

---

## Contributing
- Open issues for bugs or feature requests.  
- Follow the existing code style and add tests for new features.  
- Keep secrets out of the repository; use environment variables.

---

## License
Specify your project license here (MIT, Apache‑2.0, etc.).

---
