import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Doctor() {
  // State to hold the list of appointments for the logged-in doctor
  const [appointments, setAppointments] = useState([]);
  // State to hold the currently selected appointment
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  // State to hold the treatment details for the selected appointment
  const [treatmentDetails, setTreatmentDetails] = useState('');
  // State to hold the amount for the treatment
  const [amount, setAmount] = useState(0);

  // Fetch the doctor's appointments when the component mounts
  useEffect(() => {
    // For now, we're hardcoding the doctor's ID to 1.
    // In a real application, you would get the logged-in doctor's ID from an authentication context.
    fetchAppointments(1);
  }, []);

  // Function to fetch the list of appointments for a specific doctor
  const fetchAppointments = async (doctorId) => {
    const response = await axios.get(`/appointments?doctor_id=${doctorId}`);
    setAppointments(response.data);
  };

  // Function to handle the selection of an appointment
  const handleSelectAppointment = (appointment) => {
    setSelectedAppointment(appointment);
  };

  // Function to handle the submission of a new treatment
  const handleAddTreatment = async (e) => {
    e.preventDefault();
    await axios.post('/treatments', {
      appointment_id: selectedAppointment.id,
      treatment_details: treatmentDetails,
      amount: amount,
    });
    // Clear the form after submission
    setTreatmentDetails('');
    setAmount(0);
    // In a real application, you might want to refresh the appointment details here
  };

  return (
    <div>
      <h1>Doctor's Dashboard</h1>
      <h2>Your Appointments</h2>
      {/* List of the doctor's appointments */}
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id} onClick={() => handleSelectAppointment(appointment)}>
            Patient ID: {appointment.patient_id}, Time: {appointment.appointment_time}, Status: {appointment.status}
          </li>
        ))}
      </ul>
      {/* Details of the selected appointment */}
      {selectedAppointment && (
        <div>
          <h2>Patient Details</h2>
          {/* In a real application, you would fetch and display the patient's details here */}
          <h2>Add Treatment</h2>
          {/* Form for adding a new treatment */}
          <form onSubmit={handleAddTreatment}>
            <textarea
              placeholder="Treatment Details"
              value={treatmentDetails}
              onChange={(e) => setTreatmentDetails(e.target.value)}
            ></textarea>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button type="submit">Add Treatment</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Doctor;
