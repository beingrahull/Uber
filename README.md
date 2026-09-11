# Uber Clone — Ride-Hailing Platform

A full-stack, real-time ride-hailing application built with the MERN stack and Socket.IO. The platform supports two roles — Riders (Users) and Drivers (Captains) — with live location tracking, ride matching, OTP-based verification, and real-time ride status updates.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Socket.IO Events](#socketio-events)
- [Evaluation and Verification](#evaluation-and-verification)
- [Dependencies](#dependencies)
- [Testing the Flow](#testing-the-flow)
- [Google Maps Integration](#google-maps-integration)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

This project implements a two-sided marketplace that connects riders with nearby drivers. Riders request a trip, and nearby captains receive the request in real time, accept it, and complete the ride after verifying a six-digit OTP with the rider.

The system is designed around three principles:

1. **Real-time first** — every state change is broadcast over WebSockets (Socket.IO) so both sides stay synchronized without polling.
2. **Role separation** — Users and Captains have independent authentication flows, JWT scopes, and API namespaces.
3. **Extensibility** — External services such as Google Maps and payment gateways are isolated in service layers, making them easy to stub, replace, or upgrade.

---

## Features

### Rider (User)

- Email and password registration and login (JWT-based)
- Address autocomplete for pickup and destination
- Live fare estimation for three vehicle classes: auto, car, moto
- Real-time ride status transitions: pending, accepted, ongoing, completed
- Live captain location tracking on an embedded map
- OTP displayed to the rider for captain verification

### Captain (Driver)

- Registration with vehicle details (color, plate, capacity, type)
- Login and JWT-based session
- Continuous background location broadcast (every 10 seconds)
- Real-time ride request notifications for rides within a 2 km radius
- Accept and confirm flow with OTP entry
- Start and finish ride controls

### System

- JWT-based authentication with token blacklisting on logout
- Geospatial captain discovery using MongoDB `$geoWithin` with a `2dsphere` index
- Socket.IO rooms per user and captain for targeted event delivery
- CORS-configured Express API
- Centralized request validation using express-validator

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Tailwind CSS, GSAP, Axios, Socket.IO Client |
| Backend | Node.js, Express.js, Socket.IO |
| Database | MongoDB (Atlas), Mongoose ODM |
| Authentication | JSON Web Tokens, bcryptjs |
| Validation | express-validator |
| Maps | Google Maps Platform (Geocoding, Places, Distance Matrix) — stubbed for local development |
| Tooling | Nodemon, ESLint, PostCSS, Autoprefixer |

---

## Architecture

```
+---------------------+         +---------------------+
|   React Frontend    |<------->|  Express + Socket   |
|  (User + Captain)   |  HTTPS  |      Server         |
|                     |  + WSS  |                     |
+----------+----------+         +----------+----------+
           |                                |
           |                                |
           |                     +----------v----------+
           |                     |       MongoDB       |
           |                     |  (users, captains,  |
           |                     |   rides, blacklist) |
           |                     +---------------------+
           |                                |
           |                     +----------v----------+
           |                     |   Google Maps API   |
           |                     |  (Geocoding/Places/ |
           |                     |   Distance Matrix)  |
           |                     +---------------------+
           |
      +----v-----+
      | Google   |
      | Maps JS  |
      | (browser)|
      +----------+
```

### Ride lifecycle

```
User                    Backend                    Captain
 |                         |                          |
 |-- POST /rides/create -->|                          |
 |<---- 201 ride ----------|                          |
 |                         |-- find captains 2 km --->|
 |                         |-- socket: new-ride ----->|
 |                         |                          |
 |                         |<-- POST /rides/confirm --|
 |<-- socket: ride-confirmed ----------------------- |
 |                         |                          |
 |   [Shows OTP to user]   |                          |
 |                         |<-- GET /rides/start-ride |
 |                         |    ?rideId=&otp=         |
 |<-- socket: ride-started ------------------------- |
 |                         |                          |
 |                         |<-- POST /rides/end-ride -|
 |<-- socket: ride-ended --------------------------- |
```

---

## Project Structure

```
uber-clone/
├── backend/
│   ├── controllers/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   ├── server.js
│   ├── socket.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- MongoDB Atlas account (or a local MongoDB 5.x instance)
- A Google Cloud project with billing enabled (optional — the app runs with a stubbed Maps service)

### Environment Variables

#### backend/.env

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
PORT=4000
JWT_SECRET=<64-char-hex-string>
ALLOWED_ORIGINS=http://localhost:5173
GOOGLE_MAPS_API=<google-maps-api-key>
```

#### frontend/.env

```env
VITE_BASE_URL=http://localhost:4000
VITE_GOOGLE_MAPS_API_KEY=<google-maps-api-key>
```

Both `.env` files are ignored by Git. Commit `.env.example` files with placeholder values instead.

### Installation

```bash
git clone https://github.com/<your-username>/uber-clone.git
cd uber-clone

cd backend
npm install

cd ../frontend
npm install
```

### Running the Application

Open two terminal windows.

**Terminal 1 — Backend**

```bash
cd backend
npm run dev
```

Expected output:

```
Server is running on port 4000
Connected to DB
```

**Terminal 2 — Frontend**

```bash
cd frontend
npm run dev
```

Vite will start on `http://localhost:5173`.

### Testing Two Roles Simultaneously

Both the rider and captain roles store their token under the same `localStorage` key. To test both at once, use one of the following:

- Two different browsers (for example, Chrome and Edge)
- A normal window and an incognito window

---

## API Reference

**Base URL:** `http://localhost:4000`

**Authentication:** Protected routes require the header:

```
Authorization: Bearer <jwt-token>
```

### Users

#### POST /users/register

Registers a new rider.

**Request body**

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "secret123"
}
```

**Validation**

| Field | Rule |
|---|---|
| fullname.firstname | Required, minimum 3 characters |
| fullname.lastname | Optional, minimum 3 characters |
| email | Required, valid email, unique |
| password | Required, minimum 6 characters |

**Response 201 Created**

```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "_id": "665f...",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john@example.com"
  }
}
```

**Errors**

| Status | Reason |
|---|---|
| 400 | Validation failed or email already registered |

---

#### POST /users/login

**Request body**

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response 200 OK**

```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "_id": "...",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john@example.com"
  }
}
```

Also sets an HTTP-only cookie named `token`.

---

#### GET /users/profile

Requires authentication.

**Response 200 OK**

```json
{
  "_id": "...",
  "fullname": { "firstname": "John", "lastname": "Doe" },
  "email": "john@example.com"
}
```

---

#### GET /users/logout

Requires authentication. Blacklists the current token and clears the cookie.

**Response 200 OK**

```json
{ "message": "Logged out" }
```

---

### Captains

#### POST /captains/register

**Request body**

```json
{
  "fullname": { "firstname": "Raj", "lastname": "Kumar" },
  "email": "raj@example.com",
  "password": "secret123",
  "vehicle": {
    "color": "white",
    "plate": "WB01AB1234",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

**Validation**

| Field | Rule |
|---|---|
| fullname.firstname | Required, minimum 3 characters |
| email | Required, valid, unique |
| password | Required, minimum 6 characters |
| vehicle.color | Required, minimum 3 characters |
| vehicle.plate | Required, minimum 3 characters |
| vehicle.capacity | Required, integer greater than or equal to 1 |
| vehicle.vehicleType | One of `car`, `moto`, `auto` |

**Response 201 Created**

```json
{
  "token": "eyJhbGciOi...",
  "captain": {
    "_id": "...",
    "fullname": { "firstname": "Raj", "lastname": "Kumar" },
    "email": "raj@example.com",
    "vehicle": {
      "color": "white",
      "plate": "WB01AB1234",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

---

#### POST /captains/login

Same payload as `/users/login`.

**Response 200 OK** — `{ token, captain }`

---

#### GET /captains/profile

Requires authentication.

**Response 200 OK**

```json
{
  "captain": {
    "_id": "...",
    "fullname": { "firstname": "Raj", "lastname": "Kumar" },
    "email": "raj@example.com",
    "vehicle": {
      "color": "white",
      "plate": "WB01AB1234",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

---

#### GET /captains/logout

Requires authentication.

**Response 200 OK**

```json
{ "message": "Logout successfully" }
```

---

### Maps

All maps endpoints currently use a local stub for development. See [Google Maps Integration](#google-maps-integration) to enable the real API.

#### GET /maps/get-suggestions

Address autocomplete.

**Query parameters**

| Parameter | Required | Rule |
|---|---|---|
| input | Yes | Minimum 3 characters |

**Example**

```
GET /maps/get-suggestions?input=Howrah
```

**Response 200 OK**

```json
[
  "Howrah, Kolkata, West Bengal, India",
  "Howrah Railway Station, Kolkata, WB, India",
  "Howrah Bus Stop, Kolkata, WB, India"
]
```

---

#### GET /maps/get-coordinates

Converts an address to latitude and longitude.

**Query parameters**

| Parameter | Required |
|---|---|
| address | Yes |

**Response 200 OK**

```json
{ "ltd": 22.5726, "lng": 88.3639 }
```

`ltd` is the field name used throughout the codebase (equivalent to `lat`).

---

#### GET /maps/get-distance-time

Returns distance and duration between two locations.

**Query parameters**

| Parameter | Required |
|---|---|
| origin | Yes |
| destination | Yes |

**Response 200 OK**

```json
{
  "distance": { "text": "12.5 km", "value": 12500 },
  "duration": { "text": "25 mins", "value": 1500 }
}
```

---

### Rides

#### POST /rides/create

Requires authentication. Creates a new ride request.

**Request body**

```json
{
  "pickup": "Howrah Railway Station",
  "destination": "Kolkata Airport",
  "vehicleType": "car"
}
```

**Validation**

| Field | Rule |
|---|---|
| pickup | Required, string, minimum 3 characters |
| destination | Required, string, minimum 3 characters |
| vehicleType | One of `auto`, `car`, `moto` |

**Response 201 Created**

```json
{
  "_id": "...",
  "user": "...",
  "pickup": "Howrah Railway Station",
  "destination": "Kolkata Airport",
  "fare": 313,
  "status": "pending",
  "otp": "482913"
}
```

**Side effect:** The backend queries for captains within 2 km and emits `new-ride` to each captain's socket.

---

#### GET /rides/get-fare

Requires authentication. Estimates fares for all three vehicle types.

**Query parameters**

| Parameter | Required |
|---|---|
| pickup | Yes |
| destination | Yes |

**Response 200 OK**

```json
{ "auto": 250, "car": 380, "moto": 180 }
```

**Fare formula**

```
fare = baseFare + (distance_km * perKmRate) + (duration_min * perMinuteRate)
```

| Vehicle | baseFare | perKmRate | perMinuteRate |
|---|---|---|---|
| auto | 30 | 10 | 2 |
| car | 50 | 15 | 3 |
| moto | 20 | 8 | 1.5 |

---

#### POST /rides/confirm

Requires captain authentication. Captain accepts a ride.

**Request body**

```json
{ "rideId": "665f..." }
```

**Response 200 OK** — Full ride document with populated `user` and `captain`.

**Side effect:** Emits `ride-confirmed` to the user.

---

#### GET /rides/start-ride

Requires captain authentication. Starts the ride after OTP verification.

**Query parameters**

| Parameter | Required | Rule |
|---|---|---|
| rideId | Yes | Valid Mongo ID |
| otp | Yes | Exactly 6 characters |

**Response 200 OK** — Ride with status `ongoing`.

**Errors:** `400` for invalid OTP or if the ride is not in the `accepted` state, `500` on server error.

**Side effect:** Emits `ride-started` to the user.

---

#### POST /rides/end-ride

Requires captain authentication. Marks the ride as completed.

**Request body**

```json
{ "rideId": "665f..." }
```

**Response 200 OK** — Ride with status `completed`.

**Side effect:** Emits `ride-ended` to the user.

---

## Socket.IO Events

**Connection URL:** `ws://localhost:4000`

### Client to Server

| Event | Payload | Purpose |
|---|---|---|
| join | `{ userId, userType: 'user' \| 'captain' }` | Associates the socket with a database record |
| update-location-captain | `{ userId, location: { ltd, lng } }` | Broadcasts captain location every 10 seconds |

### Server to Client

| Event | Target | Payload | Trigger |
|---|---|---|---|
| new-ride | Captain | `{ ride, user }` | User creates a ride within 2 km |
| ride-confirmed | User | `{ ride, captain }` | Captain accepts the ride |
| ride-started | User | `{ ride }` | Captain verifies the OTP |
| ride-ended | User | `{ ride }` | Captain ends the ride |
| error | Any | `{ message }` | Invalid payload or state |

**Example — client subscription**

```javascript
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_BASE_URL);

socket.on('connect', () => {
  socket.emit('join', { userId: user._id, userType: 'user' });
});

socket.on('ride-confirmed', (ride) => {
  console.log('Captain accepted:', ride.captain.fullname.firstname);
});
```

---

## Evaluation and Verification

### Request lifecycle

Every request passes through the following pipeline:

```
Route -> Validation -> Auth Middleware -> Controller -> Service -> Model -> Database
                                                                              |
                                                                Response + Socket emit
```

| Layer | Responsibility |
|---|---|
| Route | Declares the HTTP method, path, and validators |
| Validator | express-validator rules (length, email format, enums) |
| Auth Middleware | Verifies JWT, checks the blacklist, attaches `req.user` or `req.captain` |
| Controller | Handles validation results, delegates to services, emits socket events, sends the response |
| Service | Business logic — fare calculation, geospatial lookup, OTP generation |
| Model | MongoDB schema-level validation |

### Verification Rules

| Check | Location |
|---|---|
| Email format and uniqueness | Validator plus a unique index in MongoDB |
| Password minimum length | Validator plus bcrypt hashing |
| JWT signature and expiry | `auth.middleware.js`, 24-hour TTL |
| Blacklisted token rejection | `blacklistToken` collection lookup |
| Vehicle type enumeration | Validator using `isIn([...])` |
| OTP match (6 digits) | `ride.service.startRide` |
| Ride status transitions | `pending` → `accepted` → `ongoing` → `completed` |
| Captain proximity (2 km) | MongoDB `$geoWithin` with `$centerSphere` |

### Status Codes

| Status | Meaning |
|---|---|
| 200 | Success |
| 201 | Resource created |
| 400 | Validation error or bad request |
| 401 | Missing, invalid, or blacklisted JWT |
| 500 | Unhandled server error |

---

## Dependencies

### Backend

| Package | Purpose |
|---|---|
| express | HTTP server framework |
| mongoose | MongoDB object modelling |
| jsonwebtoken | JWT signing and verification |
| bcryptjs | Password hashing |
| cookie-parser | Cookie parsing |
| cors | Cross-origin resource sharing |
| dotenv | Environment variable loading |
| express-validator | Request validation |
| socket.io | WebSocket server |
| axios | HTTP client for the Maps API |

### Frontend

| Package | Purpose |
|---|---|
| react, react-dom | UI library |
| react-router-dom | Client-side routing |
| axios | HTTP client |
| socket.io-client | WebSocket client |
| @react-google-maps/api | Google Maps rendering |
| gsap, @gsap/react | Animation library |
| tailwindcss | Utility-first CSS framework |
| remixicon | Icon library |
| vite | Build tool |

---

## Testing the Flow

1. Start both servers: the backend on `http://localhost:4000` and the frontend on `http://localhost:5173`.
2. Set up two browser sessions — one for the user and one for the captain.
3. Register a user at `/signup` and a captain at `/captain-signup`. The vehicle type must be one of `car`, `moto`, or `auto`.
4. As the user, log in and navigate to `/home`. Enter a pickup and destination (minimum 3 characters each), click **Find Trip**, select a vehicle, and confirm the ride.
5. As the captain, log in and navigate to `/captain-home`. A **New Ride Available** popup will appear. Click **Accept**.
6. The user's screen displays the OTP. The captain enters the OTP and confirms.
7. Both sides transition to the ongoing ride state.
8. The captain clicks **Finish Ride**. The user's page returns to `/home`.

---

## Google Maps Integration

For local development, the application ships with a stubbed Maps service in `backend/services/maps.service.js`. The stub returns fixed coordinates and mock suggestions, and its response shapes match the real Google APIs. This lets the rest of the app run without a billed Google Cloud project.

### Enabling the Real Google Maps API

1. Enable the following APIs in the [Google Cloud Console](https://console.cloud.google.com/):
   - Geocoding API
   - Places API
   - Distance Matrix API
2. Enable billing on the project. Google requires a billing account even for the free tier.
3. Create an API key under **Credentials**.
4. Add the key to `backend/.env`:
   ```
   GOOGLE_MAPS_API=your-key-here
   ```
5. In `backend/services/maps.service.js`:
   - Uncomment the `REAL IMPLEMENTATION` blocks
   - Comment out or delete the `STUB IMPLEMENTATION` blocks
6. Restart the backend.

### Recommended Key Restrictions

- Backend key: restrict by server IP address
- Frontend key: restrict by HTTP referrer

This prevents the key from being abused if it is exposed in the client bundle.

---

## Roadmap

- Payment gateway integration (Stripe or Razorpay)
- Ride history and downloadable receipts
- Captain earnings dashboard
- Ratings and reviews
- Push notifications via Firebase Cloud Messaging
- Multi-language support
- Scheduled rides
- Rename `ltd` to `lat` throughout the codebase
- Store user and captain tokens under separate `localStorage` keys
- Migrate from legacy Google Maps endpoints to Places API (New) and Routes API

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

**Author:** Your Name — [github.com/yourhandle](https://github.com/yourhandle)

**Project:** [github.com/yourhandle/uber-clone](https://github.com/yourhandle/uber-clone)

---

Before you push, replace these placeholders:

- `<your-username>` in the clone URL
- Your Name and yourhandle in the footer
- Add a `LICENSE` file (MIT template from choosealicense.com)
