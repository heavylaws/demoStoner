import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Appointment() {
  // State to hold the list of appointments
  const [appointments, setAppointments] = useState([]);
  // State to hold the list of patients (for the dropdown)
  const [patients, setPatients] = useState([]);
  // State to hold the list of doctors (for the dropdown)
  const [doctors, setDoctors] = useState([]);
  // State to hold the form data for creating/editing an appointment
  const [form, setForm] = useState({ patient_id: '', doctor_id: '', appointment_time: '', status: '' });
  // State to track whether we are editing an existing appointment
  const [editing, setEditing] = useState(false);
  // State to hold the ID of the appointment being edited
  const [currentId, setCurrentId] = useState(null);

  // Fetch the necessary data when the component mounts
  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  // Function to fetch the list of appointments from the API
  const fetchAppointments = async () => {
    const response = await axios.get('/appointments');
    setAppointments(response.data);
  };

  // Function to fetch the list of patients from the API
  const fetchPatients = async () => {
    const response = await axios.get('/patients');
    setPatients(response.data);
  };

  // Function to fetch the list of doctors from the API
  const fetchDoctors = async () => {
    const response = await axios.get('/users?role=doctor');
    setDoctors(response.data);
  };

  // Function to handle changes in the form fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Function to handle form submission (for both creating and updating appointments)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      // If we're editing, send a PUT request to update the appointment
      await axios.put(`/appointments/${currentId}`, form);
      setEditing(false);
      setCurrentId(null);
    } else {
      // If we're not editing, send a POST request to create a new appointment
      await axios.post('/appointments', form);
    }
    // Clear the form and fetch the updated list of appointments
    setForm({ patient_id: '', doctor_id: '', appointment_time: '', status: '' });
    fetchAppointments();
  };

  // Function to handle the "Edit" button click
  const handleEdit = (appointment) => {
    setEditing(true);
    setCurrentId(appointment.id);
    setForm({ patient_id: appointment.patient_id, doctor_id: appointment.doctor_id, appointment_time: appointment.appointment_time, status: appointment.status });
  };

  // Function to handle the "Delete" button click
  const handleDelete = async (id) => {
    await axios.delete(`/appointments/${id}`);
    fetchAppointments();
  };

  return (
    <div>
      <h1>Appointment Management</h1>
      {/* Form for creating and updating appointments */}
      <form onSubmit={handleSubmit}>
        <select name="patient_id" value={form.patient_id} onChange={handleChange}>
          <option value="">Select Patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
        <select name="doctor_id" value={form.doctor_id} onChange={handleChange}>
          <option value="">Select Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.username}
            </option>
          ))}
        </select>
        <input type="datetime-local" name="appointment_time" value={form.appointment_time} onChange={handleChange} />
        <input type="text" name="status" placeholder="Status" value={form.status} onChange={handleChange} />
        <button type="submit">{editing ? 'Update' : 'Create'}</button>
      </form>
      {/* List of appointments */}
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id}>
            Patient ID: {appointment.patient_id}, Doctor ID: {appointment.doctor_id}, Time: {appointment.appointment_time}, Status: {appointment.status}
            <button onClick={() => handleEdit(appointment)}>Edit</button>
            <button onClick={() => handleDelete(appointment.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Appointment;
