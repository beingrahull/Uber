# Secure User Authentication API

A production-ready **User Authentication and Management System** built with **Node.js**, **Express**, and **MongoDB**. This repository implements industry best practices for secure registration, stateless session handling with JWT, dual-channel authorization, and token revocation via a blacklist. The API issues JWTs as HTTP-only cookies on successful authentication.

---

## Table of contents

- [Key features](#key-features)  
- [Quick setup](#quick-setup)  
- [Environment variables](#environment-variables)  
- [API reference](#api-reference)  
  - [Common headers and cookies](#common-headers-and-cookies)  
  - [User endpoints](#user-endpoints)  
  - [Captain endpoints](#captain-endpoints)  
- [Database schemas](#database-schemas)  
- [Error codes and responses](#error-codes-and-responses)  
- [Security recommendations](#security-recommendations)  
- [Development notes](#development-notes)  
- [Example usage with curl](#example-usage-with-curl)  
- [Contributing](#contributing)

---

## Key features

- **Secure registration** — Input validation with `express-validator` and password hashing with `bcryptjs`.  
- **JWT session management** — Stateless authentication using JSON Web Tokens issued at login and registration.  
- **Dual-channel authorization** — Middleware accepts tokens from HTTP-only cookies or the `Authorization` header.  
- **Token revocation** — Blacklist stored in MongoDB prevents reuse of tokens after logout.  
- **Automatic cleanup** — Blacklisted tokens use a TTL index so expired entries are removed automatically.  
- **Consistent error handling** — Clear HTTP status codes for validation, authentication, and server errors.

---

## Quick setup

### Requirements
- Node.js 16+  
- MongoDB (Atlas or local)  
- Environment variables configured (see below)

### Install and run
```bash
npm install
npm start
```

---

## Environment variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_random_key
```

---

## API reference

**Base URL**  
```
http://localhost:5000/api
```

### Common headers and cookies

- **User cookie:** `UserAccess_Token=<jwt>`  
- **Captain cookie:** `CaptainAccess_Token=<jwt>`  
- **Header:** `Authorization: Bearer <jwt>`

---

## User endpoints

All user endpoints are mounted under `/api/user`.

### Register user
- **Endpoint:** `/api/user/register`  
- **Method:** `POST`  
- **Access:** Public  
- **Description:** Validates input, ensures email/mobile uniqueness, hashes the password, creates a user, and returns an access token.

**Request body**
```json
{
  "fullname": { "firstname": "John", "lastname": "Doe" },
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "mobileNumber": "1234567890"
}
```

**Success response**
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

**Validation errors**
- **Code:** `400 Bad Request`  
- **Body:** `{ "errors": [ { "msg": "Enter a valid Email", "param": "email", ... } ] }`

---

### Login user
- **Endpoint:** `/api/user/login`  
- **Method:** `POST`  
- **Access:** Public  
- **Description:** Verifies credentials and issues a JWT. The token is set as a `UserAccess_Token` cookie on success.

**Request body**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Success response**
- **Code:** `201 Created`
```json
{
  "message": "Login Successful"
}
```

**Response behavior**
- Sets cookie: `Set-Cookie: UserAccess_Token=<jwt>; HttpOnly; Secure` (apply `Secure` and `SameSite` in production)

**Failure responses**
- **Code:** `401 Unauthorized` — Invalid email or password

---

### Get user profile
- **Endpoint:** `/api/user/user-profile`  
- **Method:** `GET`  
- **Access:** Protected (requires JWT)  
- **Description:** Returns the authenticated user profile by decoding the token and fetching the user record.

**Success response**
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

**Failure responses**
- **Code:** `400 Bad Request` — Missing token  
- **Code:** `401 Unauthorized` — Invalid token or blacklisted token

---

### Logout user
- **Endpoint:** `/api/user/logout`  
- **Method:** `GET`  
- **Access:** Protected (requires JWT)  
- **Description:** Clears the `UserAccess_Token` cookie on the client and stores the token in the **Blacklist** collection so it cannot be used again. Blacklist entries are created with a TTL so they expire automatically.

**Authentication**
- Provide the token either as:
  - **Cookie:** `UserAccess_Token=<token>`  
  - **Header:** `Authorization: Bearer <token>`

**Schema payload**
- **Headers:** `Authorization: Bearer <token>` (optional if cookie is present)  
- **Cookies:** `UserAccess_Token=<token>`

**Success response**
- **Code:** `201 Created`
```json
{
  "message": "Logged out"
}
```

**Server behavior**
- Clears cookie: `res.clearCookie("UserAccess_Token")`  
- Reads token from cookie or `Authorization` header and creates a blacklist record: `{ "token": "<token>" }`  
- Blacklist entries expire automatically (TTL) to keep the collection lean

---

## Captain endpoints

All captain endpoints are mounted under `/api/captain`.

> Captain authentication uses a separate cookie name and middleware (`CaptainAccess_Token` and `CaptainLoginValidation`) to isolate captain sessions from regular user sessions.

### Register captain
- **Endpoint:** `/api/captain/register-captain`  
- **Method:** `POST`  
- **Access:** Public  
- **Description:** Validates input, ensures email/mobile uniqueness for captains, creates a captain record, and returns the created captain object.

**Request body (example)**
```json
{
  "fullname": { "firstname": "Jane", "lastname": "Rider" },
  "email": "jane.rider@example.com",
  "password": "captainPassword123",
  "mobileNo": "9876543210",
  "plate": "MH12AB1234",
  "colour": "White",
  "model": "Sedan",
  "vehicleType": "Car",
  "capacity": 4
}
```

**Success response**
- **Code:** `201 Created`
```json
{
  "message": "Captain Registered",
  "Captain": {
    "_id": "64f2b...",
    "fullname": { "firstname": "Jane", "lastname": "Rider" },
    "email": "jane.rider@example.com",
    "mobileNo": "9876543210",
    "plate": "MH12AB1234",
    "vehicleType": "Car",
    "capacity": 4
  }
}
```

---

### Login captain
- **Endpoint:** `/api/captain/login-captain`  
- **Method:** `POST`  
- **Access:** Public  
- **Description:** Verifies captain credentials and issues a JWT. The token is set as a `CaptainAccess_Token` cookie on success.

**Request body**
```json
{
  "email": "jane.rider@example.com",
  "password": "captainPassword123"
}
```

**Success response**
- **Code:** `200 OK`
```json
{
  "message": "Access Granted",
  "captain": {
    "_id": "64f2b...",
    "email": "jane.rider@example.com",
    "mobileNo": "9876543210"
  }
}
```

**Response behavior**
- Sets cookie: `Set-Cookie: CaptainAccess_Token=<jwt>; HttpOnly; Secure` (use `Secure` and `SameSite` in production)

---

### Get captain profile
- **Endpoint:** `/api/captain/captain-profile`  
- **Method:** `GET`  
- **Access:** Protected (requires captain JWT)  
- **Description:** Returns the authenticated captain profile by decoding the captain token and fetching the captain record.

**Success response**
- **Code:** `201 Created`
```json
{
  "message": "Profile Fetched",
  "Profile": {
    "_id": "64f2b...",
    "fullname": { "firstname": "Jane", "lastname": "Rider" },
    "email": "jane.rider@example.com",
    "mobileNo": "9876543210",
    "plate": "MH12AB1234"
  }
}
```

---

### Logout captain
- **Endpoint:** `/api/captain/logout-captain`  
- **Method:** `GET`  
- **Access:** Protected (requires captain JWT)  
- **Description:** Clears the `CaptainAccess_Token` cookie and blacklists the captain token to prevent reuse. Blacklist entries use a TTL (24 hours) to auto-expire.

**Authentication**
- Provide the token either as:
  - **Cookie:** `CaptainAccess_Token=<token>`  
  - **Header:** `Authorization: Bearer <token>`

**Schema payload**
- **Headers:** `Authorization: Bearer <token>` (optional if cookie is present)  
- **Cookies:** `CaptainAccess_Token=<token>`

**Success response**
- **Code:** `201 Created`
```json
{
  "Status": "Logout Successful"
}
```

**Server behavior**
- Reads token from cookie or `Authorization` header and creates a blacklist record: `{ "token": "<token>" }`  
- Clears cookie: `res.clearCookie("CaptainAccess_Token")`  
- Blacklist entries expire automatically (TTL) to keep the collection lean

---

## Database schemas

### User model summary

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `fullname.firstname` | String | Required, Min 3 chars | Given name |
| `fullname.lastname` | String | Min 3 chars | Family name |
| `email` | String | Required, Unique | Valid email |
| `password` | String | Required, Min 6 chars | Hashed password |
| `mobileNumber` | String | Unique, Min 10 chars | Contact number |
| `socketId` | String | Optional | Real-time socket id |

### Captain model summary

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `fullname.firstname` | String | Required | Given name |
| `fullname.lastname` | String | Optional | Family name |
| `email` | String | Required, Unique | Captain email |
| `password` | String | Required | Hashed password |
| `mobileNo` | String | Unique | Contact number |
| `plate` | String | Required | Vehicle plate number |
| `vehicleType` | String | Required | Vehicle category |
| `capacity` | Number | Optional | Passenger capacity |

### Blacklist model summary

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `token` | String | Required | JWT token being invalidated |
| `createdAt` | Date | Default: Now, TTL 24h | Auto-deletes expired tokens |

---

## Error codes and responses

| Code | Meaning | When returned |
|------|---------|---------------|
| `400` | Bad Request | Validation failed or missing token |
| `401` | Unauthorized | Invalid credentials, missing token, blacklisted token |
| `500` | Server Error | Unexpected internal failure |

---

## Security recommendations

- Use HTTPS in production and set cookie flags: `HttpOnly`, `Secure`, `SameSite=Strict` or `Lax`.  
- Rotate `JWT_SECRET` periodically and use a long, random secret.  
- Use short token lifetimes; implement refresh tokens for long sessions.  
- Rate limit authentication endpoints to mitigate brute-force attacks.  
- Validate inputs on both client and server; never trust client input.  
- Log and monitor authentication failures and blacklist activity.

---

## Development notes

- Middleware: `LoginValidation` and `CaptainLoginValidation` check cookies and `Authorization` header, verify JWTs, and reject blacklisted tokens.  
- Blacklist TTL: Blacklist documents include `createdAt` with an `expires` index to auto-remove entries after 24 hours.  
- Validation: `express-validator` is used in routes to enforce input constraints.  
- Password handling: Passwords are hashed before storage and never returned in API responses.

---

## Example usage with curl

**Register user**
```bash
curl -X POST http://localhost:5000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"John","lastname":"Doe"},"email":"john.doe@example.com","password":"securePassword123","mobileNumber":"1234567890"}'
```

**Login user**
```bash
curl -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","password":"securePassword123"}' \
  -c user_cookies.txt
```

**Get user profile**
```bash
curl -X GET http://localhost:5000/api/user/user-profile \
  -b user_cookies.txt
```

**Logout user**
```bash
curl -X GET http://localhost:5000/api/user/logout \
  -b user_cookies.txt
```

**Register captain**
```bash
curl -X POST http://localhost:5000/api/captain/register-captain \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"Jane","lastname":"Rider"},"email":"jane.rider@example.com","password":"captainPassword123","mobileNo":"9876543210","plate":"MH12AB1234","colour":"White","model":"Sedan","vehicleType":"Car","capacity":4}'
```

**Login captain**
```bash
curl -X POST http://localhost:5000/api/captain/login-captain \
  -H "Content-Type: application/json" \
  -d '{"email":"jane.rider@example.com","password":"captainPassword123"}' \
  -c captain_cookies.txt
```

**Get captain profile**
```bash
curl -X GET http://localhost:5000/api/captain/captain-profile \
  -b captain_cookies.txt
```

**Logout captain**
```bash
curl -X GET http://localhost:5000/api/captain/logout-captain \
  -b captain_cookies.txt
```

---

## Contributing

- Open issues for bugs or feature requests.  
- Follow the existing code style and add tests for new features.  
- Keep secrets out of the repository; use environment variables.  
- Provide clear pull request descriptions and link related issues.