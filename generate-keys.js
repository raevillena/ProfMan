const crypto = require('crypto');

// Generate a secure 32-character encryption key
const driveEncryptionKey = crypto.randomBytes(16).toString('hex');

// Generate a secure JWT secret (64 characters)
const jwtSecret = crypto.randomBytes(32).toString('hex');

console.log('🔐 Generated Secure Keys for ProfMan');
console.log('=====================================');
console.log('');
console.log('📁 Google Drive Encryption Key (32 characters):');
console.log(driveEncryptionKey);
console.log('');
console.log('🔑 JWT Secret (64 characters):');
console.log(jwtSecret);
console.log('');
console.log('📋 Add these to your backend/.env.development file:');
console.log('');
console.log(`DRIVE_ENCRYPTION_KEY=${driveEncryptionKey}`);
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('');
console.log('⚠️  IMPORTANT: Keep these keys secure and never commit them to version control!');
