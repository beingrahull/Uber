Based on the code provided, I have constructed a professional and comprehensive **README.md** file. This documentation covers the API structure, authentication flow, and detailed endpoint specifications with payload examples.

***

# User Authentication API

A robust Node.js/Express authentication system featuring JWT-based authorization, password hashing with bcrypt, and input validation.

## Base URL
`http://localhost:5000/api/user`

## Authentication Mechanism
The API uses **JSON Web Tokens (JWT)**. 
- **Storage**: The token is sent back as a cookie (`Access_Token`) upon login.
- **Authorization**: For protected routes, the server looks for the token in:
    1. The `Access_Token` cookie.
    2. The `Authorization` header (e.g., `Authorization: <token>`).

---

## API Endpoints

### 1. User Registration
Registers a new user into the system.

- **Endpoint:** `/register`
- **Method:** `POST`
- **Access:** Public
- **Description:** Validates user input, checks if the email or mobile number already exists, hashes the password, and creates a new user record.

#### Request Body
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

#### Success Response
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

#### Error Responses
- **400 Bad Request:** Validation failed (e.g., password too short, invalid email).
- **400 Bad Request:** User already exists (email or mobile number taken).
- **500 Internal Server Error:** Database or server failure.

---

### 2. User Login
Authenticates a user and provides an access token.

- **Endpoint:** `/login`
- **Method:** `POST`
- **Access:** Public
- **Description:** Verifies the email and password. If valid, it issues a JWT token and sets it in an HTTP-only cookie.

#### Request Body
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### Success Response
- **Code:** `201 Created`
- **Body:**
```json
{
  "message": "Login Successful"
}
```
- **Header:** `Set-Cookie: Access_Token=eyJhbGciOiJIUzI1...`

#### Error Responses
- **401 Unauthorized:** Invalid Email or Password.
- **400 Bad Request:** Validation failed (e.g., email format invalid).

---

### 3. Get User Profile
Fetches the profile details of the currently authenticated user.

- **Endpoint:** `/user-profile`
- **Method:** `GET`
- **Access:**  Protected (Requires JWT)
- **Description:** Validates the token provided in the cookies or headers and returns the user's data from the database.

####  Request Headers
**Option A (Header):**
`Authorization: eyJhbGciOiJIUzI1...`

**Option B (Cookie):**
`Cookie: Access_Token=eyJhbGciOiJIUzI1...`

####  Success Response
- **Code:** `201 Created`
- **Body:**
```json
{
  "message": "Profile fetching successful",
  "userProfile": {
    "_id": "64f1a...",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "mobileNumber": "1234567890",
    "socketId": "optional_socket_id"
  }
}
```

####  Error Responses
- **400 Bad Request:** No token provided (Unauthorized access).
- **401 Unauthorized:** Token is expired, malformed, or invalid (Conflicts in Token).

---

##  Database Schema (User Model)

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `fullname.firstname` | String | Required, Min 3 chars | User's given name |
| `fullname.lastname` | String | Min 3 chars | User's family name |
| `email` | String | Required, Unique | Valid email address |
| `password` | String | Required, Min 6 chars | Hashed password (hidden by default) |
| `mobileNumber` | String | Unique, Min 10 chars | Contact number |
| `socketId` | String | Optional | For real-time communication |

---

##  Environment Variables
To run this project, you will need a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_random_key
```