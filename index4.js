import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getUid } from "./firebase.js";
import { getFreeHoursDay, setFreeHoursDay } from "./firestore.js";

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById("profile-picture").src = user.photoURL || "https://via.placeholder.com/150";
        document.getElementById("user-name").textContent = user.displayName || "Anonymous";
        document.getElementById("user-email").textContent = user.email || "No email";
    } else {
        window.location.href = "login.html"; 
    }
});

const loadingSpinner = document.getElementById('loading-spinner');


function showLoadingSpinner() {
  loadingSpinner.classList.remove('hide');
  loadingSpinner.classList.add('show');
}


function hideLoadingSpinner() {
  loadingSpinner.classList.remove('show');
  loadingSpinner.classList.add('hide');
}

function generateFormFields() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const formFields = document.getElementById('form-fields');

    days.forEach(day => {
        const fieldContainer = document.createElement('div');
        fieldContainer.style.marginBottom = '10px';

        const label = document.createElement('label');
        label.textContent = `Free hours on ${day}:  `;
        label.setAttribute('for', day.toLowerCase());

        const label2 = document.createElement('label');
        getUid()
            .then(async uid => {
                showLoadingSpinner();
                const hours = await getFreeHoursDay(uid, day.toLowerCase());
                hideLoadingSpinner();
                label2.textContent = hours;

            })
            .catch(error => {
                console.log(error);
            });
        label2.setAttribute("contenteditable", "true");
        const label3 = document.createElement('label');
        label3.textContent = " hours ";
        const penIcon = document.createElement('i');
        penIcon.className = "fas fa-pen";
        penIcon.id = "pen-icon";

        label2.addEventListener('input', function() {
            getUid()
            .then(async uid => {
                await setFreeHoursDay(uid, day.toLowerCase(), label2.textContent);

            })
            .catch(error => {
                console.log(error);
            });

            console.log("Text has changed:", label2.textContent);
        });

        fieldContainer.appendChild(label);
        fieldContainer.appendChild(label2);
        fieldContainer.appendChild(label3);
        fieldContainer.appendChild(penIcon);
        formFields.appendChild(fieldContainer);
    });
}

if (window.location.href.includes("profile")){
    generateFormFields();
}