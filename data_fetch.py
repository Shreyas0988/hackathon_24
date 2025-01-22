from firebase_config import db
import json
from datetime import datetime, timedelta

def get_users_with_events():
    users_with_events = {}
    try:
        users_collection = db.collection('users')
        docs = users_collection.stream()
        for doc in docs:
            user_id = doc.id
            user_data = doc.to_dict()
            users_with_events[user_id] = {
                "weekly_hours": {
                    "sat": user_data.get("saturday", 0),
                    "sun": user_data.get("sunday", 0),
                    "mon": user_data.get("monday", 0),
                    "tue": user_data.get("tuesday", 0),
                    "wed": user_data.get("wednesday", 0),
                    "thu": user_data.get("thursday", 0),
                    "fri": user_data.get("friday", 0)
                },
                "events": {}
            }
            events_subcollection = users_collection.document(user_id).collection('events')
            event_docs = events_subcollection.stream()
            for event_doc in event_docs:
                event_data = event_doc.to_dict()
                event_id = event_doc.id
                users_with_events[user_id]["events"][event_id] = event_data
    except Exception as e:
        print(f"An error occurred: {e}")
    return users_with_events

def calculate_study_schedule(users_with_events, baseline_hours=12):
    today = datetime.now()
    two_weeks_from_now = today + timedelta(weeks=2)
    study_planner = {}

    for user_id, user_data in users_with_events.items():
        study_planner[user_id] = {}
        weekly_hours = user_data["weekly_hours"]
        events = user_data["events"]
        sorted_events = sorted(
            events.items(),
            key=lambda x: (
                -int(x[1].get("diff", 3)),
                datetime.strptime(x[1].get("date", "9999-12-31"), "%Y-%m-%d") if x[1].get("date") else datetime.max
            )
        )

        for event_id, event_data in sorted_events:
            event_name = event_data.get("name", event_id)
            due_date_str = event_data.get("date", None)
            if due_date_str:
                due_date = datetime.strptime(due_date_str, "%Y-%m-%d")
                if not (today <= due_date <= two_weeks_from_now):
                    print(f"Skipping event '{event_name}' for user '{user_id}' (due_date: {due_date}).")
                    continue
            else:
                print(f"No due_date for event '{event_name}'. Skipping.")
                continue

            multiplier = 1.0
            if event_data.get("diff") == 3:
                multiplier = 1.2
            elif event_data.get("diff") == 4:
                multiplier = 1.4
            elif event_data.get("diff") == 5:
                multiplier = 1.6
            total_study_hours = baseline_hours * multiplier

            daily_schedule = []
            assigned_dates = set()
            days_available = (due_date - today).days - 1
            if days_available <= 0:
                days_available = 1

            hours_per_day = round(total_study_hours / days_available, 1)
            remaining_hours = total_study_hours

            for i in range(days_available):
                event_date = (today + timedelta(days=i)).strftime("%Y-%m-%d")
                if event_date in assigned_dates:
                    continue
                hours_to_allocate = min(hours_per_day, remaining_hours)
                if hours_to_allocate < 0.5:
                    hours_to_allocate = 0.5

                daily_schedule.append({
                    "event_id": event_id,
                    "date": event_date,
                    "hours": round(hours_to_allocate, 1),
                })
                assigned_dates.add(event_date)
                remaining_hours -= hours_to_allocate

                if remaining_hours <= 0:
                    break

            study_planner[user_id][event_id] = {
                "event_name": event_name,
                "difficulty": event_data.get("diff", 3),
                "due_date": due_date_str,
                "total_study_hours": round(total_study_hours, 1),
                "daily_schedule": daily_schedule
            }

            try:
                task_doc_ref = db.collection('users').document(user_id).collection('tasks').document(event_name)
                task_doc_ref.set({
                    "event_name": event_name,
                    "difficulty": event_data.get("diff", 3),
                    "due_date": due_date_str,
                    "total_study_hours": round(total_study_hours, 1),
                    "daily_schedule": daily_schedule
                })
                print(f"Task '{event_name}' created for user '{user_id}' with daily_schedule.")
            except Exception as e:
                print(f"Failed to update Firebase for user '{user_id}', task '{event_name}': {e}")

    return study_planner

def save_to_json(data, filename):
    try:
        with open(filename, "w") as json_file:
            json.dump(data, json_file, indent=4)
        print(f"Data successfully saved to {filename}")
    except Exception as e:
        print(f"An error occurred while saving to JSON: {e}")

def main():
    users_with_events = get_users_with_events()
    study_planner = calculate_study_schedule(users_with_events)
    save_to_json(study_planner, "study_planner.json")

if __name__ == "__main__":
    main()
