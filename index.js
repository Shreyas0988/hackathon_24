import { getUid } from "./firebase.js";
import { dashboardTasks, dashboardEvents } from "./firestore.js";


//function to add elements to any list
function addToList(str, elementId){
    const taskList = document.getElementById(elementId);
    console.log(`taskList : ${taskList}`);
    const newTask = document.createElement('li');
    console.log(`taskList : ${newTask}`);
    newTask.textContent = `${str}`;
    taskList.appendChild(newTask);
}



getUid()
.then(async uid => {
    let docIdList = await dashboardTasks(uid);
    console.log("docidlist: " + docIdList);
    for (let i = 0; i < docIdList.length; i++){
        addToList(docIdList[i], "task-list");
    }

    const list = document.getElementById("task-list");
    const emptyList = document.getElementById("empty-task-list");
    emptyList.classList.remove('show');
    emptyList.classList.add('hide');
    if (list.getElementsByTagName("li").length == 1){
        emptyList.classList.remove('hide');
        emptyList.classList.add('show');
    }

    let docIdListEvent = await dashboardEvents(uid);
    console.log("docIdListEvent: " + docIdListEvent);
    for (let i = 0; i < docIdListEvent.length; i++){
        addToList(docIdListEvent[i], "event-list");
    }

    const list2 = document.getElementById("event-list");
    const emptyList2 = document.getElementById("empty-event-list");
    emptyList2.classList.remove('show');
    emptyList2.classList.add('hide');
    if (list2.getElementsByTagName("li").length == 1){
        emptyList2.classList.remove('hide');
        emptyList2.classList.add('show');
    }


    
})
.catch(error => {
    console.log(error); 
});


//check which link is active for the header
const currentPage = window.location.pathname.split('/').pop();
const links = document.querySelectorAll('.header-link a');
links.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});


//get all the objects using the ids of the popups
const dropdownMenu = document.getElementById('dropdown');
const popup1 = document.getElementById('popup1');
const popup2 = document.getElementById('popup2');
const popup3 = document.getElementById('popup3');
const closePopupButton1 = document.getElementById('closePopup1');
const closePopupButton2 = document.getElementById('closePopup2');
const closePopupButton3 = document.getElementById('closePopup3');
const taskForm1 = document.getElementById('eventForm1');
const taskForm2 = document.getElementById('eventForm2');
const taskForm3 = document.getElementById('eventForm3');

//checks which option is selected
dropdownMenu.addEventListener('change', () => {
    const selectedValue = dropdownMenu.value;

    //prevents duplicate listenings causing other errors
    taskForm1.removeEventListener('submit', submitForm1);
    taskForm2.removeEventListener('submit', submitForm2);
    taskForm3.removeEventListener('submit', submitForm3);

    //option1 popup
    if (selectedValue === 'option1') {
        popup1.classList.remove('hidden');
        dropdownMenu.value = '';

        taskForm1.addEventListener('submit', submitForm1);//calls below function

        closePopupButton1.addEventListener('click', () => {//for the cancel button
            popup1.classList.add('hidden');
        });
    }

    //option2 popup
    else if (selectedValue === 'option2') {
        popup2.classList.remove('hidden');
        dropdownMenu.value = '';

        taskForm2.addEventListener('submit', submitForm2);

        closePopupButton2.addEventListener('click', () => {
            popup2.classList.add('hidden');
        });
    }

    //option3 popup
    else if (selectedValue === 'option3') {
        popup3.classList.remove('hidden');
        dropdownMenu.value = '';

        taskForm3.addEventListener('submit', submitForm3);

        closePopupButton3.addEventListener('click', () => {
            popup3.classList.add('hidden');
        });
    }
});

//function used for clean code
function submitForm1(e) {//first option
    e.preventDefault();
    const eventName = document.getElementById('eventName').value;
    const eventDate = document.getElementById('eventDate').value;
    //const eventDiff = document.getElementById('eventDiff').value;

    console.log(`Event Added: ${eventName}, Date: ${eventDate}`);

    showNotification(`Event "${eventName}" added successfully!`);
    popup1.classList.add('hidden');
    
    taskForm1.reset();
    
}

function submitForm2(e) {//second option
    e.preventDefault();
    const link = document.getElementById('addLink').value;
    console.log(`Link Added: ${link}`);
    
    showNotification(`Calendar link added successfully!`);
    popup2.classList.add('hidden');
    taskForm2.reset();
}

function submitForm3(e) {//third option
    e.preventDefault();
    const studyhabit = document.getElementById('studyHabit').value;

    console.log(`Study Habit Added: ${studyhabit}`);

    showNotification(`Study Habit Added: ${studyhabit}`);
    popup3.classList.add('hidden');
    taskForm3.reset();
}

function showNotification(message, duration = 3000) {
    const notificationContainer = document.getElementById('notification-container');
    notificationContainer.textContent = message;

    //stops hiding it and shows
    notificationContainer.classList.remove('hide');
    notificationContainer.classList.add('show');

    notificationContainer.style.right = '10px';

    setTimeout(() => {
        notificationContainer.classList.remove('show');
        notificationContainer.classList.add('hide');

        setTimeout(() => {
            notificationContainer.style.right = '-300px';
        }, 500);

    }, duration);
}
