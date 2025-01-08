# LearnMate Server

This repository contains the backend implementation for **LearnMate**, an educational platform connecting tutors and learners. It provides APIs for user authentication, tutor management, bookings, and other essential features to support a seamless learning experience.

---

## Purpose

LearnMate aims to bridge the gap between students and tutors by providing an intuitive platform where learners can easily find, book, and review qualified tutors across various subjects and categories.

---

## Server URL

[Live Server](https://learnmate-server.vercel.app/)

---

## Key Features

- **User Authentication:**  
  Secure user registration, login, and JWT-based authorization.

- **Tutor Management:**  
  CRUD operations for tutor profiles, dynamic category management, and real-time review updates.

- **Booking System:**  
  Flexible booking for tutorials with automatic updates to tutor availability and booking history.

- **Dynamic Data Retrieval:**  
  Advanced filtering, searching, and querying of tutor data.

- **Category Insights:**  
  Aggregated counts for tutor categories to help users find popular subjects quickly.

- **User-Specific Data:**  
  Fetch user-related data like tutorials and bookings based on authentication.

- **API-First Approach:**  
  Designed to support scalable front-end integration.

---

## Tech Stack

- **Server Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Environment Management:** dotenv
- **Middleware:** Cookie Parser, CORS
- **Other Libraries:** MongoDB Driver, Node.js

---

## Endpoints

### General Endpoints

- **`GET /`**  
  Returns a success message to verify the server is running.

---

### User Endpoints

- **`GET /users`**  
  Fetches the count of all users in the database.

- **`POST /user`**  
  Saves a new user to the database if the user does not already exist.

- **`PATCH /user`**  
  Updates the name of an existing user.

---

### Authentication Endpoints

- **`POST /jwt`**  
  Generates a JWT token for secure data transmission and sets it in a cookie.

- **`GET /clearjwt`**  
  Deletes the JWT token by clearing the cookie.

---

### Tutor Endpoints

- **`GET /tutors`**  
  Fetches all tutors or tutors based on query parameters (`category`, `count`, `reviews`, `search`).

- **`GET /tutors/categories`**  
  Fetches all unique tutor categories.

- **`GET /tutors/:id`**  
  Fetches details of a specific tutor by ID.

- **`POST /tutors`**  
  Saves a new tutor to the database.

- **`PUT /tutors/:id`**  
  Updates or inserts a tutor's details by ID.

- **`PATCH /update-review/:id`**  
  Updates the review count for a tutor and related bookings.

- **`GET /my-tutorials/:email`**  
  Fetches tutorials for a specific user (requires JWT verification).

- **`DELETE /tutors/:id`**  
  Deletes a specific tutor by ID.

---

### Booking Endpoints

- **`GET /bookings`**  
  Fetches all bookings for a specific user (requires JWT verification).

- **`POST /bookings`**  
  Saves a new booking if it does not already exist and updates the booking count for the tutor.

---

### Category Endpoints

- **`GET /categories`**  
  Aggregates and returns the count of tutors in each category.

---

## Features

- **Authentication:**  
  Secure JWT-based authentication and authorization for API access.

- **Dynamic Queries:**  
  Flexible query-based data retrieval for tutors and categories.

- **Database Integration:**  
  Robust interaction with MongoDB for efficient data storage and retrieval.

- **Middleware Usage:**  
  Cookie handling, CORS setup, and request validation for enhanced security and functionality.

---

## Dependencies

- **cookie-parser**: ^1.4.7 – Middleware for parsing cookies in HTTP requests.
- **cors**: ^2.8.5 – Package to enable Cross-Origin Resource Sharing (CORS).
- **dotenv**: ^16.4.7 – Loads environment variables from a `.env` file into `process.env`.
- **express**: ^4.21.2 – Fast, unopinionated web framework for Node.js.
- **jsonwebtoken**: ^9.0.2 – JSON Web Token (JWT) for securely transmitting information between parties.
- **mongodb**: ^6.12.0 – MongoDB driver for Node.js.

---

## 🔧 How to Run

1. **Clone the repository.**

```bash
   git clone https://github.com/FollowNaim/LearnMate-Server
   cd LearnMate-Server
```

2. **Install Dependencies**

```bash
npm install
```

3. **Setup Environment Variables**

- create .env in the root directory.
- Add `JWT_TOKEN_SECRET` variable and put your **jwt secret token**.
- create a collection on mongodb atlas.
- Add `DB_USER, DB_PASS` variable and add your database username and password.

4. **Run the application**

```bash
npm run dev
```

5. **Access the app**

- Open http://localhost:5000 in your browser.

---

## Deployment

This server is deployed and accessible via the LearnMate platform. The environment variables are configured securely using `.env` files. For further deployment details, refer to the internal
