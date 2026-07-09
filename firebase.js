// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const auth = getAuth();
window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
    'size': 'invisible',
    'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        onSignInSubmit();
    }
});
auth.languageCode = 'it';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAMHIYdFMNsPlo7MG2m5B9edMaoZmMzW0k",
    authDomain: "btwoc-cde10.firebaseapp.com",
    projectId: "btwoc-cde10",
    storageBucket: "btwoc-cde10.firebasestorage.app",
    messagingSenderId: "407470631584",
    appId: "1:407470631584:web:e4dde53fdebb964088f7c5",
    measurementId: "G-CV43ZJR1TY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);