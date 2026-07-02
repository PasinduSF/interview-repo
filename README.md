# Trainee QA CRUD API

A small practice API for QA trainees. It demonstrates a simple authenticated flow:

> **Login → Course List → Update a Course**

Data is stored in plain JSON files, and the API is fully documented with Swagger.

## Tech stack

- Node.js + Express
- JWT authentication (`jsonwebtoken`) with bcrypt-hashed passwords
- JSON files as the data store (`data/`)
- Swagger UI (`swagger-jsdoc` + `swagger-ui-express`)

## Getting started

```bash
npm install
npm start
```

Then open the docs: **http://localhost:3000/api-docs**

## Seed user

| Username | Password  | Role   |
| -------- | --------- | ------ |
| admin    | admin123  | admin  |

The password is hashed into `data/users.json` on first run.

## The 3 API endpoints

| # | Method & Path        | Auth   | Purpose            |
| - | -------------------- | ------ | ------------------ |
| 1 | `POST /api/login`    | none   | Log in, get a JWT  |
| 2 | `GET /api/courses`   | Bearer | List all courses   |
| 3 | `PUT /api/courses/:id` | Bearer | Update a course  |

## How QA tests the flow in Swagger

1. Open http://localhost:3000/api-docs
2. **POST /api/login** → "Try it out" → send `admin` / `admin123` → copy the `token`.
3. **GET /api/courses** → "Try it out" → in the **Authorization** field paste `Bearer <token>` → Execute → see the list.
4. **PUT /api/courses/{id}** → paste `Bearer <token>` in **Authorization**, set `id` to `1`, edit the body → Execute → see the updated course.

> No global "Authorize" button — each protected endpoint has its own **Authorization** field so trainees see exactly where the token goes.

## Editable course fields (for `PUT`)

| Field          | Type    | Rule                                    |
| -------------- | ------- | --------------------------------------- |
| title          | string  | non-empty                               |
| instructor     | string  | non-empty                               |
| durationHours  | integer | non-negative                            |
| level          | string  | `Beginner` / `Intermediate` / `Advanced`|
| published      | boolean | true / false                            |

Send any subset of fields — only the ones you include are updated.

## Test ideas for trainees

- Login with wrong password → `401`.
- Login with missing field → `400`.
- Call `GET /api/courses` with no token → `401`.
- Update with an invalid `level` → `400`.
- Update a non-existent course id (e.g. `999`) → `404`.
- Update `durationHours` with a string → `400`.
- Happy path: update course `1` title and confirm it persists after a second `GET`.
