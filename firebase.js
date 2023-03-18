// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDReaPg6YIyuFqs9qqvBtt43YIrza0su1U",
    authDomain: "villains-quiz-app.firebaseapp.com",
    databaseURL: "https://villains-quiz-app-default-rtdb.firebaseio.com",
    projectId: "villains-quiz-app",
    storageBucket: "villains-quiz-app.appspot.com",
    messagingSenderId: "1059707927188",
    appId: "1:1059707927188:web:2768ce0066e35a8bee9281"
};
// Initialize Firebase

const firebaseInfo = initializeApp(firebaseConfig);

export default firebaseInfo;
