// Test setup file
import { initializeFirebase } from '../src/utils/firebase';

// Initialize Firebase for tests
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.FIREBASE_PROJECT_ID = 'test-project';
  process.env.FIREBASE_CLIENT_EMAIL = 'test@test.com';
  process.env.FIREBASE_PRIVATE_KEY = 'test-key';
  process.env.JWT_SECRET = 'test-jwt-secret';
  
  // Initialize Firebase
  initializeFirebase();
});

// Clean up after tests
afterAll(() => {
  // Cleanup if needed
});
