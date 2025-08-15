import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Medication() {
  // State to hold the list of medications
  const [medications, setMedications] = useState([]);
  // State to hold the form data for creating/editing a medication
  const [form, setForm] = useState({ name: '' });
  // State to track whether we are editing an existing medication
  const [editing, setEditing] = useState(false);
  // State to hold the ID of the medication being edited
  const [currentId, setCurrentId] = useState(null);

  // Fetch the list of medications when the component mounts
  useEffect(() => {
    fetchMedications();
  }, []);

  // Function to fetch the list of medications from the API
  const fetchMedications = async () => {
    const response = await axios.get('/medications');
    setMedications(response.data);
  };

  // Function to handle changes in the form fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Function to handle form submission (for both creating and updating medications)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      // If we're editing, send a PUT request to update the medication
      await axios.put(`/medications/${currentId}`, form);
      setEditing(false);
      setCurrentId(null);
    } else {
      // If we're not editing, send a POST request to create a new medication
      await axios.post('/medications', form);
    }
    // Clear the form and fetch the updated list of medications
    setForm({ name: '' });
    fetchMedications();
  };

  // Function to handle the "Edit" button click
  const handleEdit = (medication) => {
    setEditing(true);
    setCurrentId(medication.id);
    setForm({ name: medication.name });
  };

  // Function to handle the "Delete" button click
  const handleDelete = async (id) => {
    await axios.delete(`/medications/${id}`);
    fetchMedications();
  };

  return (
    <div>
      <h1>Medication Management</h1>
      {/* Form for creating and updating medications */}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <button type="submit">{editing ? 'Update' : 'Create'}</button>
      </form>
      {/* List of medications */}
      <ul>
        {medications.map((medication) => (
          <li key={medication.id}>
            {medication.name}
            <button onClick={() => handleEdit(medication)}>Edit</button>
            <button onClick={() => handleDelete(medication.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Medication;
