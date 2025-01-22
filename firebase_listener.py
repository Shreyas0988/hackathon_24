from firebase_config import db
from data_fetch import get_users_with_events, calculate_study_schedule, save_to_json
from datetime import datetime

def listen_to_firebase():
    def on_snapshot(doc_snapshot, changes, read_time):
        print(f"[{datetime.now()}] Changes detected in Firebase. Recalculating study schedules...")
        users_with_events = get_users_with_events()
        study_planner = calculate_study_schedule(users_with_events)
        save_to_json(study_planner, "study_planner.json")
        print(f"[{datetime.now()}] Study schedules updated successfully.")

    users_ref = db.collection('users')
    users_ref.on_snapshot(on_snapshot)

def main():
    print("Listening to Firebase updates...")
    listen_to_firebase()
    while True:
        pass

if __name__ == "__main__":
    main()
