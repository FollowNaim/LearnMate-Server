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

## Deployment

This server is deployed and accessible via the LearnMate platform. The environment variables are configured securely using `.env` files. For further deployment details, refer to the internal
