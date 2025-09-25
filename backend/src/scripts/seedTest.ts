import { initializeFirebase, getFirestore } from '../utils/firebase'
import bcrypt from 'bcryptjs'

// Initialize Firebase
initializeFirebase()

const db = getFirestore()

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

async function seedTestData() {
  console.log('🧪 Seeding test data...')
  
  try {
    // Create a test admin user
    const adminRef = db.collection('users').doc()
    const now = new Date()
    const passwordHash = await hashPassword('test123')
    
    const admin = {
      id: adminRef.id,
      email: 'test@profman.com',
      passwordHash,
      displayName: 'Test Admin',
      role: 'admin',
      isActive: true,
      isDeleted: false,
      createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
      updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
    }
    
    await adminRef.set(admin)
    console.log('✅ Created test admin: test@profman.com / test123')
    
    // Create a test subject
    const subjectRef = db.collection('subjects').doc()
    const subject = {
      id: subjectRef.id,
      code: 'TEST101',
      title: 'Test Subject',
      description: 'This is a test subject for development and testing purposes.',
      isReusable: true,
      createdBy: admin.id,
      createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
      updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
    }
    
    await subjectRef.set(subject)
    console.log('✅ Created test subject: TEST101')
    
    // Create a test branch
    const branchRef = db.collection('branches').doc()
    const branch = {
      id: branchRef.id,
      subjectId: subject.id,
      professorId: admin.id,
      title: 'Test Subject - Test Admin - Fall 2024',
      description: 'Test branch for development',
      weekStructure: [
        {
          weekNumber: 1,
          title: 'Test Week',
          description: 'This is a test week',
          contents: [
            {
              type: 'lecture',
              title: 'Test Lecture',
              description: 'This is a test lecture',
              isRequired: true,
            }
          ]
        }
      ],
      students: [],
      createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
      updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
    }
    
    await branchRef.set(branch)
    console.log('✅ Created test branch')
    
    // Create a test quiz
    const quizRef = db.collection('quizzes').doc()
    const quiz = {
      id: quizRef.id,
      branchId: branch.id,
      weekNumber: 1,
      title: 'Test Quiz',
      description: 'This is a test quiz',
      questions: [
        {
          id: 'q1',
          type: 'mcq',
          question: 'What is 2 + 2?',
          options: ['3', '4', '5', '6'],
          correctAnswer: '4',
          points: 10,
        }
      ],
      timeLimit: 10,
      autoGrade: true,
      totalPoints: 10,
      isActive: true,
      createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
      updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
    }
    
    await quizRef.set(quiz)
    console.log('✅ Created test quiz')
    
    console.log('\n🎉 Test data seeding completed!')
    console.log('📋 Test account: test@profman.com / test123')
    console.log('🔗 Test the application with this account')
    
  } catch (error) {
    console.error('❌ Test seeding failed:', error)
    throw error
  }
}

async function main() {
  try {
    console.log('🚀 Starting test data seeding...')
    await seedTestData()
    console.log('✅ Test seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Test seeding failed:', error)
    process.exit(1)
  }
}

// Run seeding
main()
