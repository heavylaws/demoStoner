import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Visitor() {
  // State to hold the list of visitors
  const [visitors, setVisitors] = useState([]);
  // State to hold the form data for creating/editing a visitor
  const [form, setForm] = useState({ name: '', purpose: '', arrival_time: '', departure_time: '' });
  // State to track whether we are editing an existing visitor
  const [editing, setEditing] = useState(false);
  // State to hold the ID of the visitor being edited
  const [currentId, setCurrentId] = useState(null);

  // Fetch the list of visitors when the component mounts
  useEffect(() => {
    fetchVisitors();
  }, []);

  // Function to fetch the list of visitors from the API
  const fetchVisitors = async () => {
    const response = await axios.get('/visitors');
    setVisitors(response.data);
  };

  // Function to handle changes in the form fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Function to handle form submission (for both creating and updating visitors)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      // If we're editing, send a PUT request to update the visitor
      await axios.put(`/visitors/${currentId}`, form);
      setEditing(false);
      setCurrentId(null);
    } else {
      // If we're not editing, send a POST request to create a new visitor
      await axios.post('/visitors', form);
    }
    // Clear the form and fetch the updated list of visitors
    setForm({ name: '', purpose: '', arrival_time: '', departure_time: '' });
    fetchVisitors();
  };

  // Function to handle the "Edit" button click
  const handleEdit = (visitor) => {
    setEditing(true);
    setCurrentId(visitor.id);
    setForm({ name: visitor.name, purpose: visitor.purpose, arrival_time: visitor.arrival_time, departure_time: visitor.departure_time });
  };

  // Function to handle the "Delete" button click
  const handleDelete = async (id) => {
    await axios.delete(`/visitors/${id}`);
    fetchVisitors();
  };

  return (
    <div>
      <h1>Visitor Management</h1>
      {/* Form for creating and updating visitors */}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input type="text" name="purpose" placeholder="Purpose" value={form.purpose} onChange={handleChange} />
        <input type="datetime-local" name="arrival_time" value={form.arrival_time} onChange={handleChange} />
        <input type="datetime-local" name="departure_time" value={form.departure_time} onChange={handleChange} />
        <button type="submit">{editing ? 'Update' : 'Create'}</button>
      </form>
      {/* List of visitors */}
      <ul>
        {visitors.map((visitor) => (
          <li key={visitor.id}>
            {visitor.name} - {visitor.purpose}
            <button onClick={() => handleEdit(visitor)}>Edit</button>
            <button onClick={() => handleDelete(visitor.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Visitor;
