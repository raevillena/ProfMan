"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../utils/firebase");
const userService_1 = require("../services/userService");
const subjectService_1 = require("../services/subjectService");
const branchService_1 = require("../services/branchService");
async function createProfessorUser() {
    try {
        console.log('🔥 Initializing Firebase...');
        (0, firebase_1.initializeFirebase)();
        const db = (0, firebase_1.getFirestore)();
        console.log('👨‍🏫 Creating professor user...');
        const userService = new userService_1.UserService();
        const subjectService = new subjectService_1.SubjectService();
        const branchService = new branchService_1.BranchService();
        const professorData = {
            email: 'prof@example.com',
            password: 'password123',
            displayName: 'Dr. John Smith',
            role: 'professor',
            isActive: true,
        };
        const professor = await userService.createUser(professorData);
        console.log('✅ Professor user created:', professor.email);
        const subjects = await subjectService.getActiveSubjects();
        console.log('📚 Available subjects:', subjects.length);
        if (subjects.length > 0) {
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
    }
    catch (error) {
        console.error('❌ Error creating professor:', error);
    }
}
createProfessorUser().then(() => {
    process.exit(0);
}).catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
//# sourceMappingURL=createProfessor.js.map