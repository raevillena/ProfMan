"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../utils/firebase");
(0, firebase_1.initializeFirebase)();
const db = (0, firebase_1.getFirestore)();
async function clearDatabase() {
    console.log('🧹 Clearing existing data...');
    const collections = ['users', 'subjects', 'branches', 'quizzes', 'quizAttempts', 'announcements'];
    for (const collectionName of collections) {
        try {
            const snapshot = await db.collection(collectionName).get();
            const batch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });
            if (snapshot.docs.length > 0) {
                await batch.commit();
                console.log(`✅ Cleared ${snapshot.docs.length} documents from ${collectionName}`);
            }
        }
        catch (error) {
            console.error(`❌ Error clearing ${collectionName}:`, error);
        }
    }
}
async function runSeeder(seederName, seederFunction) {
    console.log(`\n🚀 Running ${seederName}...`);
    try {
        await seederFunction();
        console.log(`✅ ${seederName} completed successfully!`);
    }
    catch (error) {
        console.error(`❌ ${seederName} failed:`, error);
        throw error;
    }
}
async function main() {
    try {
        console.log('🌱 Starting comprehensive database seeding...');
        console.log('This will clear all existing data and create fresh sample data.');
        console.log('⚠️  WARNING: This will delete all existing data!');
        await clearDatabase();
        console.log('\n📚 Running individual seeders...');
        const { seedUsers } = await Promise.resolve().then(() => __importStar(require('./seedUsers')));
        const { seedSubjects } = await Promise.resolve().then(() => __importStar(require('./seedSubjects')));
        const { seedBranches } = await Promise.resolve().then(() => __importStar(require('./seedBranches')));
        const { seedQuizzes } = await Promise.resolve().then(() => __importStar(require('./seedQuizzes')));
        const { seedAnnouncements } = await Promise.resolve().then(() => __importStar(require('./seedAnnouncements')));
        await runSeeder('User Seeder', seedUsers);
        await runSeeder('Subject Seeder', seedSubjects);
        await runSeeder('Branch Seeder', seedBranches);
        await runSeeder('Quiz Seeder', seedQuizzes);
        await runSeeder('Announcement Seeder', seedAnnouncements);
        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📋 Sample accounts created:');
        console.log('👑 Admin: admin@profman.com / admin123');
        console.log('👑 Admin: admin2@profman.com / admin123');
        console.log('👨‍🏫 Professors: prof.smith@university.edu, prof.davis@university.edu, etc. / prof123');
        console.log('👨‍🎓 Students: student1@university.edu, student2@university.edu, etc. / student numbers');
        console.log('\n📚 Sample data created:');
        console.log('- 20+ subjects across different categories');
        console.log('- Multiple branches with enrolled students');
        console.log('- Quizzes with various question types and realistic scores');
        console.log('- Quiz attempts with intelligent answer generation');
        console.log('- Announcements for each branch');
        console.log('\n🔗 Access the application:');
        console.log('- Frontend: http://localhost:5173');
        console.log('- Backend API: http://localhost:5000');
        console.log('- Health check: http://localhost:5000/health');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=seedAll.js.map