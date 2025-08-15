import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Receptionist() {
  // State to hold the list of all appointments
  const [appointments, setAppointments] = useState([]);
  // State to hold the currently selected appointment
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  // State to hold the treatment details for the selected appointment
  const [treatment, setTreatment] = useState(null);

  // Fetch the list of all appointments when the component mounts
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Function to fetch the list of all appointments from the API
  const fetchAppointments = async () => {
    const response = await axios.get('/appointments');
    setAppointments(response.data);
  };

  // Function to handle the selection of an appointment
  const handleSelectAppointment = async (appointment) => {
    setSelectedAppointment(appointment);
    // Fetch the treatment details for the selected appointment
    const response = await axios.get(`/treatments?appointment_id=${appointment.id}`);
    // We're assuming that there's only one treatment per appointment
    setTreatment(response.data[0]);
  };

  return (
    <div>
      <h1>Receptionist's Dashboard</h1>
      <h2>All Appointments</h2>
      {/* List of all appointments */}
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id} onClick={() => handleSelectAppointment(appointment)}>
            Patient ID: {appointment.patient_id}, Doctor ID: {appointment.doctor_id}, Time: {appointment.appointment_time}, Status: {appointment.status}
          </li>
        ))}
      </ul>
      {/* Details of the selected appointment */}
      {selectedAppointment && (
        <div>
          <h2>Appointment Details</h2>
          {/* In a real application, you would fetch and display the patient's and doctor's details here */}
          {treatment ? (
            <div>
              <h3>Treatment Details</h3>
              <p>{treatment.treatment_details}</p>
              <h3>Amount to be Collected</h3>
              <p>${treatment.amount}</p>
            </div>
          ) : (
            <p>No treatment details for this appointment.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Receptionist;
