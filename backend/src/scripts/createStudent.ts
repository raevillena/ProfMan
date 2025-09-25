import { initializeFirebase, getFirestore } from '../utils/firebase';
import { UserService } from '../services/userService';

async function createStudentUser() {
  try {
    console.log('🔥 Initializing Firebase...');
    initializeFirebase();
    const db = getFirestore();

    console.log('🎓 Creating student user...');
    
    const userService = new UserService();

    // Create student user
    const studentData = {
      email: 'student@university.edu',
      password: '2024001',
      displayName: 'John Student',
      role: 'student' as const,
      studentNumber: '2024001',
      isActive: true,
    };

    const student = await userService.createUser(studentData);
    console.log('✅ Student user created:', student.email);

    console.log('🎉 Student setup completed!');
    console.log('📋 Login credentials:');
    console.log('   Email: student@university.edu');
    console.log('   Password: 2024001');
    console.log('   Student Number: 2024001');
    console.log('   Role: Student');

  } catch (error) {
    console.error('❌ Error creating student:', error);
  }
}

// Run the script
createStudentUser().then(() => {
  process.exit(0);
}).catch((error: any) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
