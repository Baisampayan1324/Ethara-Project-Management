# EtharaPM - Project Management System

A production-ready project management web application built with **Node.js, Express, PostgreSQL, React, Vite, and Tailwind CSS**. Features role-based access control (RBAC), JWT authentication, and a Kanban-style task board.

## 🚀 Tech Stack
- **Backend:** Node.js, Express, Prisma (ORM), PostgreSQL
- **Frontend:** React, Vite, Tailwind CSS, Lucide React
- **Security:** JWT Authentication, bcrypt password hashing
- **Deployment:** Railway-ready (`railway.json`, `Procfile`)

## 🛡️ Role-Based Access Control (RBAC)
- **Admin:** Full access. Can create/delete projects, manage all tasks, and manage users.
- **Member:** Contributor access. Can view assigned projects, view tasks within those projects, and update task statuses.

## 📦 Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally.

### 1. Database Setup 

You have two options for your PostgreSQL database: **Supabase (Recommended & Easiest)** or **Local PostgreSQL**.

#### Option A: Using Supabase (Cloud Database)
Supabase gives you a free, instantly available PostgreSQL database.
1. Go to [Supabase.com](https://supabase.com) and create an account/sign in.
2. Click **"New Project"**, select an organization, name your project (e.g., `ethara-pm`), and generate a strong database password. Click **"Create new project"**.
3. Wait a minute for the database to provision.
4. On your Supabase dashboard, go to **Project Settings** (the gear icon on the left) -> **Database**.
5. Scroll down to **"Connection string"** and select the **URI** tab. 
6. Copy the connection string. It will look like this: `postgresql://postgres.[your-id]:[YOUR-PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres`.
7. **Important:** Replace `[YOUR-PASSWORD]` in the string with the actual password you created in step 2.
8. Use this string as your `DATABASE_URL` in the Backend `.env` file (see Step 2).

#### Option B: Using Local PostgreSQL
If you prefer to run the database on your own machine:
1. Install [PostgreSQL](https://www.postgresql.org/download/) and pgAdmin.
2. Open pgAdmin or your terminal (psql).
3. Create a new database named `etharapm_db` using the command: `CREATE DATABASE etharapm_db;`
4. The standard connection string for a local database is: `postgresql://username:password@localhost:5432/etharapm_db?schema=public` (replace `username` and `password` with your local postgres credentials).
5. Use this string as your `DATABASE_URL` in the Backend `.env` file.

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and paste your chosen database URL:
```env
PORT=5000
# Paste either your Supabase URL OR your Local DB URL here:
DATABASE_URL="your-database-connection-string-here"
JWT_SECRET="your-super-secret-jwt-key"
NODE_ENV=development
```
Run migrations and start the server:
```bash
npm run prisma:push
npm run dev
```

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the development server:
```bash
npm run dev
```

---

## 🌐 Railway Deployment Guide (One-Click)

This repository is optimized for deployment on [Railway](https://railway.app/).

1. Push this repository to your GitHub account.
2. Log in to Railway and click **New Project** -> **Deploy from GitHub repo**.
3. Select this repository.
4. Railway will detect the monorepo. Right-click on the canvas and add a **Database -> Add PostgreSQL**.
5. Go to your Web Service settings -> **Variables** and add:
   - `DATABASE_URL` (Reference the Postgres variable)
   - `JWT_SECRET` (Generate a random string)
   - `NODE_ENV=production`
6. **Important:** Ensure the Root Directory in Railway is set to `/` (the root of the repo). Railway will use the `Procfile` and `railway.json` to build the frontend and start the backend.
7. Click **Generate Domain** in the Networking tab of your Web Service.

**Your app is now live!**

---

## 🔑 Demo Credentials

To test the RBAC capabilities, you can sign up a new user, and then manually change their role to `ADMIN` in the database for the first time, or use a script to seed the database.

**Default Signup creates a `MEMBER` role.**

To create an Admin via SQL (after signing up):
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

---
*Built for the 1-2 day assessment timeline. Fully functional, secure, and responsive.*
