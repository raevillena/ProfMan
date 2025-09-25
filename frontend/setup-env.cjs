const fs = require('fs');

// Generate frontend environment content
const envContent = `# Frontend Development Environment Variables
# This file is loaded automatically in development mode

# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
`;

// Write the environment file
fs.writeFileSync('.env.development', envContent);

console.log('✅ Frontend .env.development file created successfully!');
console.log('');
console.log('📋 Frontend Configuration Summary:');
console.log('API Base URL: http://localhost:5000/api');
console.log('Google Client ID: your-google-client-id');
console.log('Firebase Project ID: your-firebase-project-id');
