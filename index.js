//function to add tasks to the list
function addToList(str, elementId){
    const taskList = document.getElementById(elementId);
    console.log(`taskList : ${taskList}`);
    const newTask = document.createElement('li');
    console.log(`taskList : ${newTask}`);
    newTask.textContent = `${str}`;
    taskList.appendChild(newTask);
}

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
    const eventTimeStart = document.getElementById('eventTimeStart').value;
    const eventTimeEnd = document.getElementById('eventTimeEnd').value;

    console.log(`Event Added: ${eventName}, Date: ${eventDate}, Start time: ${eventTimeStart}, End time: ${eventTimeEnd}`);

    popup1.classList.add('hidden');
    taskForm1.reset();
}

function submitForm2(e) {//second option
    e.preventDefault();
    const link = document.getElementById('addLink').value;
    console.log(`Link Added: ${link}`);

    popup2.classList.add('hidden');
    taskForm2.reset();
}

function submitForm3(e) {//third option
    e.preventDefault();
    const taskName = document.getElementById('taskName').value;
    const taskDate = document.getElementById('taskDate').value;
    const taskTimeStart = document.getElementById('taskTimeStart').value;
    const taskTimeEnd = document.getElementById('taskTimeEnd').value;

    console.log(`Study Habit Added: ${taskName}, Date: ${taskDate}, Start time: ${taskTimeStart}, End time: ${taskTimeEnd}`);

    popup3.classList.add('hidden');
    taskForm3.reset();
}
