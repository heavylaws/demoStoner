import csv
from app import db, Patient, app

def migrate_patients(csv_file_path):
    with app.app_context():
        with open(csv_file_path, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                patient = Patient(
                    name=row['name'],
                    dob=row['dob'],
                    address=row['address'],
                    phone=row['phone'],
                    email=row['email']
                )
                db.session.add(patient)
            db.session.commit()

def run_migration():
    migrate_patients('../patients.csv')
