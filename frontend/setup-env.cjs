const fs = require('fs');

// Generate frontend environment content
const envContent = `# Frontend Development Environment Variables
# This file is loaded automatically in development mode

# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=720731353138-0o742e2e2p3nqtdgngeh5tb3r7drmh0f.apps.googleusercontent.com

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyCcSSQzNdJGpMOSpmtoxIBgKCQ_uFw2DA8
VITE_FIREBASE_AUTH_DOMAIN=profman-cc779.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=profman-cc779
VITE_FIREBASE_STORAGE_BUCKET=profman-cc779.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=89358236477
VITE_FIREBASE_APP_ID=1:89358236477:web:d10f78cc745d38806f2354
VITE_FIREBASE_MEASUREMENT_ID=G-05M3HRMPYD
`;

// Write the environment file
fs.writeFileSync('.env.development', envContent);

console.log('✅ Frontend .env.development file created successfully!');
console.log('');
console.log('📋 Frontend Configuration Summary:');
console.log('API Base URL: http://localhost:5000/api');
console.log('Google Client ID: 720731353138-0o742e2e2p3nqtdgngeh5tb3r7drmh0f.apps.googleusercontent.com');
console.log('Firebase Project ID: profman-cc779');
