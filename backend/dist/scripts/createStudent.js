"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../utils/firebase");
const userService_1 = require("../services/userService");
async function createStudentUser() {
    try {
        console.log('🔥 Initializing Firebase...');
        (0, firebase_1.initializeFirebase)();
        const db = (0, firebase_1.getFirestore)();
        console.log('🎓 Creating student user...');
        const userService = new userService_1.UserService();
        const studentData = {
            email: 'student@university.edu',
            password: '2024001',
            displayName: 'John Student',
            role: 'student',
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
    }
    catch (error) {
        console.error('❌ Error creating student:', error);
    }
}
createStudentUser().then(() => {
    process.exit(0);
}).catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
//# sourceMappingURL=createStudent.js.map