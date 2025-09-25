const fs = require('fs');
const path = require('path');

// Read the Firebase service account JSON
// Replace 'your-firebase-service-account.json' with your actual Firebase service account file
const firebaseJson = JSON.parse(fs.readFileSync('your-firebase-service-account.json', 'utf8'));

// Read the Google Drive OAuth JSON
// Replace 'your-google-oauth-credentials.json' with your actual Google OAuth credentials file
const driveJson = JSON.parse(fs.readFileSync('your-google-oauth-credentials.json', 'utf8'));

// Generate environment content
const envContent = `# Backend Development Environment Variables
# This file is loaded automatically in development mode

# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=${firebaseJson.project_id}
FIREBASE_CLIENT_EMAIL=${firebaseJson.client_email}
FIREBASE_PRIVATE_KEY="${firebaseJson.private_key}"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Google Drive Configuration
DRIVE_CLIENT_ID=${driveJson.web.client_id}
DRIVE_CLIENT_SECRET=${driveJson.web.client_secret}
DRIVE_REDIRECT_URI=${driveJson.web.redirect_uris[0]}
DRIVE_ENCRYPTION_KEY=your-32-character-encryption-key-change-this

# Admin Drive Configuration
ADMIN_DRIVE_FOLDER_ID=your-admin-google-drive-folder-id

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
`;

// Write the environment file
fs.writeFileSync('.env.development', envContent);

console.log('✅ .env.development file created successfully!');
console.log('');
console.log('📋 Configuration Summary:');
console.log(`Firebase Project ID: ${firebaseJson.project_id}`);
console.log(`Firebase Client Email: ${firebaseJson.client_email}`);
console.log(`Google Drive Client ID: ${driveJson.web.client_id}`);
console.log(`Google Drive Redirect URI: ${driveJson.web.redirect_uris[0]}`);
console.log('');
console.log('⚠️  IMPORTANT: Update the following values:');
console.log('- JWT_SECRET: Generate a secure 32+ character secret');
console.log('- DRIVE_ENCRYPTION_KEY: Generate a secure 32 character key');
console.log('- ADMIN_DRIVE_FOLDER_ID: Set your admin Google Drive folder ID');
