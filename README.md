# Team Task Manager (TaskFlow)

A premium Full Stack Team Task Management application built with the MERN stack.

## Tech Stack
- **Frontend**: React + Vite, Tailwind CSS, Lucide React, Recharts, Context API
- **Backend**: Node.js, Express.js, MongoDB + Mongoose, JWT, Bcrypt
- **Deployment**: Railway Ready

## Features
- **Auth**: Secure Login/Register with JWT & HttpOnly Cookies.
- **RBAC**: Admin and Member roles with specific permissions.
- **Projects**: Create and manage projects, assign team members.
- **Tasks**: CRUD operations for tasks with priority, status, and due dates.
- **Dashboard**: Visual analytics with Recharts and status summaries.
- **Responsive**: Fully optimized for mobile, tablet, and desktop.

## Setup Instructions

### Backend
1. Navigate to the `backend` folder.
2. Install dependencies: `npm install`
3. Create a `.env` file from `.env.example` and add your `MONGO_URI` and `JWT_SECRET`.
4. (Optional) Seed the database: `node seed.js`
5. Start the server: `npm run dev`

### Frontend
1. Navigate to the `frontend` folder.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Credentials (if seeded)
- **Admin**: admin@example.com / password123
- **Member**: member@example.com / password123

## Railway Deployment
1. Create a new project on Railway.
2. Connect your GitHub repository.
3. Set up environment variables in Railway dashboard (MONGO_URI, JWT_SECRET, NODE_ENV=production).
4. For Frontend, ensure the build command is `npm run build` and publish directory is `dist`.
