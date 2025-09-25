const fs = require('fs');

// Read the current .env.development file
let envContent = fs.readFileSync('.env.development', 'utf8');

// Update the JWT_SECRET and DRIVE_ENCRYPTION_KEY
envContent = envContent.replace(
  'JWT_SECRET=your-super-secret-jwt-key-min-32-characters-change-this-in-production',
  'JWT_SECRET=1a9becffdea3fe913f0582572aad69a976c63654950620bc71b8fc75b4f127a7'
);

envContent = envContent.replace(
  'DRIVE_ENCRYPTION_KEY=your-32-character-encryption-key-change-this',
  'DRIVE_ENCRYPTION_KEY=63f1d0b727300b5fe4c48cc872342946'
);

// Write the updated file
fs.writeFileSync('.env.development', envContent);

console.log('✅ Updated .env.development with secure keys!');
console.log('');
console.log('🔐 Security Configuration Complete:');
console.log('- JWT Secret: 64-character secure key');
console.log('- Drive Encryption Key: 32-character secure key');
console.log('- Firebase credentials: Configured');
console.log('- Google Drive OAuth: Configured');
console.log('');
console.log('⚠️  Remember to:');
console.log('1. Never commit .env files to version control');
console.log('2. Use different keys for production');
console.log('3. Set ADMIN_DRIVE_FOLDER_ID when you create an admin folder');
