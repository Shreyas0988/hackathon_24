import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, doc, deleteDoc,getDoc, getDocs, query, where, setDoc, collection } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import {createTaskWidget, createEventWidget} from './index2.js';
import { addEventToCalendar, addTaskToCalendar } from "./calendar.js";

const firebaseConfig = {
    apiKey: "AIzaSyCZ8pJNE9ICoKR9dTHoup2-xo2b5VLt6fo",
    authDomain: "schedulify-7e110.firebaseapp.com",
    projectId: "schedulify-7e110",
    storageBucket: "schedulify-7e110.firebasestorage.app",
    messagingSenderId: "181048376033",
    appId: "1:181048376033:web:78a25c4c4cf6920ce895a0",
    measurementId: "G-LWW7DBTRJ6"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);//firestore databse
const auth = getAuth(app); 

// Now you can use auth and db
const user = auth.currentUser;

export async function uidExists(user){
    try {
        console.log('function running');
        const collectionRef = collection(db, "users");
        const querySnapshot = await getDocs(collectionRef);
        for (const doc of querySnapshot.docs) {
            console.log('doc id: ' + doc.id);
            if (doc.id === user.uid) {
                console.log('User UID found: ' + doc.id);
                return true;  // Return true if the document ID matches
            }
        }
        return false;
    } catch (error) {
        console.error("error getting documents of collection usrs: :", error);
    }
}

export async function setupNewUser(uidExists, uid){
    if (!uidExists){
        console.log("setupNewUser running");
        try {
            const docRef = doc(db, "users", uid);
            await setDoc(docRef, {}); //creates a new document with empty fields and its document id is the uid

            const subCollectionRef1 = collection(db, 'users', uid, 'events');//adds a subcollection called events
            const eventDocRef1 = doc(subCollectionRef1, 'event1');
            await setDoc(eventDocRef1, { name: 'Hackathon', date: '2025-01-23', diff : '5' });

            const subCollectionRef2 = collection(db, 'users', uid, 'tasks');//adds a subcollection called tasks
            const eventDocRef2 = doc(subCollectionRef2, 'task1');
            await setDoc(eventDocRef2, { name: 'Finish hackathon website', priority : "high", time : "4" , dueDate: '2025-01-23' });

            const subCollectionRef3 = collection(db, 'users', uid, 'calendar-links');//adds a subcollection called calendar-links
            const eventDocRef3 = doc(subCollectionRef3, 'link1');
            await setDoc(eventDocRef3, { name: 'https://sas.schoology.com/calendar/feed/ical/1723437730/ae9f9e555537af44e2e073d8d8394612/ical.ics'});



        } catch (error) {
            console.error("error adding document: ", error);
        }
    }

}

export async function addTasks(uid, taskName, taskPriority, taskTime, taskDate){
    try{
        const userDocRef = doc(db, 'users', uid);
        const subCollectionRef = collection(userDocRef, 'tasks');
        const querySnapshot = await getDocs(subCollectionRef);
        const taskSize = querySnapshot.size;

        const taskDocRef1 = doc(subCollectionRef, `task${taskSize+1}`);
        await setDoc(taskDocRef1, {name : taskName, dueDate : taskDate, priority:taskPriority, time:taskTime});
        console.log('done adding tasks');
    }catch(error){
        console.log("error adding task to db:" + error);
    }
}

export async function addEvents(uid, eventName, eventDate, eventDiff){
    try{
        const userDocRef = doc(db, 'users', uid);
        const subCollectionRef = collection(userDocRef, 'events');
        const querySnapshot = await getDocs(subCollectionRef);
        const eventSize = querySnapshot.size;

        const taskDocRef1 = doc(subCollectionRef, `event${eventSize+1}`);
        await setDoc(taskDocRef1, {name : eventName, date : eventDate, diff : eventDiff});
        console.log('done adding event');
    }catch(error){
        console.log("error adding task to db:" + error);
    }
}

export async function removeEvent(uid, eventName, eventDate, eventDiff){
    try {
        const parentDocRef = doc(db, "users", uid);
        const eventsRef = collection(parentDocRef, "events");
        const q = query(eventsRef, 
                        where("name", "==", eventName), 
                        where("date", "==", eventDate),
                        where("diff", "==", eventDiff));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          querySnapshot.forEach(async (doc) => {
            console.log("Found document ID:", doc.id); 
            await deleteDoc(doc.ref);
            console.log("Document deleted successfully");
          });
        } else {
          console.log("No matching event found, " + uid + ", " + eventName + ", " + eventDate + ", " + eventDiff);
        }
      } catch (error) {
        console.error("Error removing document: ", error);
      }
}

export async function removeTask(uid, taskName, taskPriority, taskTime, taskDate){
    try {
        const parentDocRef = doc(db, "users", uid);
        const tasksRef = collection(parentDocRef, "tasks");
        const q = query(tasksRef, 
                        where("name", "==", taskName), 
                        where("priority", "==", taskPriority),
                        where("time", "==", taskTime),
                        where("dueDate", "==", taskDate));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          querySnapshot.forEach(async (doc) => {
            console.log("Found document ID:", doc.id); 
            await deleteDoc(doc.ref);
            console.log("Document deleted successfully");
          });
        } else {
          console.log("No matching event found, " + uid + ", " + eventName + ", " + eventDate);
        }
      } catch (error) {
        console.error("Error removing document: ", error);
      }
}
export async function readAllTasks(uid){
    try {
        const tasksRef = collection(db, "users", uid, "tasks");
        const querySnapshot = await getDocs(tasksRef);

        querySnapshot.forEach((doc) => {
            const data = doc.data(); 
            console.log(data);
            createTaskWidget(data.name, data.priority, data.time, data.dueDate, "task-container")
        });
    } catch (error) {
        console.error("Error reading subcollection:", error);
    }
}

export async function readAllEvents(uid){
    try {
        const tasksRef = collection(db, "users", uid, "events");
        const querySnapshot = await getDocs(tasksRef);

        querySnapshot.forEach((doc) => {
            const data = doc.data(); 
            console.log(data);
            createEventWidget(data.name, data.date, data.diff, "event-container");
        });
    } catch (error) {
        console.error("Error reading subcollection:", error);
    }
}

export async function dashboardTasks(uid) {
  try {
      const parentDocRef = doc(db, "users", uid);
      const tasksRef = collection(parentDocRef, "tasks");

      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      let docIdList = [];

      const querySnapshot = await getDocs(tasksRef);

      if (!querySnapshot.empty) {
          console.log(`Number of tasks found for UID ${uid}: ${querySnapshot.size}`);
          for (const document of querySnapshot.docs) {
              const taskData = document.data();

              if (Array.isArray(taskData.daily_schedule)) {
                  const hasToday = taskData.daily_schedule.some(schedule => schedule.date === formattedDate);

                  if (hasToday) {
                      docIdList.push(document.id); // Document ID is the name of the task
                      console.log("Found matching task with ID:", document.id);
                  }
              }
          }
      } else {
          console.log("No tasks found for UID:", uid);
      }

      return docIdList;

  } catch (error) {
      console.error("Error fetching dashboard tasks: ", error);
      return [];
  }
}

export async function dashboardEvents(uid) {
  try {
    const parentDocRef = doc(db, "users", uid);
    const tasksRef = collection(parentDocRef, "events");

    // Today's date
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const formattedToday = `${year}-${month}-${day}`;

    // One week from today
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(today.getDate() + 7);
    const yearNextWeek = oneWeekFromNow.getFullYear();
    const monthNextWeek = (oneWeekFromNow.getMonth() + 1).toString().padStart(2, '0');
    const dayNextWeek = oneWeekFromNow.getDate().toString().padStart(2, '0');
    const formattedNextWeek = `${yearNextWeek}-${monthNextWeek}-${dayNextWeek}`;

    // Query
    const q = query(
      tasksRef,
      where("date", ">=", formattedToday),
      where("date", "<=", formattedNextWeek)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docIdList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return data.name; // Use the "name" field directly from the document
      });

      return docIdList;
    } else {
      console.log("No events found for UID:", uid);
      return [];
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function readAllEventsCalendar(uid){
  try {
      const tasksRef = collection(db, "users", uid, "events");
      const querySnapshot = await getDocs(tasksRef);

      querySnapshot.forEach((doc) => {
          const data = doc.data(); 
          addEventToCalendar(data.name,data.date);
          console.log('called function for addEventToCalendar');
      });
  } catch (error) {
      console.error("Error reading subcollection:", error);
  }
}

export async function addFreeHoursToDb(uid, freeHours){
  const userDocRef = doc(db, 'users', uid);
  await setDoc(userDocRef, freeHours);
  console.log("free hours sent to databse")
}

export async function freeHoursExist(uid){
  console.log("free hours exists working");
  const userDocRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userDocRef);
  if (!userDoc.exists()){
    return false;
  }
  if('monday' in userDoc.data()){
    console.log("monday exists");
    return true;
  }
  console.log("moday no exist");
  return false;
}

export async function sendMessageToDb(uid, message) {
  try {
      const chatbotDocRef = doc(db, 'users', uid, 'chatbot', 'question');
      await setDoc(chatbotDocRef, { name: message });
      console.log(`Message (${message}) successfully saved to Firestore!`);
  } catch (error) {
      console.log("Error while sending chatbot message to db:", error);
  }
}

export async function getAnswerFromDb(uid){
  try {
    const chatbotDocRef = doc(db, 'users', uid, 'chatbot', 'answer');
    const docSnap = await getDoc(chatbotDocRef);
    const name = docSnap.get('name');
    return name;
} catch (error) {
    console.log("Error while sending chatbot message to db:", error);
}
}

export async function getFreeHoursDay(uid, day){
  try{
    console.log("function get free hours day running");
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data() + day);
    return docSnap.data()[day];
  }catch(error){
    console.log("error reading day frim databse: " + error);
    return 0;
  }
}

export async function setFreeHoursDay(uid, day, hours){
  try{
    console.log("function get free hours day running");
    const docRef = doc(db, 'users', uid);
    const data = {};
    data[day] = parseInt(hours, 10);
    await setDoc(docRef, data, {merge : true});
  }catch(error){
    console.log("error reading day frim databse: " + error);
  }
}

export async function loadTasksToCalendar(uid) {
  const db = getFirestore();
  const tasksCollection = collection(db, `users/${uid}/tasks`);

  try {
      const tasksSnapshot = await getDocs(tasksCollection);
      const mergedEvents = [];

      tasksSnapshot.forEach(doc => {//iterates through all tasks
          const taskData = doc.data();

          if (taskData["daily_schedule"] && Array.isArray(taskData["daily_schedule"])) {
              const schedule = taskData["daily_schedule"];
              const formattedDate = convertDateFormat(new Date());

              const currentTask = [doc.id, formattedDate, formattedDate];
              schedule.forEach(event => {
                const currDate = event['date'];
                const d1 = new Date(currDate);
                const minD = new Date(currentTask[1]);
                const maxD = new Date(currentTask[2]);

                if (d1 < minD){
                  currentTask[1] = convertDateFormat(d1);
                }
                else(d1 > maxD);
                {
                  currentTask[2] = convertDateFormat(d1);
                }


              });
              
              mergedEvents.push(currentTask);
              
          }
      });

      // Add merged events to FullCalendar
      mergedEvents.forEach(async event => {
        await addTaskToCalendar((event[0] + " task"), event[1], event[2]);
      });

  } catch (error) {
      console.error("Error loading tasks to calendar:", error);
  }
}

// Helper function to check if two dates are continuous
function areDatesContinuous(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Check if date2 is one day after date1
  return (d2 - d1 === 86400000); // 86400000 ms = 1 day
}
function processSchedule(schedule, taskId) {
  const mergedEvents = [];
  
  schedule.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
  
  schedule.forEach(entry => {
      const { date } = entry;
      console.error(date);

      if (date) {
          const d = new Date(date);
          
          // If mergedEvents is empty, add the first event
          if (mergedEvents.length === 0) {
              mergedEvents.push({
                  title: taskId,
                  start: date,
                  end: date,
              });
              return;
          }

          const lastEvent = mergedEvents[mergedEvents.length - 1];
          const lastEventEnd = new Date(lastEvent.end);

          // Check if the date is continuous with the last event's end date
          if ((d - lastEventEnd) === 86400000) { // 1 day gap
              lastEvent.end = date; // Extend the end date
          } else if (d > lastEventEnd) {
              // Add a new event for a non-continuous date
              mergedEvents.push({
                  title: taskId,
                  start: date,
                  end: date,
              });
          }
      }
  });

  return mergedEvents;
}

function convertDateFormat(date){
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
  const day = String(date.getDate()).padStart(2, '0'); // Ensures two digits
  return `${year}-${month}-${day}`;

}