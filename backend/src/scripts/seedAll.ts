import { initializeFirebase, getFirestore } from '../utils/firebase'

// Initialize Firebase
initializeFirebase()

const db = getFirestore()

async function clearDatabase() {
  console.log('🧹 Clearing existing data...')
  
  const collections = ['users', 'subjects', 'branches', 'quizzes', 'quizAttempts', 'announcements']
  
  for (const collectionName of collections) {
    try {
      const snapshot = await db.collection(collectionName).get()
      const batch = db.batch()
      
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref)
      })
      
      if (snapshot.docs.length > 0) {
        await batch.commit()
        console.log(`✅ Cleared ${snapshot.docs.length} documents from ${collectionName}`)
      }
    } catch (error) {
      console.error(`❌ Error clearing ${collectionName}:`, error)
    }
  }
}

async function runSeeder(seederName: string, seederFunction: () => Promise<void>) {
  console.log(`\n🚀 Running ${seederName}...`)
  try {
    await seederFunction()
    console.log(`✅ ${seederName} completed successfully!`)
  } catch (error) {
    console.error(`❌ ${seederName} failed:`, error)
    throw error
  }
}

async function main() {
  try {
    console.log('🌱 Starting comprehensive database seeding...')
    console.log('This will clear all existing data and create fresh sample data.')
    
    // Ask for confirmation (in a real app, you'd want to add a prompt)
    console.log('⚠️  WARNING: This will delete all existing data!')
    
    // Clear existing data
    await clearDatabase()
    
    // Import and run individual seeders
    console.log('\n📚 Running individual seeders...')
    
    // Import seeder functions
    const { seedUsers } = await import('./seedUsers')
    const { seedSubjects } = await import('./seedSubjects')
    const { seedBranches } = await import('./seedBranches')
    const { seedQuizzes } = await import('./seedQuizzes')
    const { seedAnnouncements } = await import('./seedAnnouncements')
    
    // Run seeders in order
    await runSeeder('User Seeder', seedUsers)
    await runSeeder('Subject Seeder', seedSubjects)
    await runSeeder('Branch Seeder', seedBranches)
    await runSeeder('Quiz Seeder', seedQuizzes)
    await runSeeder('Announcement Seeder', seedAnnouncements)
    
    // Print final summary
    console.log('\n🎉 Database seeding completed successfully!')
    console.log('\n📋 Sample accounts created:')
    console.log('👑 Admin: admin@profman.com / admin123')
    console.log('👑 Admin: admin2@profman.com / admin123')
    console.log('👨‍🏫 Professors: prof.smith@university.edu, prof.davis@university.edu, etc. / prof123')
    console.log('👨‍🎓 Students: student1@university.edu, student2@university.edu, etc. / student numbers')
    
    console.log('\n📚 Sample data created:')
    console.log('- 20+ subjects across different categories')
    console.log('- Multiple branches with enrolled students')
    console.log('- Quizzes with various question types and realistic scores')
    console.log('- Quiz attempts with intelligent answer generation')
    console.log('- Announcements for each branch')
    
    console.log('\n🔗 Access the application:')
    console.log('- Frontend: http://localhost:5173')
    console.log('- Backend API: http://localhost:5000')
    console.log('- Health check: http://localhost:5000/health')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Run seeding
main()
