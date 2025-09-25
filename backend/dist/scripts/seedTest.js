"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../utils/firebase");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
(0, firebase_1.initializeFirebase)();
const db = (0, firebase_1.getFirestore)();
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, 12);
}
async function seedTestData() {
    console.log('🧪 Seeding test data...');
    try {
        const adminRef = db.collection('users').doc();
        const now = new Date();
        const passwordHash = await hashPassword('test123');
        const admin = {
            id: adminRef.id,
            email: 'test@profman.com',
            passwordHash,
            displayName: 'Test Admin',
            role: 'admin',
            isActive: true,
            isDeleted: false,
            createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
            updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
        };
        await adminRef.set(admin);
        console.log('✅ Created test admin: test@profman.com / test123');
        const subjectRef = db.collection('subjects').doc();
        const subject = {
            id: subjectRef.id,
            code: 'TEST101',
            title: 'Test Subject',
            description: 'This is a test subject for development and testing purposes.',
            isReusable: true,
            createdBy: admin.id,
            createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
            updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
        };
        await subjectRef.set(subject);
        console.log('✅ Created test subject: TEST101');
        const branchRef = db.collection('branches').doc();
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
            createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
            updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
        };
        await branchRef.set(branch);
        console.log('✅ Created test branch');
        const quizRef = db.collection('quizzes').doc();
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
            createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
            updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
        };
        await quizRef.set(quiz);
        console.log('✅ Created test quiz');
        console.log('\n🎉 Test data seeding completed!');
        console.log('📋 Test account: test@profman.com / test123');
        console.log('🔗 Test the application with this account');
    }
    catch (error) {
        console.error('❌ Test seeding failed:', error);
        throw error;
    }
}
async function main() {
    try {
        console.log('🚀 Starting test data seeding...');
        await seedTestData();
        console.log('✅ Test seeding completed successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Test seeding failed:', error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=seedTest.js.map