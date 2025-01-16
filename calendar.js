import { getUid } from "./firebase.js";
import { addEvents } from "./firestore.js";

let calendar;

document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    height: 700,
    dateClick: function(info) {
      const title = prompt('Enter Event Title:');
      if (title) {
        calendar.addEvent({
          title: title,
          start: info.dateStr,
        });
        getUid()
        .then(uid => {
          addEvents(uid, title, info.dateStr);
          const taskList = document.getElementById("event-list");
          const newTask = document.createElement('li');
          newTask.textContent = `${title}`;
          taskList.appendChild(newTask);

            
        })
        .catch(error => {
            console.log(error);  
        });
      }
    },
  });
  calendar.render();
});

export function addEventToCalendar(title, date) {
  if (calendar) {
    console.log("Calendar function working");
    calendar.addEvent({ title: title, start: date});
  } else {
    console.error("Calendar is not initialized");
  }
}
