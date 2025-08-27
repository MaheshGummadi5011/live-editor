import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyD1J8_d7-77fPyMBpAr-gJXKfzkHOpHVco',
  authDomain: 'live-editor-13c1c.firebaseapp.com',
  projectId: 'live-editor-13c1c',
  storageBucket: 'live-editor-13c1c.firebasestorage.app',
  messagingSenderId: '764348608875',
  appId: '1:764348608875:web:a127250ec6639037775c2e',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);