import admin from 'firebase-admin';
declare const initializeFirebase: () => void;
declare const getFirestore: () => admin.firestore.Firestore;
declare const getAuth: () => import("firebase-admin/lib/auth/auth").Auth;
export { initializeFirebase, getFirestore, getAuth };
//# sourceMappingURL=firebase.d.ts.map