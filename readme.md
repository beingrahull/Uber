# Uber Clone — MERN Stack Ride-Hailing Application

A full-stack web application that connects riders with drivers through a modern web interface. Two independent account types are supported: **User** (rider) and **Captain** (driver). Both authenticate via JWT delivered as HttpOnly cookies, and each role has its own protected dashboard.

---

## Table of Contents

1. Introduction
2. Features
3. Technology Stack
4. Project Structure
5. Prerequisites
6. Installation
7. Configuration
8. Running the Application
9. Using the Application
10. Authentication Model
11. API Reference
12. Data Models
13. Error Codes
14. Security Considerations
15. Troubleshooting
16. Known Limitations
17. Roadmap
18. Development Notes
19. Example Usage with curl
20. Contributing
21. License

---

## 1. Introduction

This repository contains a ride-hailing application built on the MERN stack (MongoDB, Express, React, Node.js). It implements a complete authentication and account-management foundation for two distinct roles: riders and drivers.

The project demonstrates:

- Role-based authentication using JSON Web Tokens
- Stateless session handling with HttpOnly cookie transport
- Dual-channel authorization (cookie or Authorization header)
- Server-side route protection via Express middleware
- Client-side route protection via wrapper components
- Token revocation through a persistent blacklist
- Password hashing with bcrypt
- Cross-origin requests with credentials

The application is functional end-to-end for account creation, login, dashboard access, and logout for both roles. Ride booking, live location, and matching are not yet implemented and are listed under Roadmap.

---

## 2. Features

### User (Rider)
- Register with first name, last name, email, mobile number, and password
- Login with email and password
- Access a protected home dashboard
- Logout with server-side token invalidation

### Captain (Driver)
- Register with personal details plus vehicle information (model, plate, colour, type, capacity)
- Login with email and password
- Access a protected captain dashboard
- Logout with server-side token invalidation

### System
- Password hashing with bcrypt (cost factor 10)
- JWT-based session management
- HttpOnly cookie transport for tokens
- Blacklist-based logout enforcement with automatic TTL cleanup
- CORS allowlist with credential support
- Duplicate detection on email, mobile number, and plate
- Client-side and server-side input validation
- Separate auth domains for users and captains

---

## 3. Technology Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 |
| Frontend build tool | Vite |
| Frontend routing | React Router v6 |
| Frontend styling | Tailwind CSS |
| HTTP client | Axios |
| Backend runtime | Node.js |
| Backend framework | Express |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JSON Web Tokens (jsonwebtoken) |
| Password hashing | bcryptjs |
| Request validation | express-validator |
| Cookie parsing | cookie-parser |
| Cross-origin policy | cors |
| Environment management | dotenv |

---

## 4. Project Structure

```
Uber/
├── Backend/
│   ├── server.js
│   ├── app.js
│   ├── .env
│   ├── package.json
│   ├── controllers/
│   │   ├── user.controller.js
│   │   └── captain.controller.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── captain.model.js
│   │   └── blacklist.model.js
│   ├── routes/
│   │   ├── user.route.js
│   │   └── captain.route.js
│   ├── services/
│   │   ├── user.service.js
│   │   └── captain.service.js
│   └── middlewares/
│       └── auth.middleware.js
│
└── Frontend/
    ├── index.html
    ├── vite.config.js
    ├── .env
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── context/
        │   ├── UserContext.jsx
        │   └── CaptainContext.jsx
        └── pages/
            ├── Start.jsx
            ├── Home.jsx
            ├── UserLogin.jsx
            ├── UserSignup.jsx
            ├── UserLogout.jsx
            ├── UserProtectWrapper.jsx
            ├── CaptainHome.jsx
            ├── CaptainLogin.jsx
            ├── CaptainSignup.jsx
            ├── CaptainLogout.jsx
            └── CaptainProtectWrapper.jsx
```

---

## 5. Prerequisites

- Node.js 18 or later
- npm 9 or later
- MongoDB 6 or later (local install or MongoDB Atlas)
- A modern browser (Chrome, Edge, Firefox, Safari)

---

## 6. Installation

### 6.1 Clone the repository

```bash
git clone <repository-url>
cd Uber
```

### 6.2 Install backend dependencies

```bash
cd Backend
npm install
```

### 6.3 Install frontend dependencies

```bash
cd ../Frontend
npm install
```

---

## 7. Configuration

### 7.1 Backend environment variables

Create `Backend/.env`:

```env
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://localhost:27017/uber
JWT_SECRET=replace_this_with_a_long_random_string
ALLOWED_ORIGINS=http://localhost:5173
```

Generate a strong `JWT_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

| Variable | Purpose |
|---|---|
| `NODE_ENV` | Controls production-only behavior such as Secure cookies |
| `PORT` | HTTP port the backend listens on |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `ALLOWED_ORIGINS` | Comma-separated list of origins permitted by CORS |

### 7.2 Frontend environment variables

Create `Frontend/.env`:

```env
VITE_BASE_URL=http://localhost:4000
```

| Variable | Purpose |
|---|---|
| `VITE_BASE_URL` | Base URL of the backend API |

### 7.3 Gitignore

Ensure the following are excluded from version control:

```
node_modules
.env
```

---

## 8. Running the Application

### 8.1 Ensure MongoDB is running

Local install:

```bash
mongod
```

Or use a MongoDB Atlas connection string in `MONGO_URI`.

### 8.2 Start the backend

```bash
cd Backend
npx nodemon server.js
```

Expected output:

```
Server running on port 4000
MongoDB connected
```

### 8.3 Start the frontend

In a separate terminal:

```bash
cd Frontend
npm run dev
```

Expected output:

```
VITE vX.X.X  ready in XXX ms
Local:   http://localhost:5173/
```

### 8.4 Access the application

Open `http://localhost:5173` in a browser.

---

## 9. Using the Application

### 9.1 Registering as a User

1. Navigate to `/user-signup`
2. Enter first name, last name, email, mobile number, and password
3. Submit the form
4. On success, the browser is redirected to `/home`

### 9.2 Logging in as a User

1. Navigate to `/user-login`
2. Enter registered email and password
3. Submit the form
4. On success, the browser is redirected to `/home`

### 9.3 Registering as a Captain

1. Navigate to `/captain-signup`
2. Enter personal details (first name, last name, email, mobile number, password)
3. Enter vehicle details (model, plate number, colour, vehicle type, capacity)
4. Submit the form
5. On success, the browser is redirected to `/captain-home`

### 9.4 Logging in as a Captain

1. Navigate to `/captain-login`
2. Enter registered email and password
3. Submit the form
4. On success, the browser is redirected to `/captain-home`

### 9.5 Logging out

- Users: navigate to `/user-logout`, confirm logout
- Captains: navigate to `/captain-logout`, confirm logout

Logout clears the session cookie, blacklists the token on the server, and removes the frontend token from localStorage.

### 9.6 Accessing protected pages

Direct navigation to `/home` or `/captain-home` while unauthenticated redirects to the respective login page.

---

## 10. Authentication Model

### 10.1 Overview

Authentication uses JSON Web Tokens. On successful login or registration:

1. The backend signs a JWT containing the account ID
2. The JWT is set as an HttpOnly cookie (`UserAccess_Token` or `CaptainAccess_Token`)
3. The JWT is also returned in the response body so the client can store it in localStorage
4. The client stores the body token under `token` or `captainToken`

### 10.2 Dual token roles

| Token | Location | Purpose |
|---|---|---|
| Cookie | Browser cookie jar | Authoritative; sent automatically on every request to the API origin |
| localStorage | Browser storage | UX shortcut; allows the client to skip network calls when no session exists |

The cookie is the source of truth. The localStorage value is a client-side hint only. Any tampering with localStorage does not affect server-side verification.

### 10.3 Client-side verification

On every protected route, the corresponding wrapper component:

1. Reads the localStorage token
2. If missing, redirects to login without contacting the server
3. If present, calls the profile endpoint with `withCredentials: true`
4. On 200, stores the account in context and renders the protected page
5. On error, clears the localStorage token and redirects to login

The wrapper is a UX mechanism. It is not a security boundary.

### 10.4 Server-side verification

Every protected route passes through `LoginValidation` or `CaptainLoginValidation` middleware:

1. Reads the token from cookie or Authorization header
2. Checks whether the token exists in the blacklist collection
3. Verifies the JWT signature
4. Loads the account from the database
5. Attaches the account to `req.user`
6. Calls `next()`

### 10.5 Logout

Logout:

1. Reads the token from cookie or Authorization header
2. Inserts the token into the blacklist collection
3. Clears the session cookie with matching flags
4. Returns 200

The frontend then removes the localStorage token and navigates to the login page.

### 10.6 Request lifecycle for a protected route

```
Browser navigates to /captain-home
    ↓
React Router renders <CaptainProtectWrapper><CaptainHome /></CaptainProtectWrapper>
    ↓
Wrapper reads localStorage.getItem("captainToken")
    ↓
If missing → navigate("/captain-login") and return
    ↓
axios.get("/api/captain/captain-profile", { withCredentials: true })
    ↓
Browser automatically attaches CaptainAccess_Token cookie
    ↓
Backend middleware validates: cookie exists, not blacklisted, JWT verifies, account exists
    ↓
Controller returns { message, captain }
    ↓
Wrapper sets context, renders <CaptainHome />
```

---

## 11. API Reference

Base URL: `http://localhost:4000/api`

### 11.1 Common headers and cookies

| Name | Type | Description |
|---|---|---|
| `UserAccess_Token` | Cookie | JWT for user sessions |
| `CaptainAccess_Token` | Cookie | JWT for captain sessions |
| `Authorization` | Header | `Bearer <jwt>` alternative to cookie |

Cookies are set with `HttpOnly`, `SameSite=Lax`, and `Secure` (in production), with a 7-day max age.

### 11.2 User endpoints

All user endpoints are mounted under `/api/user`.

#### POST `/api/user/register`

Register a new user.

Access: Public.

Request body:

```json
{
  "fullname": { "firstname": "John", "lastname": "Doe" },
  "email": "john@example.com",
  "mobileNumber": "9876543210",
  "password": "secret123"
}
```

Responses:

| Code | Body |
|---|---|
| `201` | `{ message, token, userRecord }` |
| `400` | `{ errors: [...] }` or `{ message: "User Exists" }` |
| `500` | `{ message, error }` |

#### POST `/api/user/login`

Authenticate a user.

Access: Public.

Request body:

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

Responses:

| Code | Body | Headers |
|---|---|---|
| `200` | `{ message, token, user }` | `Set-Cookie: UserAccess_Token=<jwt>` |
| `401` | `{ message: "Invalid Email or Password" }` or `{ message: "Invalid Password" }` | |
| `500` | `{ message, error }` | |

#### GET `/api/user/user-profile`

Return the authenticated user.

Access: Protected.

Headers or cookies required:

- `Cookie: UserAccess_Token=<jwt>`, or
- `Authorization: Bearer <jwt>`

Responses:

| Code | Body |
|---|---|
| `200` | `{ message, userProfile }` |
| `401` | `{ message }` |

#### GET `/api/user/logout`

Invalidate the current user session.

Access: Protected.

Responses:

| Code | Body | Headers |
|---|---|---|
| `200` | `{ message: "Logged out" }` | `Set-Cookie: UserAccess_Token=; Expires=Thu, 01 Jan 1970 ...` |
| `401` | `{ message }` | |

### 11.3 Captain endpoints

All captain endpoints are mounted under `/api/captain`.

#### POST `/api/captain/register-captain`

Register a new captain.

Access: Public.

Request body:

```json
{
  "fullname": { "firstname": "Rahul", "lastname": "Sharma" },
  "email": "rahul@example.com",
  "mobileNo": "9876543210",
  "password": "secret123",
  "plate": "DL-3C-AA-1111",
  "colour": "White",
  "model": "Honda City",
  "vehicleType": "Cab",
  "capacity": 4
}
```

Responses:

| Code | Body |
|---|---|
| `201` | `{ message, token, captain }` |
| `400` | `{ errors: [...] }` or `{ message: "Captain already exists" }` |
| `500` | `{ message, error }` |

#### POST `/api/captain/login-captain`

Authenticate a captain.

Access: Public.

Request body:

```json
{
  "email": "rahul@example.com",
  "password": "secret123"
}
```

Responses:

| Code | Body | Headers |
|---|---|---|
| `200` | `{ message, token, captain }` | `Set-Cookie: CaptainAccess_Token=<jwt>` |
| `401` | `{ message: "Invalid email or password" }` | |
| `500` | `{ message }` | |

#### GET `/api/captain/captain-profile`

Return the authenticated captain.

Access: Protected.

Responses:

| Code | Body |
|---|---|
| `200` | `{ message, captain }` |
| `401` | `{ message }` |

#### GET `/api/captain/logout-captain`

Invalidate the current captain session.

Access: Protected.

Responses:

| Code | Body | Headers |
|---|---|---|
| `200` | `{ Status: "Logout Successful" }` | `Set-Cookie: CaptainAccess_Token=; Expires=Thu, 01 Jan 1970 ...` |
| `401` | `{ message }` | |

---

## 12. Data Models

### 12.1 User model

| Field | Type | Constraints | Description |
|---|---|---|---|
| `fullname.firstname` | String | Required, min 3 characters | Given name |
| `fullname.lastname` | String | Optional, min 3 characters if provided | Family name |
| `email` | String | Required, unique, lowercase, trimmed | Login identifier |
| `password` | String | Required, min 6 characters, `select: false` | Hashed password |
| `mobileNumber` | String | Unique, min 10 characters | Contact number |
| `socketId` | String | Optional | Reserved for realtime features |

Methods:

| Method | Purpose |
|---|---|
| `generatetoken()` | Signs a JWT containing the user ID |
| `comparepassword(password)` | Compares a plaintext password with the stored hash |
| `hashPassword(password)` (static) | Hashes a password using bcrypt |

### 12.2 Captain model

| Field | Type | Constraints | Description |
|---|---|---|---|
| `fullname.firstname` | String | Required, min 3 characters | Given name |
| `fullname.lastname` | String | Optional, min 3 characters if provided | Family name |
| `email` | String | Required, unique, lowercase, trimmed | Login identifier |
| `mobileNo` | String | Required, unique | Contact number |
| `password` | String | Required, min 8 characters, `select: false` | Hashed password |
| `plate` | String | Required, unique | Vehicle registration plate |
| `colour` | String | Min 3 characters | Vehicle colour |
| `model` | String | Required, min 3 characters | Vehicle model |
| `status` | String | Enum `ACTIVE`, `INACTIVE`; default `INACTIVE` | Availability status |
| `capacity` | Number | Min 1 | Passenger capacity |
| `vehicleType` | String | Enum `Cab`, `Motorcycle`, `Auto` | Vehicle category |
| `location` | GeoJSON Point | Default `[0, 0]` | Last known coordinates |

Methods:

| Method | Purpose |
|---|---|
| `generatetoken()` | Signs a JWT containing the captain ID |
| `ComparePassword(password)` | Compares a plaintext password with the stored hash |
| `Hashpassword(password)` (static) | Hashes a password using bcrypt |

### 12.3 Blacklist model

| Field | Type | Constraints | Description |
|---|---|---|---|
| `token` | String | Required | Invalidated JWT |
| `createdAt` | Date | Default: now, TTL index | Auto-deletes after TTL expires |

---

## 13. Error Codes

| Code | Meaning | Typical Cause |
|---|---|---|
| `200` | OK | Successful GET or POST that does not create a resource |
| `201` | Created | Successful registration |
| `400` | Bad Request | Validation failed, duplicate detected, missing token |
| `401` | Unauthorized | Invalid credentials, missing token, blacklisted token, expired JWT |
| `500` | Server Error | Unexpected failure, database error, unhandled exception |

---

## 14. Security Considerations

| Concern | Mitigation |
|---|---|
| Password theft | bcrypt hashing with cost factor 10; hashes never returned in responses |
| Token tampering | HS256 signature verification |
| Token theft via XSS | HttpOnly cookie prevents JavaScript access |
| CSRF | SameSite=Lax cookie attribute |
| Network interception | Secure flag enabled in production |
| Session revocation | Blacklist collection on logout with TTL cleanup |
| Unauthorized access | Server-side middleware on every protected route |
| Cross-origin requests | Explicit allowlist with credentials; wildcard is not used |
| Credential stuffing | Not mitigated; consider rate limiting in production |
| Account enumeration | Generic error messages on failed login |

Client-side route protection is a UX feature, not a security boundary. All protected data is served only after server-side verification.

---

## 15. Troubleshooting

### 15.1 Cookie not visible in browser

- Confirm `withCredentials: true` is set on the axios request
- Confirm the backend response includes `Access-Control-Allow-Credentials: true`
- Confirm `Access-Control-Allow-Origin` is the exact origin, not `*`
- Confirm `NODE_ENV` is not `production` when testing over plain HTTP

### 15.2 401 Unauthorized on protected routes

- Confirm the cookie is present in DevTools under the API origin
- Confirm the token is not blacklisted
- Confirm the JWT has not expired (7 days by default)
- Confirm the backend was restarted after any middleware change

### 15.3 CORS errors

- Confirm `ALLOWED_ORIGINS` in `.env` includes the frontend origin
- Confirm `dotenv.config()` runs before `app.js` is imported
- Restart the backend after modifying `.env`

### 15.4 Login returns "Invalid email or password"

- Confirm the email exists in the database with matching case
- Confirm the stored password is a bcrypt hash (starts with `$2b$`)
- Confirm the password is hashed exactly once during registration
- Delete the account and re-register if the hash appears corrupted

### 15.5 Duplicate key error on registration

- The email, mobile number, or plate is already in use
- Delete the conflicting document or use different values
- If the collection is empty but the error persists, drop the stale index:

```javascript
db.captains.dropIndex("plate_1")
```

### 15.6 "Module not found" on case-sensitive systems

- Windows tolerates case differences in filenames; Linux does not
- Rename files to use consistent casing (recommended: PascalCase for components)
- Update imports to match

### 15.7 Frontend shows "No routes matched location"

- The URL does not correspond to any `<Route>` in `App.jsx`
- Check for typos in the path
- Confirm the route is defined inside `<Routes>`

### 15.8 "X is not defined" in JSX

- A component is used in the tree without being imported
- Add the import at the top of the file
- Confirm the import name matches the exported name exactly (case-sensitive)

---

## 16. Known Limitations

| Item | Description |
|---|---|
| No ride booking | The ride lifecycle is not implemented |
| No realtime updates | `socketId` field is reserved but Socket.IO is not integrated |
| No live location | GeoJSON schema is defined but not used |
| No refresh tokens | Sessions expire after 7 days with no renewal |
| No rate limiting | Login endpoints are not throttled |
| No password reset | Users cannot recover forgotten passwords |
| No email verification | Email addresses are not confirmed |
| No account deletion | Accounts cannot be removed through the UI |
| No admin interface | Data must be managed directly in MongoDB |
| No tests | No automated test suite is present |

---

## 17. Roadmap

Planned and potential future work:

- Ride booking flow (request, accept, complete, cancel)
- Live location tracking with Socket.IO
- Fare estimation and payment integration
- Captain availability toggle and ride history
- Refresh token rotation
- Rate limiting and brute-force protection
- Password reset via email
- Account deletion and GDPR compliance
- Administrative dashboard
- Automated integration and unit tests
- Docker and CI/CD pipeline
- Deployment guides for Vercel, Render, and MongoDB Atlas

---

## 18. Development Notes

### 18.1 Middleware

`LoginValidation` and `CaptainLoginValidation` check cookies and the Authorization header, verify JWTs, and reject blacklisted tokens. They attach the authenticated account to `req.user`.

### 18.2 Blacklist TTL

Blacklist documents include a TTL index so entries are removed automatically after expiry. This keeps the collection lean without a scheduled cleanup job.

### 18.3 Validation

`express-validator` is used in routes to enforce input constraints before the controller executes.

### 18.4 Password handling

Passwords are hashed exactly once, in the controller, before being passed to the service. The service stores the hash directly without re-hashing. Passwords are never returned in API responses.

### 18.5 Email normalization

Both schemas declare `lowercase: true` and `trim: true` on the `email` field. Controllers additionally normalize email before database queries to be defensive.

### 18.6 Client-side wrappers

`UserProtectWrapper` and `CaptainProtectWrapper` are functionally identical, differing only in the localStorage key, profile endpoint, context setter, and login route. They perform an optimistic client-side check before making a network request, then rely on the server for authoritative verification.

---

## 19. Example Usage with curl

### Register user

```bash
curl -X POST http://localhost:4000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"John","lastname":"Doe"},"email":"john@example.com","password":"secret123","mobileNumber":"9876543210"}'
```

### Login user

```bash
curl -X POST http://localhost:4000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secret123"}' \
  -c user_cookies.txt
```

### Get user profile

```bash
curl -X GET http://localhost:4000/api/user/user-profile \
  -b user_cookies.txt
```

### Logout user

```bash
curl -X GET http://localhost:4000/api/user/logout \
  -b user_cookies.txt
```

### Register captain

```bash
curl -X POST http://localhost:4000/api/captain/register-captain \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"Rahul","lastname":"Sharma"},"email":"rahul@example.com","password":"secret123","mobileNo":"9876543210","plate":"DL-3C-AA-1111","colour":"White","model":"Honda City","vehicleType":"Cab","capacity":4}'
```

### Login captain

```bash
curl -X POST http://localhost:4000/api/captain/login-captain \
  -H "Content-Type: application/json" \
  -d '{"email":"rahul@example.com","password":"secret123"}' \
  -c captain_cookies.txt
```

### Get captain profile

```bash
curl -X GET http://localhost:4000/api/captain/captain-profile \
  -b captain_cookies.txt
```

### Logout captain

```bash
curl -X GET http://localhost:4000/api/captain/logout-captain \
  -b captain_cookies.txt
```

---

## 20. Contributing

- Open issues for bugs or feature requests
- Follow the existing code style and add tests for new features
- Keep secrets out of the repository; use environment variables
- Provide clear pull request descriptions and link related issues

---

## 21. License

Specify the license under which this project is distributed.