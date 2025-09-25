# ProfMan - Professor Management System

A comprehensive full-stack web application for managing professors, students, subjects, and educational content with Google Drive integration.

## 🚀 Features

### Admin Features
- Full CRUD operations on users, subjects, and branches
- Soft-delete and restore functionality
- Audit logging and user management
- Admin Drive for shared resources

### Professor Features
- Google Drive integration for file storage
- Subject and branch creation
- Automated quiz creation and grading
- Exam management and manual grading
- Grade export to Google Sheets
- Student announcements

### Student Features
- Auto-account creation with institutional email
- View classes and educational content
- Take quizzes and submit exams
- View grades and announcements

## 🛠 Tech Stack

### Frontend
- **Vite** + **React** + **TypeScript**
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Redux Toolkit** + **Redux Thunk** for state management
- **Axios** for HTTP requests
- **React Router** for navigation
- **Yup** for form validation

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Firebase Firestore** for database
- **Firebase Admin SDK** for server operations
- **JWT** for authentication
- **bcrypt** for password hashing
- **Google Drive API** for file storage
- **Google Sheets API** for grade export

## 📁 Project Structure

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

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Firestore enabled
- Google Cloud project with Drive and Sheets APIs enabled

### 1. Clone and Install
```bash
git clone <repository-url>
cd profman
npm install
```

### 2. Environment Setup

#### Backend Environment
Copy environment templates and configure for each environment:

```bash
cd backend
cp env.example .env.development
cp env.example .env.production
# Edit .env.development and .env.production with your configuration
```

#### Frontend Environment
Copy environment templates and configure for each environment:

```bash
cd frontend
cp env.example .env.development
cp env.example .env.production
# Edit .env.development and .env.production with your configuration
```

> **⚠️ Security Note**: Never commit your actual Firebase credentials or API keys to version control. Always use the `.env.example` files as templates and keep your real credentials in `.env.development` and `.env.production` files, which are already included in `.gitignore`.

> **Note**: See [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) for detailed environment configuration guide.

#### Environment Files Structure
```
profman/
├── backend/
│   ├── .env.development     # Development environment
│   ├── .env.production      # Production environment
│   └── env.example          # Template
├── frontend/
│   ├── .env.development     # Development environment
│   ├── .env.production      # Production environment
│   └── env.example          # Template
└── env.example              # Root template
```

### 3. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Create a service account:
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Download JSON and extract the values for your `.env`
4. Configure Firebase for your project:
   - Create a new Firebase project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Set up security rules for development

### 4. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Google Drive API and Google Sheets API
3. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:5000/api/drive/oauth-callback`
   - Copy Client ID and Client Secret to your `.env`

### 5. Run the Application

```bash
# Start both backend and frontend in development mode
npm run dev

# Or start individually
npm run dev:backend   # Backend only (uses .env.development)
npm run dev:frontend  # Frontend only (uses .env.development)

# Start with file watching (auto-restart on changes)
npm run dev:watch

# Production mode
npm run build  # Build for production
npm run start  # Start production servers
```

### 6. Seed Sample Data

```bash
# Seed comprehensive test data (recommended)
npm run seed:all

# Or seed basic data only
npm run seed

# Or seed individual components
npm run seed:users
npm run seed:subjects
npm run seed:branches
npm run seed:quizzes
npm run seed:announcements
```

**Comprehensive Data (`seed:all`):**
- 2 Admin users, 5 Professors, 10 Students
- 20+ subjects across different categories
- Multiple branches with enrolled students
- Quizzes with various question types
- Realistic quiz attempts with intelligent scoring
- Course announcements and notifications

**Basic Data (`seed`):**
- Admin user (admin@profman.com / admin123)
- Professor user (prof@profman.com / prof123)
- Sample subjects and branches
- Demo quiz and exam data

## 📚 API Documentation

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/change-password` - Change password

### Admin Endpoints
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create user
- `PATCH /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Soft delete user
- `POST /api/admin/restore/:id` - Restore soft-deleted user

### Subject Management
- `GET /api/subjects` - List subjects
- `POST /api/subjects` - Create subject
- `POST /api/subjects/:id/assign` - Assign subject to professor

### Branch Management
- `GET /api/branches` - List branches
- `POST /api/branches` - Create branch
- `GET /api/branches/:id` - Get branch details

### Quiz System
- `POST /api/quizzes` - Create quiz
- `POST /api/quizzes/:id/attempt` - Submit quiz attempt
- `GET /api/quizzes/:id/attempts` - Get quiz attempts

### Exam System
- `POST /api/exams` - Create exam
- `POST /api/exams/:id/upload` - Upload exam PDF
- `PATCH /api/exams/:id/submissions/:submissionId/grade` - Grade exam

### Google Drive Integration
- `GET /api/drive/oauth-url` - Get OAuth URL
- `GET /api/drive/oauth-callback` - OAuth callback
- `POST /api/drive/upload` - Upload file to Drive

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests only
npm run test:backend

# Run frontend tests only
npm run test:frontend
```

## 🌱 Data Seeding

ProfMan includes a comprehensive data seeding system for development and testing:

### Available Seeders

- **`npm run seed:all`** - Complete database seeding (recommended)
- **`npm run seed:users`** - Create user accounts (admin, professors, students)
- **`npm run seed:subjects`** - Create academic subjects across categories
- **`npm run seed:branches`** - Create class instances with enrolled students
- **`npm run seed:quizzes`** - Create interactive quizzes with various question types
- **`npm run seed:announcements`** - Create course announcements and notifications
- **`npm run seed:test`** - Create minimal test data for quick testing

### Seeder Features

- **Realistic Data**: Intelligent generation of realistic test data
- **Relationships**: Proper data relationships and dependencies
- **Intelligent Scoring**: Quiz attempts with realistic answer patterns
- **Comprehensive Coverage**: Multiple subjects, question types, and scenarios
- **Error Handling**: Robust error handling and progress reporting

See [SEEDERS.md](SEEDERS.md) for detailed documentation.

## 🔥 Firebase Integration

ProfMan includes comprehensive Firebase integration for both frontend and backend:

### Frontend Firebase Features
- **Authentication**: Firebase Auth with email/password
- **Firestore**: Real-time database operations
- **Context Provider**: React context for Firebase state management
- **Custom Hooks**: `useFirebaseAuth` for authentication state
- **Demo Page**: `/firebase-demo` route to test Firebase integration

### Backend Firebase Features
- **Admin SDK**: Server-side Firebase operations
- **Firestore**: Database operations with proper security
- **Authentication**: JWT token validation with Firebase
- **Data Models**: TypeScript interfaces for Firestore documents

### Firebase Configuration
Configure your Firebase project settings in the environment files:

```typescript
// Frontend configuration (from .env files)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
}
```

### Testing Firebase Integration
1. Visit `/firebase-demo` to test Firebase authentication
2. Check browser console for Firebase configuration status
3. Use the demo page to test Firestore data operations

## 🚀 Deployment

### Backend Deployment
1. Configure production environment in `backend/.env.production`
2. Build the backend: `npm run build:backend`
3. Deploy to your preferred platform (Heroku, Railway, etc.)
4. Set environment variables in your deployment platform

### Frontend Deployment
1. Configure production environment in `frontend/.env.production`
2. Build the frontend: `npm run build:frontend`
3. Deploy the `frontend/dist` folder to your hosting service
4. Ensure `VITE_API_BASE_URL` points to your production backend

### Environment-Specific Deployment
- **Development**: Uses `.env.development` files
- **Production**: Uses `.env.production` files
- **Scripts**: Automatically load correct environment based on mode

## 🔧 Development

### Code Style
- TypeScript strict mode enabled
- ESLint and Prettier configured
- Follow existing project conventions

### Adding New Features
1. Create feature branch
2. Implement backend API endpoints
3. Add frontend Redux slices and components
4. Write tests
5. Update documentation

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For questions or issues, please open a GitHub issue or contact the development team.
