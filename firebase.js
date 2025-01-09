// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import {onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZ8pJNE9ICoKR9dTHoup2-xo2b5VLt6fo",
  authDomain: "schedulify-7e110.firebaseapp.com",
  projectId: "schedulify-7e110",
  storageBucket: "schedulify-7e110.firebasestorage.app",
  messagingSenderId: "181048376033",
  appId: "1:181048376033:web:78a25c4c4cf6920ce895a0",
  measurementId: "G-LWW7DBTRJ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();

const googleLogin = document.getElementById("google-login-button");

//checks if the user is currently logged in or not
onAuthStateChanged(auth, (user) => {
    if (user) {
        
        if (window.location.href.includes("index")){
            window.location.href = "dashboard.html";
        }
    } else {
        googleLogin.addEventListener("click", function () {
            signInWithPopup(auth, provider)
            .then((result) => {
                console.log('2');
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                console.log(user);

                window.location.href = "dashboard.html";
            }).catch((error) => {
                console.log("Error:", error); 
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
        });
    }
});


function logOutUser() {
    signOut(auth).then(() => {
        window.location.href = "index.html";   
    }).catch((error) => {
        console.error("Error signing out:", error);
    });
}
