import { getUid } from "./firebase.js";
import { addEvents } from "./firestore.js";

let calendar;
let todayDateTasks = []; // Export orange events
let todayDateEvents = []; // Export blue events
let exportDate = "";

function getTodayDateTasksAndEvents() {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  todayDateTasks = [];
  todayDateEvents = [];

  calendar.getEvents().forEach(event => {
    const eventStart = new Date(event.startStr);
    const eventEnd = event.end ? new Date(event.endStr) : eventStart;

    // Check if the event is for today
    if (eventStart.toISOString().split('T')[0] === today || (eventEnd.toISOString().split('T')[0] === today)) {
      const color = event.backgroundColor || event.extendedProps.color || "blue"; // Default to blue
      if (color === "orange") {
        todayDateTasks.push(event);
      } else if (color === "blue") {
        todayDateEvents.push(event);
      }
    }
  });

  console.log("Default Orange Events (todayDateTasks):", todayDateTasks.map(e => e.title));
  console.log("Default Blue Events (todayDateEvents):", todayDateEvents.map(e => e.title));

  // Dispatch custom event to update the lists with today's tasks and events
  document.dispatchEvent(new CustomEvent('dayUpdated', {
    detail: {
      tasks: todayDateTasks,
      events: todayDateEvents
    }
  }));
}

document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    height: 700,
    eventClick: function (info) {
      const clickedEventTitle = info.event.title;

      // Filter events and hide those that don't match the clicked event's title
      calendar.getEvents().forEach(function (event) {
        if (event.title.includes(clickedEventTitle.split(" ")[0]) === false || clickedEventTitle.includes(event.title.split(" ")[0]) === false) {
          event.setProp('display', 'none'); // Hide events that don't match
        } else {
          event.setProp('display', 'block'); // Show matching events
        }
      });
    },
    dateClick: function (info) {
      const clickedDate = new Date(info.dateStr);

      // Clear previous tasks and events
      todayDateTasks = [];
      todayDateEvents = [];

      calendar.getEvents().forEach(event => {
        const eventStart = new Date(event.startStr);
        const eventEnd = event.end ? new Date(event.endStr) : eventStart;

        // Check if the clicked date falls within the event's date range
        if (clickedDate >= eventStart && clickedDate <= eventEnd) {
          const color = event.backgroundColor || event.extendedProps.color || "blue"; // Default to blue
          if (color === "orange") {
            todayDateTasks.push(event);
          } else if (color === "blue") {
            todayDateEvents.push(event);
          }
        }
      });

      console.log("Orange Events (todayDateTasks):", todayDateTasks.map(e => e.title));
      console.log("Blue Events (todayDateEvents):", todayDateEvents.map(e => e.title));

      // Dispatch custom event to update the lists
      document.dispatchEvent(new CustomEvent('dayUpdated', {
        detail: {
          tasks: todayDateTasks,
          events: todayDateEvents
        }
      }));
    }
  });

  // Render the calendar
  calendar.render();

  // Populate the lists with today's tasks and events
  getTodayDateTasksAndEvents();

  // Add tasks and events to the lists
  const taskList = document.getElementById("task-list");
  const eventList = document.getElementById("event-list");

  todayDateTasks.forEach(task => {
    const taskItem = document.createElement("li");
    taskItem.textContent = task.title;
    taskList.appendChild(taskItem);
  });

  todayDateEvents.forEach(event => {
    const eventItem = document.createElement("li");
    eventItem.textContent = event.title;
    eventList.appendChild(eventItem);
  });

  document.addEventListener('click', function (event) {
    if (!calendarEl.contains(event.target)) {
      // If the click is outside the calendar, reset the display of all events
      calendar.getEvents().forEach(function (event) {
        event.setProp('display', 'block'); // Show all events again
      });
    }
  });
});


export function addEventToCalendar(title, date) {
  if (calendar) {
    console.log("Calendar function working");
    calendar.addEvent({ title: title, start: date });
  } else {
    console.error("Calendar is not initialized");
  }
}

export function addTaskToCalendar(title, startDate, endDate, color = "orange") {
  if (calendar) {
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
    const formattedEndDate = adjustedEndDate.toISOString().split('T')[0];

    console.log("Adding Task:", { title, startDate, endDate: formattedEndDate });
    calendar.addEvent({
      title,
      start: startDate,
      end: formattedEndDate,
      color,
      backgroundColor: color, // Ensure the color is properly set
    });
  } else {
    console.error("Calendar is not initialized");
  }
}

// Exporting functions and variables
export { todayDateTasks, todayDateEvents,  };
