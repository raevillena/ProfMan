import { initializeFirebase, getFirestore } from '../utils/firebase'

// Test Firebase connection and basic operations
async function testFirebase() {
  try {
    console.log('🔥 Testing Firebase connection...')
    
    // Initialize Firebase
    initializeFirebase()
    const db = getFirestore()
    
    console.log('✅ Firebase initialized successfully')
    
    // Test 1: Add a test document
    console.log('📝 Testing document creation...')
    const testDoc = await db.collection('test').add({
      message: 'Hello from ProfMan!',
      timestamp: new Date(),
      test: true
    })
    console.log('✅ Test document created with ID:', testDoc.id)
    
    // Test 2: Read documents
    console.log('📖 Testing document reading...')
    const testSnapshot = await db.collection('test').get()
    console.log('✅ Found', testSnapshot.size, 'test documents')
    
    testSnapshot.forEach((doc: any) => {
      console.log('  - Document ID:', doc.id, 'Data:', doc.data())
    })
    
    // Test 3: Test users collection structure
    console.log('👥 Testing users collection...')
    try {
      const usersSnapshot = await db.collection('users').get()
      console.log('✅ Users collection accessible, found', usersSnapshot.size, 'users')
    } catch (error) {
      console.log('ℹ️  Users collection not found (expected for new project)')
    }
    
    // Test 4: Test subjects collection structure
    console.log('📚 Testing subjects collection...')
    try {
      const subjectsSnapshot = await db.collection('subjects').get()
      console.log('✅ Subjects collection accessible, found', subjectsSnapshot.size, 'subjects')
    } catch (error) {
      console.log('ℹ️  Subjects collection not found (expected for new project)')
    }
    
    console.log('🎉 Firebase test completed successfully!')
    console.log('')
    console.log('Next steps:')
    console.log('1. Visit http://localhost:5173/firebase-demo to test frontend integration')
    console.log('2. Run "npm run seed:test" to add sample data')
    console.log('3. Check Firebase Console to see the test data')
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error)
    console.log('')
    console.log('Troubleshooting:')
    console.log('1. Check your .env.development file has correct Firebase credentials')
    console.log('2. Ensure Firebase project "profman-cc779" exists')
    console.log('3. Verify Firestore is enabled in Firebase Console')
    console.log('4. Check that your service account has proper permissions')
  }
}

// Run the test
testFirebase().then(() => {
  process.exit(0)
}).catch((error) => {
  console.error('Test failed:', error)
  process.exit(1)
})
