import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDmHgfvbuS6xXUAQuiohFsCwN8BLo4oPDs',
  authDomain: 'chat-with-pdf-ai-dda76.firebaseapp.com',
  projectId: 'chat-with-pdf-ai-dda76',
  storageBucket: 'chat-with-pdf-ai-dda76.firebasestorage.app',
  messagingSenderId: '145223255808',
  appId: '1:145223255808:web:6cba8ec844b2f5982e15e5',
  measurementId: 'G-XQ96PGJZZY',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db = getFirestore(app);
const storage = getStorage(app);

export {db, storage};