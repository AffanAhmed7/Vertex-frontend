import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDHgCIHzxc4spa9RsCgL4Mmro4dDGkTGFw",
    authDomain: "vertex--e-commerce.firebaseapp.com",
    projectId: "vertex--e-commerce",
    storageBucket: "vertex--e-commerce.firebasestorage.app",
    messagingSenderId: "49462780310",
    appId: "1:49462780310:web:818407f0b3faa12a29bdb7",
    measurementId: "G-L2CTL50ZMC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
