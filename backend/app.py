from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Initialize the Flask application
app = Flask(__name__)
# Configure the database URI. Using SQLite for simplicity.
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///clinic.db'
# Initialize the SQLAlchemy extension
db = SQLAlchemy(app)
# Initialize the Flask-Migrate extension
migrate = Migrate(app, db)

# Define the User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(80), nullable=False)  # e.g., 'doctor', 'receptionist'

# Define the Patient model
class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    address = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), nullable=False)

# Define the Appointment model
class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    appointment_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(80), nullable=False)  # e.g., 'scheduled', 'completed', 'cancelled'

# Define the Treatment model
class Treatment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointment.id'), nullable=False)
    treatment_details = db.Column(db.Text, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    paid = db.Column(db.Boolean, default=False)

# Define the Invoice model
class Invoice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    treatment_id = db.Column(db.Integer, db.ForeignKey('treatment.id'), nullable=False)
    issue_date = db.Column(db.DateTime, nullable=False)
    due_date = db.Column(db.DateTime, nullable=False)

# Define the Medication model
class Medication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=True)

# Define the PrescribedMedication model to link treatments and medications
class PrescribedMedication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    treatment_id = db.Column(db.Integer, db.ForeignKey('treatment.id'), nullable=False)
    medication_id = db.Column(db.Integer, db.ForeignKey('medication.id'), nullable=False)

# Define the Visitor model
class Visitor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    purpose = db.Column(db.String(255), nullable=False)
    arrival_time = db.Column(db.DateTime, nullable=False)
    departure_time = db.Column(db.DateTime, nullable=True)

# API endpoint to get users, with optional filtering by role
@app.route('/users', methods=['GET'])
def handle_users():
    role = request.args.get('role')
    if role:
        users = User.query.filter_by(role=role).all()
    else:
        users = User.query.all()
    return jsonify([{'id': user.id, 'username': user.username, 'role': user.role} for user in users])

# API endpoints for managing patients
@app.route('/patients', methods=['GET', 'POST'])
def handle_patients():
    if request.method == 'POST':
        # Create a new patient
        data = request.get_json()
        new_patient = Patient(
            name=data['name'],
            dob=data['dob'],
            address=data['address'],
            phone=data['phone'],
            email=data['email']
        )
        db.session.add(new_patient)
        db.session.commit()
        return jsonify({'message': 'New patient created.'})
    else:
        # Get all patients
        patients = Patient.query.all()
        return jsonify([{'id': patient.id, 'name': patient.name, 'dob': patient.dob, 'address': patient.address, 'phone': patient.phone, 'email': patient.email} for patient in patients])

# API endpoints for managing a single patient
@app.route('/patients/<id>', methods=['GET', 'PUT', 'DELETE'])
def handle_patient(id):
    patient = Patient.query.get_or_404(id)
    if request.method == 'GET':
        # Get patient details
        return jsonify({'id': patient.id, 'name': patient.name, 'dob': patient.dob, 'address': patient.address, 'phone': patient.phone, 'email': patient.email})
    elif request.method == 'PUT':
        # Update patient details
        data = request.get_json()
        patient.name = data['name']
        patient.dob = data['dob']
        patient.address = data['address']
        patient.phone = data['phone']
        patient.email = data['email']
        db.session.commit()
        return jsonify({'message': 'Patient updated.'})
    elif request.method == 'DELETE':
        # Delete a patient
        db.session.delete(patient)
        db.session.commit()
        return jsonify({'message': 'Patient deleted.'})

# API endpoints for managing appointments
@app.route('/appointments', methods=['GET', 'POST'])
def handle_appointments():
    if request.method == 'POST':
        # Create a new appointment
        data = request.get_json()
        new_appointment = Appointment(
            patient_id=data['patient_id'],
            doctor_id=data['doctor_id'],
            appointment_time=data['appointment_time'],
            status=data['status']
        )
        db.session.add(new_appointment)
        db.session.commit()
        return jsonify({'message': 'New appointment created.'})
    else:
        # Get all appointments, with optional filtering by doctor_id
        doctor_id = request.args.get('doctor_id')
        if doctor_id:
            appointments = Appointment.query.filter_by(doctor_id=doctor_id).all()
        else:
            appointments = Appointment.query.all()
        return jsonify([{'id': appointment.id, 'patient_id': appointment.patient_id, 'doctor_id': appointment.doctor_id, 'appointment_time': appointment.appointment_time, 'status': appointment.status} for appointment in appointments])

# API endpoints for managing a single appointment
@app.route('/appointments/<id>', methods=['GET', 'PUT', 'DELETE'])
def handle_appointment(id):
    appointment = Appointment.query.get_or_404(id)
    if request.method == 'GET':
        # Get appointment details
        return jsonify({'id': appointment.id, 'patient_id': appointment.patient_id, 'doctor_id': appointment.doctor_id, 'appointment_time': appointment.appointment_time, 'status': appointment.status})
    elif request.method == 'PUT':
        # Update appointment details
        data = request.get_json()
        appointment.patient_id = data['patient_id']
        appointment.doctor_id = data['doctor_id']
        appointment.appointment_time = data['appointment_time']
        appointment.status = data['status']
        db.session.commit()
        return jsonify({'message': 'Appointment updated.'})
    elif request.method == 'DELETE':
        # Delete an appointment
        db.session.delete(appointment)
        db.session.commit()
        return jsonify({'message': 'Appointment deleted.'})

# API endpoints for managing treatments
@app.route('/treatments', methods=['GET', 'POST'])
def handle_treatments():
    if request.method == 'POST':
        # Create a new treatment
        data = request.get_json()
        new_treatment = Treatment(
            appointment_id=data['appointment_id'],
            treatment_details=data['treatment_details'],
            amount=data['amount']
        )
        db.session.add(new_treatment)
        db.session.commit()
        return jsonify({'message': 'New treatment created.'})
    else:
        # Get all treatments, with optional filtering by appointment_id
        appointment_id = request.args.get('appointment_id')
        if appointment_id:
            treatments = Treatment.query.filter_by(appointment_id=appointment_id).all()
        else:
            treatments = Treatment.query.all()
        return jsonify([{'id': treatment.id, 'appointment_id': treatment.appointment_id, 'treatment_details': treatment.treatment_details, 'amount': treatment.amount} for treatment in treatments])

# API endpoints for managing invoices
@app.route('/invoices', methods=['GET', 'POST'])
def handle_invoices():
    if request.method == 'POST':
        # Create a new invoice
        data = request.get_json()
        new_invoice = Invoice(
            treatment_id=data['treatment_id'],
            issue_date=data['issue_date'],
            due_date=data['due_date']
        )
        db.session.add(new_invoice)
        db.session.commit()
        return jsonify({'message': 'New invoice created.'})
    else:
        # Get all invoices
        invoices = Invoice.query.all()
        return jsonify([{'id': invoice.id, 'treatment_id': invoice.treatment_id, 'issue_date': invoice.issue_date, 'due_date': invoice.due_date} for invoice in invoices])

# API endpoints for managing a single invoice
@app.route('/invoices/<id>', methods=['GET', 'PUT', 'DELETE'])
def handle_invoice(id):
    invoice = Invoice.query.get_or_404(id)
    if request.method == 'GET':
        # Get invoice details
        return jsonify({'id': invoice.id, 'treatment_id': invoice.treatment_id, 'issue_date': invoice.issue_date, 'due_date': invoice.due_date})
    elif request.method == 'PUT':
        # Update invoice details
        data = request.get_json()
        invoice.treatment_id = data['treatment_id']
        invoice.issue_date = data['issue_date']
        invoice.due_date = data['due_date']
        db.session.commit()
        return jsonify({'message': 'Invoice updated.'})
    elif request.method == 'DELETE':
        # Delete an invoice
        db.session.delete(invoice)
        db.session.commit()
        return jsonify({'message': 'Invoice deleted.'})

# API endpoints for managing medications
@app.route('/medications', methods=['GET', 'POST'])
def handle_medications():
    if request.method == 'POST':
        # Create a new medication
        data = request.get_json()
        new_medication = Medication(name=data['name'])
        db.session.add(new_medication)
        db.session.commit()
        return jsonify({'message': 'New medication created.'})
    else:
        # Get all medications
        medications = Medication.query.all()
        return jsonify([{'id': medication.id, 'name': medication.name} for medication in medications])

# API endpoints for managing a single medication
@app.route('/medications/<id>', methods=['GET', 'PUT', 'DELETE'])
def handle_medication(id):
    medication = Medication.query.get_or_404(id)
    if request.method == 'GET':
        # Get medication details
        return jsonify({'id': medication.id, 'name': medication.name})
    elif request.method == 'PUT':
        # Update medication details
        data = request.get_json()
        medication.name = data['name']
        db.session.commit()
        return jsonify({'message': 'Medication updated.'})
    elif request.method == 'DELETE':
        # Delete a medication
        db.session.delete(medication)
        db.session.commit()
        return jsonify({'message': 'Medication deleted.'})

import sys
import csv

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

# API endpoints for managing visitors
@app.route('/visitors', methods=['GET', 'POST'])
def handle_visitors():
    if request.method == 'POST':
        # Create a new visitor
        data = request.get_json()
        new_visitor = Visitor(
            name=data['name'],
            purpose=data['purpose'],
            arrival_time=data['arrival_time'],
            departure_time=data.get('departure_time')
        )
        db.session.add(new_visitor)
        db.session.commit()
        return jsonify({'message': 'New visitor created.'})
    else:
        # Get all visitors
        visitors = Visitor.query.all()
        return jsonify([{'id': visitor.id, 'name': visitor.name, 'purpose': visitor.purpose, 'arrival_time': visitor.arrival_time, 'departure_time': visitor.departure_time} for visitor in visitors])

# API endpoints for managing a single visitor
@app.route('/visitors/<id>', methods=['GET', 'PUT', 'DELETE'])
def handle_visitor(id):
    visitor = Visitor.query.get_or_404(id)
    if request.method == 'GET':
        # Get visitor details
        return jsonify({'id': visitor.id, 'name': visitor.name, 'purpose': visitor.purpose, 'arrival_time': visitor.arrival_time, 'departure_time': visitor.departure_time})
    elif request.method == 'PUT':
        # Update visitor details
        data = request.get_json()
        visitor.name = data['name']
        visitor.purpose = data['purpose']
        visitor.arrival_time = data['arrival_time']
        visitor.departure_time = data.get('departure_time')
        db.session.commit()
        return jsonify({'message': 'Visitor updated.'})
    elif request.method == 'DELETE':
        # Delete a visitor
        db.session.delete(visitor)
        db.session.commit()
        return jsonify({'message': 'Visitor deleted.'})

# This block runs the app when the script is executed directly
if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'migrate':
        migrate_patients('../patients.csv')
    else:
        # Create the database tables if they don't exist
        with app.app_context():
            db.create_all()
        # Run the Flask development server
        app.run(debug=True)
