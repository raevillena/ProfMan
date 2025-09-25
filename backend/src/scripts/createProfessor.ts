import { initializeFirebase, getFirestore } from '../utils/firebase';
import { UserService } from '../services/userService';
import { SubjectService } from '../services/subjectService';
import { BranchService } from '../services/branchService';

async function createProfessorUser() {
  try {
    console.log('🔥 Initializing Firebase...');
    initializeFirebase();
    const db = getFirestore();

    console.log('👨‍🏫 Creating professor user...');
    
    const userService = new UserService();
    const subjectService = new SubjectService();
    const branchService = new BranchService();

    // Create professor user
    const professorData = {
      email: 'prof@example.com',
      password: 'password123',
      displayName: 'Dr. John Smith',
      role: 'professor' as const,
      isActive: true,
    };

    const professor = await userService.createUser(professorData);
    console.log('✅ Professor user created:', professor.email);

    // Get available subjects
    const subjects = await subjectService.getActiveSubjects();
    console.log('📚 Available subjects:', subjects.length);

    if (subjects.length > 0) {
      // Create a sample branch for the professor
      const sampleSubject = subjects[0];
      if (sampleSubject) {
        const branchData = {
          subjectId: sampleSubject.id,
          professorId: professor.id,
          title: `${sampleSubject.title} - Fall 2024`,
          description: `This is a sample branch for ${sampleSubject.title} taught by ${professor.displayName}`,
        weekStructure: [
          {
            weekNumber: 1,
            title: 'Introduction',
            description: 'Course introduction and overview',
            resources: [],
            assignments: []
          },
          {
            weekNumber: 2,
            title: 'Fundamentals',
            description: 'Basic concepts and principles',
            resources: [],
            assignments: []
          }
        ]
      };

        const branch = await branchService.createBranch(branchData);
        console.log('✅ Sample branch created:', branch.title);
      }
    }

    console.log('🎉 Professor setup completed!');
    console.log('📋 Login credentials:');
    console.log('   Email: prof@example.com');
    console.log('   Password: password123');
    console.log('   Role: Professor');

  } catch (error) {
    console.error('❌ Error creating professor:', error);
  }
}

// Run the script
createProfessorUser().then(() => {
  process.exit(0);
}).catch((error: any) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
