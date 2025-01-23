import { getUid } from "./firebase.js";
import { addEvents, addTasks, removeEvent, removeTask } from "./firestore.js";

const currentPage = window.location.pathname.split('/').pop();
const links = document.querySelectorAll('.header-link a');
links.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
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



export function createEventWidget(title, date, diff, containerId) {
    const displayEmptyText = document.getElementById('event-empty-container');
    displayEmptyText.classList.remove('show');
    displayEmptyText.classList.add('hide');

    
    const template = document.getElementById('event-template');
    const widgetClone = template.content.cloneNode(true);
    const container = document.getElementById(containerId);

    widgetClone.querySelector('.event-title').textContent = title;
    widgetClone.querySelector('.event-date').textContent = "Date: " + date;
    widgetClone.querySelector('.event-diff').textContent = "Difficulty: " + diff;
    const completeButton = widgetClone.querySelector('button');
    completeButton.textContent = "Mark as complete";
    console.log(completeButton);

    completeButton.addEventListener('click', (event) => {
        const widget = event.target.closest('.event-widget-container');
        if (widget) {
            widget.remove();
            getUid()
            .then(async uid => {
                showLoadingSpinner();
                await removeEvent(uid, title, date, diff);
                hideLoadingSpinner();
                
            })
            .catch(error => {
                console.log(error);  // Handle the error (UID not available yet)
            });
            showNotification("Successfully completed task!")
            if (container.children.length == 2){/*imp: if adding more children to 'task-container', increase it to (current amount + n additonal children )*/
                console.log('yay')
                displayEmptyText.classList.remove('hide');
                displayEmptyText.classList.add('show');
            }
            else{
                displayEmptyText.classList.remove('show');
                displayEmptyText.classList.add('hide');
            }
        }
    });
    if (container) {
        container.appendChild(widgetClone);
    }
}

function formatDate(str){
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const [year, month, day] = str.split('-');

    const monthInt = parseInt(month,10);
    return String(months[monthInt-1] + " " + day + " " + year);


}

const addTaskButton = document.getElementById("addTasks");

if (addTaskButton){
    addTaskButton.addEventListener('click', (event) =>{
        console.log('works');
        const popup1 = document.getElementById("popup1")
        const taskForm1 = document.getElementById('form1');
        popup1.classList.remove('hidden');


        taskForm1.addEventListener('submit', submitForm1);//calls below function
        const closePopupButton1 = document.getElementById("closePopup1");

        closePopupButton1.addEventListener('click', () => {//for the cancel button
            popup1.classList.add('hidden');
        });
    });
}

async function submitForm1(e) {//second option
    const popup1 = document.getElementById("popup1")
    const taskForm1 = document.getElementById('form1');
    e.preventDefault();
    const taskName = document.getElementById('task-name').value;
    const taskPriority = document.getElementById('dropdown-task-priority').value;
    const taskTime = document.getElementById('task-time').value;
    const taskDue = document.getElementById('task-dueDate').value;
    console.log(`name : ${taskName}, taskTime : ${taskTime}, taskDue : ${taskDue}, taskPriority : ${taskPriority}`);
    createTaskWidget(taskName, taskPriority, taskTime, formatDate(taskDue), "task-container");
    getUid()
    .then(async uid => {
        console.log("User UID: " + uid);
        showLoadingSpinner();
        await addTasks(uid, taskName, taskPriority, taskTime, taskDue);
        hideLoadingSpinner();
        
    })
    .catch(error => {
        console.log(error);  // Handle the error (UID not available yet)
    });
    
    showNotification(`Task added succesfully added successfully!`);
    popup1.classList.add('hidden');
    taskForm1.reset();
}


const addEventButton = document.getElementById("addEvents");

if (addEventButton){
    addEventButton.addEventListener('click', (event) =>{
        console.log('works2');
        const popup1 = document.getElementById("popup2")
        const taskForm1 = document.getElementById('form2');
        popup1.classList.remove('hidden');


        taskForm1.addEventListener('submit', submitForm2);//calls below function
        const closePopupButton1 = document.getElementById("closePopup2");

        closePopupButton1.addEventListener('click', () => {//for the cancel button
            popup1.classList.add('hidden');
        });
    });
}
function submitForm2(e) {//second option
    const popup1 = document.getElementById("popup2")
    const taskForm1 = document.getElementById('form2');
    e.preventDefault();
    const eventName = document.getElementById('event-name').value;
    const eventDate = document.getElementById('event-date').value;
    const eventDiff = document.getElementById('event-diff').value;
    console.log(`name : ${eventName}, taskDate : ${eventDate}, eventdiff: ${eventDiff}`);
    createEventWidget(eventName, formatDate(eventDate), eventDiff, "event-container");

    getUid()
    .then(async uid  => {
        console.log("User UID: " + uid);
        showLoadingSpinner();
        await addEvents(uid, eventName, eventDate, eventDiff);
        hideLoadingSpinner();
        
    })
    .catch(error => {
        console.log(error);  // Handle the error (UID not available yet)
    });
    
    showNotification(`Event added succesfully added successfully!`);
    popup1.classList.add('hidden');
    taskForm1.reset();
}

export function createTaskWidget(title, priority, time, due, containerId) {
    
}