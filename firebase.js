
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { uidExists, setupNewUser, readAllEvents, readAllTasks, readAllEventsCalendar } from "./firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyCZ8pJNE9ICoKR9dTHoup2-xo2b5VLt6fo",
authDomain: "schedulify-7e110.firebaseapp.com",
projectId: "schedulify-7e110",
storageBucket: "schedulify-7e110.appspot.com",
messagingSenderId: "181048376033",
appId: "1:181048376033:web:78a25c4c4cf6920ce895a0",
measurementId: "G-LWW7DBTRJ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();


const userSignIn = async() => {
    console.log("sign in pressed");
    signInWithPopup(auth, provider)
    .then((result) => {
        const user = result.user;
        console.log(user);
        window.location.href = "dashboard.html";
    }).catch((error) => {
        console.log("error signing in: " + error);
    })
}

const userSignOut = async() => {
    console.log("sign out pressed");
    signOut(auth)
    .then(() => {
        window.location.href = "index.html"
    }).catch((error) =>{
        console.log(error);
    })
}
document.addEventListener("DOMContentLoaded", () => {
    const signInButton = document.getElementById("google-login-button");
    const signOutButton = document.getElementById("google-logout-button");

    console.log(signInButton);
    if (signInButton) signInButton.addEventListener("click", userSignIn);
    if (signOutButton) signOutButton.addEventListener("click", userSignOut);
});

let currentUserUid = null; // Variable to store the UID globally

onAuthStateChanged(auth, async (user) => {
    
    if (user){//if user is signed in

        console.log("you have signed in");
        console.log(user.uid);
        currentUserUid = user.uid;  // Store the UID in a global variable
        if (window.location.href.includes('task')){
            await readAllEvents(user.uid);
            await readAllTasks(user.uid);
        }
        if (window.location.href.includes('dash')){
            await readAllEventsCalendar(user.uid);
        }
        console.log('uid exists in firestore databse: ' + await uidExists(user));
        await setupNewUser(await uidExists(user), user.uid);
        if (window.location.pathname.includes("index")){
            window.location.href = 'dashboard.html'
        }
    }else{//if they arent signed in
        console.log("you have NOT signed in");
        if (window.location.pathname.includes('index') == false){
            window.location.href = "index.html";
        }
    }
})
export async function getUid() {
    const user = auth.currentUser;
    if (user) {
        return user.uid;
    } else {
        // If the user is not signed in, wait for `onAuthStateChanged`
        return new Promise((resolve, reject) => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    resolve(user.uid);
                } else {
                    reject("User not signed in");
                }
            });
        });
    }
}
