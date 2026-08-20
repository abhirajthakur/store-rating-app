# Store Rating App

A full stack web application where users can browse stores and submit ratings from 1 to 5.

The application has role based access for administrators, normal users, and store owners. Each role has access to different features and dashboards.

## Features

### Authentication

- User registration
- User login
- JWT based authentication
- Protected routes
- Role based authorization
- Change password
- Logout

### System Administrator

An administrator can:

- View dashboard statistics
- View total users
- View total stores
- View total submitted ratings
- Add new users
- Add new stores
- Create admin, normal user, and store owner accounts
- View users
- View stores
- Filter users by name, email, address, and role
- Filter stores by name, email, and address
- Sort users and stores
- View individual user details
- View a store owner's rating information

### Normal User

A normal user can:

- Register for an account
- Login
- View all registered stores
- Search stores by name
- Search stores by address
- Sort stores by name, address, and rating
- View the overall rating of a store
- View their submitted rating
- Submit a rating from 1 to 5
- Update an existing rating
- Change their password
- Logout

### Store Owner

A store owner can:

- Login
- View their store information
- View the average rating of their store
- View users who submitted ratings
- Change their password
- Logout

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL
- Drizzle ORM
- Zod
- JWT
- bcrypt

## Database Structure

The application uses three main tables.

### Users

Stores information about administrators, normal users, and store owners.

```text
id
name
email
passwordHash
address
role
createdAt
```

Available roles:

```text
admin
normal
store_owner
```

### Stores

Stores information about registered stores.

```text
id
name
email
address
ownerId
createdAt
```

A store can optionally be assigned to a store owner.

### Ratings

Stores ratings submitted by normal users.

```text
id
userId
storeId
rating
createdAt
updatedAt
```

A user can only submit one rating for a particular store.

This is enforced with a unique constraint on:

```text
userId + storeId
```

The rating value is restricted to a range from 1 to 5.

## API Routes

### Authentication

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a normal user |
| POST | `/api/auth/login` | Login |
| PUT | `/api/auth/password` | Update password |

### Admin

| Method | Route | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Get dashboard statistics |
| POST | `/api/admin/users` | Create a user |
| GET | `/api/admin/users` | Get users |
| GET | `/api/admin/users/:id` | Get user details |
| POST | `/api/admin/stores` | Create a store |
| GET | `/api/admin/stores` | Get stores |

### Stores

| Method | Route | Description |
|---|---|---|
| GET | `/api/stores` | Get stores for normal users |
| POST | `/api/stores/:id/rating` | Submit a rating |
| PUT | `/api/stores/:id/rating` | Update a rating |

### Store Owner

| Method | Route | Description |
|---|---|---|
| GET | `/api/store-owner/dashboard` | Get store owner dashboard |

### Health Check

| Method | Route | Description |
|---|---|---|
| GET | `/api/health` | Check API status |

## Backend Setup

### 1. Clone the repository

```bash
git clone https://github.com/abhirajthakur/store-rating-app.git
cd store-rating-app
```

### 2. Go to the backend directory

```bash
cd backend
```

### 3. Install dependencies

```bash
pnpm install
```

### 4. Create the environment file

Copy `.env.example`:

```bash
cp .env.example .env
```

Update the values if required.

Example:

```env
PORT=3000

DATABASE_URL=postgresql://postgres:password@localhost:5432/store_rating_db

JWT_SECRET=replace_this_with_a_long_random_string_min_32_chars
JWT_EXPIRES_IN=7d
```

### 5. Create the database

Create a PostgreSQL database:

```text
store_rating_db
```

Make sure the database URL in `.env` matches your local PostgreSQL configuration.

### 6. Run database migrations

```bash
pnpm db:migrate
```

### 7. Seed the database

The project includes seed data with administrators, store owners, normal users, stores, and ratings.

Run:

```bash
pnpm db:seed
```

### 8. Start the backend

```bash
pnpm dev
```

The API should run on:

```text
http://localhost:3000
```

You can check the API using:

```text
http://localhost:3000/api/health
```

Expected response:

```json
{
  "status": "ok"
}
```

## Frontend Setup

Open another terminal and go to the frontend directory.

```bash
cd frontend
```

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

The Vite development server will display the local URL in the terminal.

If your frontend uses an environment variable for the API URL, create a `.env` file in the frontend directory.

Example:

```env
VITE_API_URL=http://localhost:3000/api
```

## Seed Accounts

After running the seed command, you can use the following accounts.

### Administrator

```text
Email: admin@storerating.com
Password: Admin@1234
```

### Store Owner

```text
Email: owner1@storerating.com
Password: Password@123
```

### Normal User

```text
Email: user1@storerating.com
Password: Password@123
```

Another normal user is also available:

```text
Email: user2@storerating.com
Password: Password@123
```

## Validation Rules

The application validates user input on the backend.

### Name

- Minimum 20 characters
- Maximum 60 characters

### Email

- Must be a valid email address

### Address

- Maximum 400 characters

### Password

- Minimum 8 characters
- Maximum 16 characters
- Must contain at least one uppercase letter
- Must contain at least one special character

### Rating

- Must be an integer
- Must be between 1 and 5

## Available Backend Commands

```bash
pnpm dev
```

Starts the development server.

```bash
pnpm build
```

Builds the TypeScript project.

```bash
pnpm start
```

Starts the compiled application.

```bash
pnpm db:generate
```

Generates a Drizzle migration.

```bash
pnpm db:migrate
```

Runs database migrations.

```bash
pnpm db:seed
```

Seeds the database with development data.
