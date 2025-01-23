import { getUid } from "./firebase.js";
import { dashboardTasks, dashboardEvents, addFreeHoursToDb, freeHoursExist, addEvents, loadTasksToCalendar } from "./firestore.js";
import {addEventToCalendar, todayDateTasks, todayDateEvents} from "./calendar.js";


//function to add elements to any list
function addToList(str, elementId){
    console.error(str,elementId);
    const taskList = document.getElementById(elementId);
    console.log(`taskList : ${taskList}`);
    const newTask = document.createElement('li');
    console.log(`taskList : ${newTask}`);
    newTask.textContent = `${str}`;
    taskList.appendChild(newTask);
}
const loadingSpinner = document.getElementById('loading-spinner');


function showLoadingSpinner() {
  loadingSpinner.classList.remove('hide');
  loadingSpinner.classList.add('show');
}


function hideLoadingSpinner() {
  loadingSpinner.classList.remove('show');
  loadingSpinner.classList.add('hide');
}


getUid()
.then(async uid => {
    showLoadingSpinner();
    let docIdList = await dashboardTasks(uid);
    hideLoadingSpinner();
    console.error("docidlist: " + docIdList);
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
const closePopupButton1 = document.getElementById('closePopup1');
const closePopupButton2 = document.getElementById('closePopup2');
const taskForm1 = document.getElementById('eventForm1');
const taskForm2 = document.getElementById('eventForm2');

//checks which option is selected
dropdownMenu.addEventListener('change', () => {
    const selectedValue = dropdownMenu.value;

    //prevents duplicate listenings causing other errors
    taskForm1.removeEventListener('submit', submitForm1);
    taskForm2.removeEventListener('submit', submitForm2);

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
});

//function used for clean code
function submitForm1(e) {//first option
    e.preventDefault();
    const eventName = document.getElementById('eventName').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventDiff = document.getElementById('eventDiff').value;

    console.log(`Event Added: ${eventName}, Date: ${eventDate}`);
    getUid()
    .then(uid => {
        console.log("User UID: " + uid);
        addEvents(uid, eventName, eventDate, eventDiff);
        addToList(eventName, "event-list");
        addEventToCalendar(eventName, eventDate);

        
    })
    .catch(error => {
        console.log(error);  
    });

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


function showPopup() {
    getUid()
    .then(async uid => {

        if (!await freeHoursExist(uid)){
            document.getElementById('popup-free-time').style.display = 'block';
            generateFormFields();
        }
    })
    .catch(error => {
        console.log(error); 
    });
}

//instead of creating 7 elemnts in html, we create it from java
function generateFormFields() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const formFields = document.getElementById('form-fields');

    days.forEach(day => {
        const fieldContainer = document.createElement('div');
        fieldContainer.style.marginBottom = '10px';

        const label = document.createElement('label');
        label.textContent = `Free hours on ${day}:`;
        label.setAttribute('for', day.toLowerCase());

        const input = document.createElement('input');
        input.type = 'number';
        input.id = day.toLowerCase();
        input.name = day.toLowerCase();
        input.min = 0;
        input.max = 24;
        input.placeholder = '0-24';
        input.style.width = '100%';

        fieldContainer.appendChild(label);
        fieldContainer.appendChild(input);
        formFields.appendChild(fieldContainer);
    });
}


document.getElementById('free-hours-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const freeHours = {};

    formData.forEach((value, key) => {
        freeHours[key] = parseInt(value,10);
    });

    console.log('Free hours:', freeHours);
    alert('Thank you for submitting your free hours!');
    document.getElementById('popup-free-time').style.display = 'none';
    getUid()
    .then(async uid => {
        await addFreeHoursToDb(uid, freeHours);
        await freeHoursExist(uid);
    })
    .catch(error => {
        console.log(error); 
    });
});


if (window.location.href.includes("dashboard")){
    console.error("todayDateTasks:", todayDateTasks);
    console.error("todayDateEvents:", todayDateEvents);

    for (let i = 0; i < todayDateTasks.length; i++){
        addToList(todayDateTasks[i], "task-list");
    }
    for (let i = 0; i < todayDateEvents.length; i++){
        addToList(todayDateEvents[i], "event-list");
    }
    getUid()
    .then(async uid => {
        await loadTasksToCalendar(uid);
    })
    .catch(error => {
        console.log(error); 
    });
    showPopup();
}

function updateTodayDateTasks(newTasks) {
    todayDateTasks = newTasks;
    // Dispatch custom event when tasks are updated
    document.dispatchEvent(new CustomEvent('dayUpdated', {
        detail: {
            tasks: todayDateTasks,
            events: todayDateEvents
        }
    }));
}

function updateTodayDateEvents(newEvents) {
    todayDateEvents = newEvents;
    // Dispatch custom event when events are updated
    document.dispatchEvent(new CustomEvent('dayUpdated', {
        detail: {
            tasks: todayDateTasks,
            events: todayDateEvents
        }
    }));
}

// Function to simulate a date click which updates tasks and events
function dateClick(newTasks, newEvents) {
    updateTodayDateTasks(newTasks);
    updateTodayDateEvents(newEvents);
}

/*
document.addEventListener('dayUpdated', (e) => {
    const { tasks, events } = e.detail;
  
    // Clear the current lists
    const taskList = document.getElementById("task-list");
    const eventList = document.getElementById("event-list");
    taskList.innerHTML = "";
    eventList.innerHTML = "";
  
    // Add new tasks and events to the lists
    tasks.forEach(task => addToList(task.title, "task-list"));
    events.forEach(event => addToList(event.title, "event-list"));
  });
  
// Exporting functions
export { todayDateTasks, todayDateEvents, dateClick };
*/

