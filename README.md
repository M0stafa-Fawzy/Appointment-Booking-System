# Appointment Booking System API

A RESTful API built with **NestJS** and **PostgreSQL** where service providers (doctors) can offer available time slots, and users can book appointments.

## Features

- **Authentication** — Signup/Login for Providers and Users with JWT
- **Slot Management** — Providers can create/edit/delete time slots
- **Appointment Booking** — Users can view available slots, book, and cancel appointments
- **Double Booking Prevention** — A slot can only be booked once
- **Cron Jobs** — Automated email reminders 30min before appointments & auto-cleanup of expired appointments
- **Swagger Docs** — Interactive API documentation at `/api-docs`
- **Dockerized** — Ready to run with Docker Compose

## Tech Stack

- NestJS 9
- TypeORM + PostgreSQL
- JWT Authentication (jsonwebtoken)
- Nodemailer (SMTP email)
- @nestjs/schedule (Cron jobs)
- Swagger (@nestjs/swagger)
- Docker + Docker Compose

## Getting Started

### 1. Clone & Install

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### 3. Run with Docker

```bash
docker-compose up --build
```

### 4. Run Locally (without Docker)

Make sure PostgreSQL is running, then:

```bash
npm run dev
```

### 5. Access API Docs

Open [http://localhost:3000/api-docs](http://localhost:3000/api-docs) in your browser.

## API Endpoints

### Auth
| Method | Endpoint         | Description                  | Auth |
|--------|-----------------|------------------------------|------|
| POST   | /auth/signup     | Register (provider or user)  | No   |
| POST   | /auth/login      | Login                        | No   |
| GET    | /auth/profile    | Get current user profile     | Yes  |

### Slots (Provider)
| Method | Endpoint           | Description                          | Auth     |
|--------|--------------------|--------------------------------------|----------|
| POST   | /slots             | Create a time slot                   | Provider |
| GET    | /slots/my-slots    | View all my slots + booking status   | Provider |
| GET    | /slots/available   | View available slots (filter by provider) | Yes |
| PUT    | /slots/:id         | Update a slot (own only)             | Provider |
| DELETE | /slots/:id         | Delete a slot (own only, unbooked)   | Provider |

### Appointments (User)
| Method | Endpoint                   | Description                | Auth |
|--------|---------------------------|----------------------------|------|
| POST   | /appointments/book/:slotId | Book an available slot     | Yes  |
| PUT    | /appointments/cancel/:id   | Cancel own appointment     | Yes  |
| GET    | /appointments/my           | Get all my appointments    | Yes  |
| GET    | /appointments/:id          | Get appointment by ID      | Yes  |

## Project Structure

```
src/
├── app.module.ts
├── main.ts
├── auth/          — Authentication (signup, login, JWT)
├── user/          — User entity & service
├── slot/          — Time slot CRUD (providers)
├── appointment/   — Booking & cancellation (users)
├── cron/          — Scheduled jobs (reminders, cleanup)
├── guards/        — AuthGuard, ProviderGuard
├── decorators/    — ProfileDecorator
├── interceptors/  — ProfileInterceptor, SerializeInterceptor
├── middlewares/   — AuthMiddleware (JWT verification)
└── filters/       — Global exception filter
```
