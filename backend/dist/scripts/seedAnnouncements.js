"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../utils/firebase");
(0, firebase_1.initializeFirebase)();
const db = (0, firebase_1.getFirestore)();
const announcementTemplates = [
    {
        message: 'Welcome to the new semester! Please review the course syllabus and familiarize yourself with the learning management system.',
        type: 'info',
        audience: 'all',
    },
    {
        message: 'Midterm exams will be held next week. Study materials and practice questions are now available in the resources section.',
        type: 'warning',
        audience: 'all',
    },
    {
        message: 'Assignment 3 deadline has been extended to Friday at 11:59 PM due to technical issues.',
        type: 'info',
        audience: 'all',
    },
    {
        message: 'Office hours are now available on Tuesdays and Thursdays from 2-4 PM. Please schedule appointments in advance.',
        type: 'info',
        audience: 'all',
    },
    {
        message: 'The final exam schedule has been posted. Please check your individual exam times and locations.',
        type: 'urgent',
        audience: 'all',
    },
    {
        message: 'Congratulations to all students who scored above 90% on the recent quiz! Keep up the excellent work.',
        type: 'success',
        audience: 'all',
    },
    {
        message: 'Reminder: All assignments must be submitted through the online portal. Email submissions will not be accepted.',
        type: 'warning',
        audience: 'all',
    },
    {
        message: 'The library has extended its hours during exam period. It will now be open until 2 AM on weekdays.',
        type: 'info',
        audience: 'all',
    },
    {
        message: 'Student feedback surveys are now available. Your input helps us improve the course for future semesters.',
        type: 'info',
        audience: 'students',
    },
    {
        message: 'Faculty meeting scheduled for next Monday at 3 PM. Please review the agenda and prepare your reports.',
        type: 'info',
        audience: 'professors',
    },
    {
        message: 'The university will be closed on Friday for a holiday. All assignments due that day should be submitted by Thursday.',
        type: 'warning',
        audience: 'all',
    },
    {
        message: 'New study groups have been formed for each subject. Check the discussion board for group meeting times.',
        type: 'info',
        audience: 'students',
    },
    {
        message: 'The computer lab will be unavailable this weekend for maintenance. Plan your work accordingly.',
        type: 'warning',
        audience: 'all',
    },
    {
        message: 'Guest lecture by industry expert scheduled for next Wednesday at 2 PM. Attendance is optional but recommended.',
        type: 'info',
        audience: 'all',
    },
    {
        message: 'Course evaluation forms are now available. Please take a few minutes to provide your feedback.',
        type: 'info',
        audience: 'students',
    },
];
async function seedAnnouncements() {
    console.log('🌱 Seeding announcements...');
    const branchesQuery = await db.collection('branches').get();
    if (branchesQuery.empty) {
        console.log('❌ No branches found, skipping announcements...');
        return;
    }
    const branches = branchesQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    let createdCount = 0;
    for (const branch of branches) {
        try {
            const existingAnnouncements = await db.collection('announcements').where('branchId', '==', branch.id).get();
            if (!existingAnnouncements.empty) {
                console.log(`Announcements for branch ${branch.title} already exist, skipping...`);
                continue;
            }
            const numAnnouncements = Math.floor(Math.random() * 4) + 3;
            for (let i = 0; i < numAnnouncements; i++) {
                const announcementRef = db.collection('announcements').doc();
                const now = new Date();
                const randomAnnouncement = announcementTemplates[Math.floor(Math.random() * announcementTemplates.length)];
                const customizedMessage = randomAnnouncement.message
                    .replace('the course', `the ${branch.title} course`)
                    .replace('this semester', 'this semester')
                    .replace('next week', 'next week');
                const announcement = {
                    id: announcementRef.id,
                    branchId: branch.id,
                    message: customizedMessage,
                    type: randomAnnouncement.type,
                    createdBy: branch.professorId,
                    audience: randomAnnouncement.audience,
                    createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
                };
                await announcementRef.set(announcement);
                console.log(`✅ Created announcement for branch ${branch.title}`);
                createdCount++;
            }
        }
        catch (error) {
            console.error(`❌ Error creating announcements for branch ${branch.id}:`, error);
        }
    }
    console.log(`\n📊 Announcement seeding summary:`);
    console.log(`- Created: ${createdCount} announcements`);
    console.log(`- Total processed: ${branches.length} branches`);
}
async function main() {
    try {
        console.log('🚀 Starting announcement seeding...');
        await seedAnnouncements();
        console.log('✅ Announcement seeding completed successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Announcement seeding failed:', error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=seedAnnouncements.js.map