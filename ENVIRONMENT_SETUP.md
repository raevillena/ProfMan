# Environment Setup Guide

This guide explains how to properly configure environment variables for different deployment environments in ProfMan.

## 📁 Environment File Structure

```
profman/
├── backend/
│   ├── .env.development     # Development environment variables
│   ├── .env.production      # Production environment variables
│   └── env.example          # Template for environment files
├── frontend/
│   ├── .env.development     # Development environment variables
│   ├── .env.production      # Production environment variables
│   └── env.example          # Template for environment files
└── env.example              # Root template
```

## 🔧 Backend Environment Configuration

### Development Environment (`.env.development`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
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

### Production Environment (`.env.production`)

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-production-service-account-email@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRODUCTION_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# JWT Configuration
JWT_SECRET=your-production-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Google Drive Configuration
DRIVE_CLIENT_ID=your-production-google-oauth-client-id
DRIVE_CLIENT_SECRET=your-production-google-oauth-client-secret
DRIVE_REDIRECT_URI=https://your-production-domain.com/api/drive/oauth-callback
DRIVE_ENCRYPTION_KEY=your-production-32-character-encryption-key

# Admin Drive Configuration
ADMIN_DRIVE_FOLDER_ID=your-production-admin-google-drive-folder-id

# CORS Configuration
CORS_ORIGIN=https://your-production-frontend-domain.com
```

## 🎨 Frontend Environment Configuration

### Development Environment (`.env.development`)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyCcSSQzNdJGpMOSpmtoxIBgKCQ_uFw2DA8
VITE_FIREBASE_AUTH_DOMAIN=profman-cc779.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=profman-cc779
VITE_FIREBASE_STORAGE_BUCKET=profman-cc779.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=89358236477
VITE_FIREBASE_APP_ID=1:89358236477:web:d10f78cc745d38806f2354
VITE_FIREBASE_MEASUREMENT_ID=G-05M3HRMPYD
```

### Production Environment (`.env.production`)

```env
# API Configuration
VITE_API_BASE_URL=https://your-production-api.com/api
VITE_GOOGLE_CLIENT_ID=your-production-google-oauth-client-id

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyCcSSQzNdJGpMOSpmtoxIBgKCQ_uFw2DA8
VITE_FIREBASE_AUTH_DOMAIN=profman-cc779.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=profman-cc779
VITE_FIREBASE_STORAGE_BUCKET=profman-cc779.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=89358236477
VITE_FIREBASE_APP_ID=1:89358236477:web:d10f78cc745d38806f2354
VITE_FIREBASE_MEASUREMENT_ID=G-05M3HRMPYD
```

## 🚀 Scripts and Commands

### Development Scripts

```bash
# Start both frontend and backend in development mode
npm run dev

# Start only backend in development mode
npm run dev:backend

# Start only frontend in development mode
npm run dev:frontend

# Start with file watching (auto-restart on changes)
npm run dev:watch
```

### Production Scripts

```bash
# Build for production
npm run build

# Start production servers
npm run start

# Start only backend in production mode
npm run start:backend

# Start only frontend in production mode
npm run start:frontend
```

### Environment-Specific Scripts

```bash
# Backend development with .env.development
cd backend && npm run dev

# Backend production with .env.production
cd backend && npm run start

# Frontend development mode
cd frontend && npm run dev

# Frontend production build
cd frontend && npm run build
```

## 🔄 Environment Loading

### Backend Environment Loading

The backend uses Node.js built-in `--env-file` flag:

```bash
# Development
ts-node --env-file=.env.development src/index.ts

# Production
node --env-file=.env.production dist/index.js
```

### Frontend Environment Loading

The frontend uses Vite's mode-based environment loading:

```bash
# Development mode (loads .env.development)
vite --mode development

# Production mode (loads .env.production)
vite build --mode production
```

## 📋 Setup Instructions

### 1. Copy Environment Templates

```bash
# Backend
cd backend
cp env.example .env.development
cp env.example .env.production

# Frontend
cd frontend
cp env.example .env.development
cp env.example .env.production
```

### 2. Configure Development Environment

1. **Backend** (`.env.development`):
   - Set your Firebase service account credentials
   - Configure JWT secrets
   - Set up Google Drive credentials
   - Configure CORS for localhost

2. **Frontend** (`.env.development`):
   - Set API base URL to localhost
   - Configure Google OAuth client ID
   - Firebase configuration is pre-configured

### 3. Configure Production Environment

1. **Backend** (`.env.production`):
   - Use production Firebase service account
   - Use production JWT secrets
   - Use production Google Drive credentials
   - Configure CORS for production domain

2. **Frontend** (`.env.production`):
   - Set API base URL to production domain
   - Use production Google OAuth client ID
   - Firebase configuration remains the same

### 4. Test Environment Configuration

```bash
# Test development environment
npm run dev

# Test production build
npm run build
npm run start
```

## 🔒 Security Considerations

### Development Environment
- Use development-specific credentials
- Enable debug logging
- Allow localhost CORS
- Use test Firebase project (if separate)

### Production Environment
- Use production credentials
- Disable debug logging
- Restrict CORS to production domains
- Use production Firebase project
- Rotate secrets regularly

## 🐛 Troubleshooting

### Common Issues

1. **Environment file not found**
   - Ensure `.env.development` and `.env.production` exist
   - Check file permissions
   - Verify file location

2. **Variables not loading**
   - Check variable naming (VITE_ prefix for frontend)
   - Verify no spaces around `=`
   - Check for typos in variable names

3. **Wrong environment loaded**
   - Verify script commands use correct mode
   - Check environment file names
   - Ensure proper file structure

### Debug Environment Loading

```bash
# Backend - check loaded environment
cd backend && node -e "console.log(process.env)"

# Frontend - check loaded environment
cd frontend && npm run dev
# Check browser console for VITE_ variables
```

## 📚 Best Practices

1. **Never commit environment files**
   - Add `.env*` to `.gitignore`
   - Use `env.example` as templates
   - Document required variables

2. **Use different credentials per environment**
   - Separate Firebase projects for dev/prod
   - Different JWT secrets
   - Different API keys

3. **Validate environment variables**
   - Check required variables on startup
   - Provide clear error messages
   - Use default values where appropriate

4. **Document environment setup**
   - Keep this guide updated
   - Document new variables
   - Provide setup examples

## ✅ Verification Checklist

- [ ] Environment files created (`.env.development`, `.env.production`)
- [ ] Development environment configured
- [ ] Production environment configured
- [ ] Scripts working correctly
- [ ] Environment variables loading properly
- [ ] Security considerations addressed
- [ ] Documentation updated

Your ProfMan application is now properly configured for different environments! 🎉
