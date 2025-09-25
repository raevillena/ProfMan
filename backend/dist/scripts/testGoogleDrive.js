"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
async function testGoogleDrive() {
    try {
        console.log('🔗 Testing Google Drive integration...');
        const clientId = process.env.DRIVE_CLIENT_ID;
        const clientSecret = process.env.DRIVE_CLIENT_SECRET;
        const redirectUri = process.env.DRIVE_REDIRECT_URI;
        const encryptionKey = process.env.DRIVE_ENCRYPTION_KEY;
        console.log('📋 Configuration Check:');
        console.log(`Client ID: ${clientId ? '✅ Set' : '❌ Missing'}`);
        console.log(`Client Secret: ${clientSecret ? '✅ Set' : '❌ Missing'}`);
        console.log(`Redirect URI: ${redirectUri ? '✅ Set' : '❌ Missing'}`);
        console.log(`Encryption Key: ${encryptionKey ? '✅ Set' : '❌ Missing'}`);
        if (!clientId || !clientSecret || !redirectUri || !encryptionKey) {
            throw new Error('Missing required Google Drive environment variables');
        }
        console.log('🔐 Initializing OAuth2 client...');
        const oauth2Client = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, redirectUri);
        console.log('✅ OAuth2 client initialized successfully');
        console.log('🌐 Testing authorization URL generation...');
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/drive',
                'https://www.googleapis.com/auth/drive.file',
                'https://www.googleapis.com/auth/spreadsheets'
            ],
            prompt: 'consent'
        });
        console.log('✅ Authorization URL generated successfully');
        console.log('🔗 Authorization URL:', authUrl);
        console.log('📁 Testing Drive API initialization...');
        const drive = googleapis_1.google.drive({ version: 'v3', auth: oauth2Client });
        console.log('✅ Drive API initialized successfully');
        console.log('📊 Testing Sheets API initialization...');
        const sheets = googleapis_1.google.sheets({ version: 'v4', auth: oauth2Client });
        console.log('✅ Sheets API initialized successfully');
        console.log('🔒 Testing encryption functions...');
        const crypto = require('crypto');
        const testData = 'test-refresh-token-data';
        const algorithm = 'aes-256-cbc';
        const key = crypto.scryptSync(encryptionKey, 'salt', 32);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(testData, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        if (decrypted === testData) {
            console.log('✅ Encryption/decryption working correctly');
        }
        else {
            throw new Error('Encryption/decryption test failed');
        }
        console.log('🎉 Google Drive integration test completed successfully!');
        console.log('');
        console.log('📋 Test Summary:');
        console.log('✅ Environment variables configured');
        console.log('✅ OAuth2 client initialized');
        console.log('✅ Authorization URL generated');
        console.log('✅ Drive API ready');
        console.log('✅ Sheets API ready');
        console.log('✅ Encryption/decryption working');
        console.log('');
        console.log('🚀 Next Steps:');
        console.log('1. Visit the authorization URL to get an access token');
        console.log('2. Test the OAuth callback flow');
        console.log('3. Test file upload to Google Drive');
        console.log('4. Test Google Sheets export functionality');
        console.log('');
        console.log('⚠️  Note: Full OAuth flow requires user interaction');
        console.log('   - User must visit the authorization URL');
        console.log('   - User must grant permissions');
        console.log('   - User must complete the OAuth callback');
    }
    catch (error) {
        console.error('❌ Google Drive test failed:', error);
        console.log('');
        console.log('🔧 Troubleshooting:');
        console.log('1. Check your .env.development file has correct Google Drive credentials');
        console.log('2. Ensure Google Drive API is enabled in Google Cloud Console');
        console.log('3. Verify OAuth2 credentials are correct');
        console.log('4. Check that redirect URI matches your configuration');
        console.log('5. Ensure encryption key is 32 characters long');
    }
}
testGoogleDrive().then(() => {
    process.exit(0);
}).catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
});
//# sourceMappingURL=testGoogleDrive.js.map