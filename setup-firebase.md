# Firebase Setup Guide for ProfMan

This guide will help you complete the Firebase setup for your ProfMan application.

## 🔥 Firebase Project Configuration

Your Firebase project `profman-cc779` is already configured in the application. Here's what you need to do:

### 1. Enable Firebase Services

1. Go to [Firebase Console](https://console.firebase.google.com/project/profman-cc779)
2. Navigate to your project: `profman-cc779`

#### Enable Authentication
1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Save the configuration

#### Enable Firestore Database
1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to your users)
5. Click **Done**

### 2. Set Up Security Rules

#### Firestore Security Rules
Go to **Firestore Database** > **Rules** and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents for authenticated users
    // This is for development only - tighten rules for production
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### Authentication Rules
Go to **Authentication** > **Settings** > **Authorized domains** and add:
- `localhost` (for development)
- Your production domain (when deployed)

### 3. Create Service Account (Backend)

1. Go to **Project Settings** > **Service accounts**
2. Click **Generate new private key**
3. Download the JSON file
4. Extract the following values for your `backend/.env`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

### 4. Environment Configuration

#### Backend Environment (`backend/.env`)
```env
# Firebase Configuration
FIREBASE_PROJECT_ID=profman-cc779
FIREBASE_CLIENT_EMAIL=your-service-account-email@profman-cc779.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

#### Frontend Environment (`frontend/.env`)
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyCcSSQzNdJGpMOSpmtoxIBgKCQ_uFw2DA8
VITE_FIREBASE_AUTH_DOMAIN=profman-cc779.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=profman-cc779
VITE_FIREBASE_STORAGE_BUCKET=profman-cc779.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=89358236477
VITE_FIREBASE_APP_ID=1:89358236477:web:d10f78cc745d38806f2354
VITE_FIREBASE_MEASUREMENT_ID=G-05M3HRMPYD
```

### 5. Test Firebase Integration

1. Start the application:
   ```bash
   npm run dev
   ```

2. Visit the Firebase demo page:
   ```
   http://localhost:5173/firebase-demo
   ```

3. Test authentication:
   - Try signing up with a new account
   - Try signing in with existing account
   - Check browser console for any errors

4. Test Firestore operations:
   - Click "Load Firestore Data" button
   - Verify data is loaded from Firestore
   - Check browser console for any errors

### 6. Seed Data with Firebase

1. Make sure your backend environment is configured
2. Run the seeder:
   ```bash
   npm run seed:all
   ```

3. Verify data in Firebase Console:
   - Go to **Firestore Database**
   - Check that collections are created:
     - `users`
     - `subjects`
     - `branches`
     - `quizzes`
     - `quizAttempts`
     - `announcements`

### 7. Troubleshooting

#### Common Issues

1. **Firebase not initialized**
   - Check that environment variables are set correctly
   - Verify Firebase project ID matches
   - Check browser console for configuration errors

2. **Authentication errors**
   - Ensure Email/Password provider is enabled
   - Check that authorized domains include localhost
   - Verify API key is correct

3. **Firestore permission denied**
   - Check security rules
   - Ensure user is authenticated
   - Verify collection names match

4. **Backend Firebase errors**
   - Check service account credentials
   - Verify private key format (with \n for newlines)
   - Ensure project ID matches

#### Debug Steps

1. Check browser console for errors
2. Verify environment variables in both frontend and backend
3. Test Firebase connection in Firebase Console
4. Check Firestore security rules
5. Verify authentication providers are enabled

### 8. Production Considerations

For production deployment:

1. **Tighten Security Rules**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only access their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Add more specific rules for other collections
       match /subjects/{subjectId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'professor'];
       }
     }
   }
   ```

2. **Add Production Domains**:
   - Add your production domain to authorized domains
   - Update CORS settings for production

3. **Monitor Usage**:
   - Set up Firebase monitoring
   - Configure alerts for errors
   - Monitor database usage

## ✅ Verification Checklist

- [ ] Firebase project created and configured
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created
- [ ] Security rules configured
- [ ] Service account created and downloaded
- [ ] Environment variables configured
- [ ] Frontend Firebase integration working
- [ ] Backend Firebase integration working
- [ ] Data seeding successful
- [ ] Demo page accessible and functional

## 🆘 Support

If you encounter issues:

1. Check the [Firebase Documentation](https://firebase.google.com/docs)
2. Review the browser console for errors
3. Verify all environment variables are set correctly
4. Test with the Firebase demo page
5. Check Firestore security rules

Your ProfMan application is now ready to use with Firebase! 🎉
