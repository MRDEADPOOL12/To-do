# Todo Application

A full-stack todo application built with React, Node.js, TypeScript, and PostgreSQL.

## Features

- User authentication
- Create, read, update, and delete tasks
- Set deadlines for tasks
- Organize tasks in groups
- Mark tasks as complete
- Modern and responsive UI using Material-UI

## Tech Stack

### Frontend

- React 18
- TypeScript
- Material-UI
- React Router
- Axios for API calls

### Backend

- Node.js
- Express
- TypeScript
- TypeORM for database operations
- PostgreSQL
- JWT for authentication
- Jest for testing

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   - Create a PostgreSQL database
   - Copy `.env.example` to `.env` in the backend directory
   - Update the database connection details in `.env`

4. Start the development servers:

   ```bash
   # Start both frontend and backend
   npm start

   # Start backend only
   npm run start:backend

   # Start frontend only
   npm run start:frontend
   ```

5. Run tests:
   ```bash
   npm test
   ```

## Project Structure

```
todo/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── package.json
├── backend/           # Node.js backend application
│   ├── src/
│   │   ├── controllers/
│   │   ├── entities/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
└── package.json
```

## API Documentation

### Authentication

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Tasks

- GET /api/tasks - Get all tasks
- POST /api/tasks - Create a new task
- PUT /api/tasks/:id - Update a task
- DELETE /api/tasks/:id - Delete a task

### Groups

- GET /api/groups - Get all task groups
- POST /api/groups - Create a new group
- PUT /api/groups/:id - Update a group
- DELETE /api/groups/:id - Delete a group

## Architecture Decisions

1. **TypeScript**: Used throughout the application for type safety and better developer experience.
2. **Material-UI**: Chosen for its comprehensive component library and consistent design.
3. **TypeORM**: Selected for its TypeScript support and powerful features for database operations.
4. **JWT Authentication**: Implemented for secure, stateless authentication.
5. **PostgreSQL**: Chosen for its reliability, features, and TypeORM support.

## Duration

- The project was completed in within 4hrs
