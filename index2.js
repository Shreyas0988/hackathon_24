//check which link is active for the header
const currentPage = window.location.pathname.split('/').pop();
const links = document.querySelectorAll('.header-link a');
links.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});

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

function createTaskWidget(title, priority, time, due, containerId) {
    const displayEmptyText = document.getElementById('empty-container');
    displayEmptyText.classList.remove('show');
    displayEmptyText.classList.add('hide');

    
    const template = document.getElementById('task-template');
    const widgetClone = template.content.cloneNode(true);
    const container = document.getElementById(containerId);

    widgetClone.querySelector('.task-title').textContent = title;
    widgetClone.querySelector('.task-priority').textContent = "Priority level: " + priority;
    widgetClone.querySelector('.task-time').textContent = "Time to complete: " + time + " hours";
    widgetClone.querySelector('.task-due').textContent = "Task due: " + due;
    const completeButton = widgetClone.querySelector('button');
    completeButton.textContent = "Mark as complete";

    completeButton.addEventListener('click', (event) => {
        const widget = event.target.closest('.widget-container');
        if (widget) {
            widget.remove();
            showNotification("Successfully completed task!")
            if (container.children.length == 2){/*imp: if adding more children to 'task-container', increase it to (n additonal children + current amount)*/
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

//test cases
for (let i = 1; i <= 6; i++) {
    createTaskWidget(`Task ${i}`, "high", i, `January 08 2025`, "task-container");
}


function createEventWidget(title, date, containerId) {
    const displayEmptyText = document.getElementById('event-empty-container');
    displayEmptyText.classList.remove('show');
    displayEmptyText.classList.add('hide');

    
    const template = document.getElementById('event-template');
    const widgetClone = template.content.cloneNode(true);
    const container = document.getElementById(containerId);

    widgetClone.querySelector('.event-title').textContent = title;
    widgetClone.querySelector('.event-date').textContent = "Date: " + date;
    const completeButton = widgetClone.querySelector('button');
    completeButton.textContent = "Mark as complete";
    console.log(completeButton);

    completeButton.addEventListener('click', (event) => {
        const widget = event.target.closest('.event-widget-container');
        if (widget) {
            widget.remove();
            showNotification("Successfully completed task!")
            if (container.children.length == 2){/*imp: if adding more children to 'task-container', increase it to (n additonal children + current amount)*/
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

for (let i = 1; i <= 6; i++) {
    createEventWidget(`Event ${i}`, `January 08 2025`, "event-container");
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

function submitForm1(e) {//second option
    const popup1 = document.getElementById("popup1")
    const taskForm1 = document.getElementById('form1');
    e.preventDefault();
    const taskName = document.getElementById('task-name').value;
    const taskPriority = document.getElementById('dropdown-task-priority').value;
    const taskTime = document.getElementById('task-time').value;
    const taskDue = document.getElementById('task-dueDate').value;
    console.log(`name : ${taskName}, taskTime : ${taskTime}, taskDue : ${taskDue}, taskPriority : ${taskPriority}`);
    createTaskWidget(taskName, taskPriority, taskTime, formatDate(taskDue), "task-container");
    
    showNotification(`Task added succesfully added successfully!`);
    popup1.classList.add('hidden');
    taskForm1.reset();
}


const addEventButton = document.getElementById("addEvents");
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
function submitForm2(e) {//second option
    const popup1 = document.getElementById("popup2")
    const taskForm1 = document.getElementById('form2');
    e.preventDefault();
    const eventName = document.getElementById('event-name').value;
    const eventDate = document.getElementById('event-date').value;
    console.log(`name : ${eventName}, taskDate : ${eventDate}`);
    createEventWidget(eventName, formatDate(eventDate), "event-container");
    
    showNotification(`Event added succesfully added successfully!`);
    popup1.classList.add('hidden');
    taskForm1.reset();
}
