import { getUid } from "./firebase.js";
import { sendMessageToDb, getAnswerFromDb } from "./firestore.js";

//check which link is active for the header
const currentPage = window.location.pathname.split('/').pop();
const links = document.querySelectorAll('.header-link a');
links.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});

sendButton = document.getElementById("sendButton");

sendButton.addEventListener("click", function() {
    const userInput = document.getElementById('userInput');
    const chatWindow = document.getElementById('chatWindow');

    if (userInput.value.trim() !== "") {
        const temp = userInput.value;
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.textContent = temp;
        chatWindow.appendChild(userMessage);

        getUid()
        .then(async uid => {
            await sendMessageToDb(uid, temp);


            const botMessage = document.createElement('div');
            botMessage.className = 'message bot-message';
            const message = await getAnswerFromDb(uid);
            botMessage.textContent = message;
            chatWindow.appendChild(botMessage);

            userInput.value = "";

            chatWindow.scrollTop = chatWindow.scrollHeight;
            
        })
        .catch(error => {
            console.log(error);  
        });
    }
});

