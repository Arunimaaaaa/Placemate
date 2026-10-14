# Placemate

A booking web app for Vidyalankar Institute of Technology (VIT), Mumbai. Students and staff can book classrooms, venues and equipment, and an admin approves or rejects requests.

## Features

- **Sign up and log in** with passwords hashed using bcrypt
- **Session tracking:** login and logout times are stored for each user
- **Email notification** on login, sent with Nodemailer
- **Classroom and venue booking** with capacity and facilities (projector, sound system, AC)
- **Equipment booking** with availability
- **Admin panel** listing pending venue and equipment bookings
- **User profile** page

## Tech stack

| Part | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express |
| Database | PostgreSQL (`pg`) |
| Security | bcrypt password hashing, credentials in `.env` |
| Email | Nodemailer (Gmail) |
| CI/CD | Jenkins pipeline (`Jenkinsfile`) |

## How it works

```
Browser (HTML/CSS/JS)  ──►  Express API (port 3002)  ──►  PostgreSQL
                                   │
                                   └──►  Nodemailer (login email)
```

| Method | Endpoint | What it does |
|---|---|---|
| POST | `/api/signup` | Creates a user (rejects duplicate emails, hashes the password) |
| POST | `/api/login` | Checks the password, records the login time, sends a welcome email |
| POST | `/api/logout` | Records the logout time for the user's latest session |

Bookings are currently saved in the browser (`localStorage`) for the demo; moving them into PostgreSQL is the next step.

## Run it locally

1. Install [Node.js](https://nodejs.org) and [PostgreSQL](https://www.postgresql.org/), and create a database called `Placemate`.
2. In `backend/`, copy `.env.example` to `.env` and fill in your database password and Gmail app password.
3. Install and start the backend:
   ```
   cd backend
   npm install
   npm start
   ```
4. Open http://localhost:3002 in your browser. The `users` and `user_sessions` tables are created automatically.

## What I'd improve next

- Store bookings in PostgreSQL with clash checks on the server
- Role-based access so only admins can approve bookings
- Deploy the pipeline to a real server
