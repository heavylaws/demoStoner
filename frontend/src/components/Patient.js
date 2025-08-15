import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Patient() {
  // State to hold the list of patients
  const [patients, setPatients] = useState([]);
  // State to hold the form data for creating/editing a patient
  const [form, setForm] = useState({ name: '', dob: '', address: '', phone: '', email: '' });
  // State to track whether we are editing an existing patient
  const [editing, setEditing] = useState(false);
  // State to hold the ID of the patient being edited
  const [currentId, setCurrentId] = useState(null);

  // Fetch the list of patients when the component mounts
  useEffect(() => {
    fetchPatients();
  }, []);

  // Function to fetch the list of patients from the API
  const fetchPatients = async () => {
    const response = await axios.get('/patients');
    setPatients(response.data);
  };

  // Function to handle changes in the form fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Function to handle form submission (for both creating and updating patients)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      // If we're editing, send a PUT request to update the patient
      await axios.put(`/patients/${currentId}`, form);
      setEditing(false);
      setCurrentId(null);
    } else {
      // If we're not editing, send a POST request to create a new patient
      await axios.post('/patients', form);
    }
    // Clear the form and fetch the updated list of patients
    setForm({ name: '', dob: '', address: '', phone: '', email: '' });
    fetchPatients();
  };

  // Function to handle the "Edit" button click
  const handleEdit = (patient) => {
    setEditing(true);
    setCurrentId(patient.id);
    setForm({ name: patient.name, dob: patient.dob, address: patient.address, phone: patient.phone, email: patient.email });
  };

  // Function to handle the "Delete" button click
  const handleDelete = async (id) => {
    await axios.delete(`/patients/${id}`);
    fetchPatients();
  };

  return (
    <div>
      <h1>Patient Management</h1>
      {/* Form for creating and updating patients */}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input type="date" name="dob" placeholder="Date of Birth" value={form.dob} onChange={handleChange} />
        <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <button type="submit">{editing ? 'Update' : 'Create'}</button>
      </form>
      {/* List of patients */}
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>
            {patient.name} - {patient.email}
            <button onClick={() => handleEdit(patient)}>Edit</button>
            <button onClick={() => handleDelete(patient.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Patient;
