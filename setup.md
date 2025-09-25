# ProfMan Setup Guide

This guide will help you set up and run the ProfMan application locally.

## Prerequisites

- Node.js 18+ and npm
- Firebase project with Firestore enabled
- Google Cloud project with Drive and Sheets APIs enabled

## Quick Setup

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

#### Backend Environment
Copy `env.example` to `backend/.env` and configure:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Google Drive Configuration
DRIVE_CLIENT_ID=your-google-oauth-client-id
DRIVE_CLIENT_SECRET=your-google-oauth-client-secret
DRIVE_REDIRECT_URI=http://localhost:5000/api/drive/oauth-callback
DRIVE_ENCRYPTION_KEY=your-32-character-encryption-key

# Admin Drive Configuration
ADMIN_DRIVE_FOLDER_ID=your-admin-google-drive-folder-id

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

#### Frontend Environment
Copy `frontend/env.example` to `frontend/.env` and configure:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

### 3. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Create a service account:
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Download JSON and extract the values for your `.env`

### 4. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Google Drive API and Google Sheets API
3. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:5000/api/drive/oauth-callback`
   - Copy Client ID and Client Secret to your `.env`

### 5. Run the Application

```bash
# Start both backend and frontend
npm run dev

# Or start individually
npm run dev:backend   # Backend only (port 5000)
npm run dev:frontend  # Frontend only (port 5173)
```

### 6. Seed Sample Data

```bash
npm run seed
```

This creates:
- Admin user (admin@profman.com / admin123)
- Professor user (prof@profman.com / prof123)
- Sample subjects and branches
- Demo quiz and exam data

## Development

### Backend Development

```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm test             # Run tests
npm run lint         # Run linter
```

### Frontend Development

```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm test             # Run tests
npm run lint         # Run linter
```

## Project Structure

```
profman/
├── backend/                 # Express + TypeScript backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth, validation middleware
│   │   ├── models/          # Firestore data models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic services
│   │   ├── utils/           # Utility functions
│   │   └── validation/      # Yup schemas
│   ├── tests/               # Backend tests
│   └── package.json
├── frontend/                # React + TypeScript frontend
│   ├── src/
│   │   ├── app/             # Redux store configuration
│   │   ├── components/      # Reusable UI components
│   │   ├── features/        # Redux slices by feature
│   │   ├── layouts/         # Role-based layouts
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   └── package.json
├── .env.example             # Environment variables template
└── README.md
```

## Features Implemented

### ✅ Completed
- Project scaffolding with TypeScript
- Backend Express API with Firebase Admin SDK
- Authentication system with JWT and student auto-creation
- Firestore data models and validation schemas
- Frontend React app with Redux Toolkit
- Role-based layouts and routing
- Basic UI components with Tailwind CSS
- Development scripts and environment configuration

### 🚧 In Progress
- User management and role-based access control
- Google Drive OAuth integration
- Subject and branch management system
- Quiz system with auto-grading
- Exam upload and grading system
- Google Sheets export functionality
- Comprehensive tests and documentation

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Register new user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/me` - Get current user

### Admin (Placeholder)
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create user
- `PATCH /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `POST /api/admin/restore/:id` - Restore user

### Quizzes (Implemented)
- `POST /api/quizzes` - Create quiz
- `GET /api/quizzes/:id` - Get quiz by ID
- `GET /api/quizzes/branch/:branchId` - Get quizzes by branch
- `POST /api/quizzes/:id/attempt` - Submit quiz attempt
- `GET /api/quizzes/:id/attempts` - Get quiz attempts
- `PATCH /api/quizzes/:id` - Update quiz

## Troubleshooting

### Common Issues

1. **Firebase connection failed**
   - Check your Firebase project ID and service account credentials
   - Ensure Firestore is enabled in your Firebase project

2. **CORS errors**
   - Verify CORS_ORIGIN is set to `http://localhost:5173`
   - Check that frontend is running on port 5173

3. **JWT errors**
   - Ensure JWT_SECRET is at least 32 characters long
   - Check token expiration settings

4. **Google Drive API errors**
   - Verify Google Cloud project has Drive API enabled
   - Check OAuth credentials and redirect URI

### Getting Help

- Check the console logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure all dependencies are installed
- Check that Firebase and Google Cloud projects are properly configured

## Next Steps

1. Complete the remaining features (user management, Drive integration, etc.)
2. Add comprehensive tests
3. Implement error handling and loading states
4. Add more UI components and pages
5. Deploy to production

## License

MIT License - see LICENSE file for details
