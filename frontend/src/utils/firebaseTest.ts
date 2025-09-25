import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

// Test Firebase configuration
export const testFirebaseConfig = () => {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  }

  console.log('🔥 Firebase Configuration Test:')
  console.log('Project ID:', firebaseConfig.projectId)
  console.log('Auth Domain:', firebaseConfig.authDomain)
  console.log('API Key:', firebaseConfig.apiKey ? '✅ Set' : '❌ Missing')
  console.log('App ID:', firebaseConfig.appId ? '✅ Set' : '❌ Missing')
  
  // Check if all required fields are present
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId']
  const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig])
  
  if (missingFields.length === 0) {
    console.log('✅ All required Firebase configuration fields are present')
  } else {
    console.log('❌ Missing Firebase configuration fields:', missingFields)
  }
  
  return firebaseConfig
}

// Test Firebase initialization
export const testFirebaseInit = () => {
  try {
    const firebaseConfig = testFirebaseConfig()
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const db = getFirestore(app)
    
    console.log('✅ Firebase initialized successfully')
    console.log('Auth instance:', auth)
    console.log('Firestore instance:', db)
    
    return { app, auth, db }
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error)
    throw error
  }
}
