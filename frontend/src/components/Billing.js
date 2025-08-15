import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Billing() {
  // State to hold the list of invoices
  const [invoices, setInvoices] = useState([]);
  // State to hold the list of treatments (for the dropdown)
  const [treatments, setTreatments] = useState([]);
  // State to hold the form data for creating a new invoice
  const [form, setForm] = useState({ treatment_id: '', issue_date: '', due_date: '' });

  // Fetch the necessary data when the component mounts
  useEffect(() => {
    fetchInvoices();
    fetchTreatments();
  }, []);

  // Function to fetch the list of invoices from the API
  const fetchInvoices = async () => {
    const response = await axios.get('/invoices');
    setInvoices(response.data);
  };

  // Function to fetch the list of treatments from the API
  const fetchTreatments = async () => {
    const response = await axios.get('/treatments');
    setTreatments(response.data);
  };

  // Function to handle changes in the form fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Function to handle form submission for creating a new invoice
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/invoices', form);
    // Clear the form and fetch the updated list of invoices
    setForm({ treatment_id: '', issue_date: '', due_date: '' });
    fetchInvoices();
  };

  return (
    <div>
      <h1>Billing</h1>
      {/* Form for creating a new invoice */}
      <form onSubmit={handleSubmit}>
        <select name="treatment_id" value={form.treatment_id} onChange={handleChange}>
          <option value="">Select Treatment</option>
          {treatments.map((treatment) => (
            <option key={treatment.id} value={treatment.id}>
              {treatment.id} - {treatment.treatment_details}
            </option>
          ))}
        </select>
        <input type="datetime-local" name="issue_date" value={form.issue_date} onChange={handleChange} />
        <input type="datetime-local" name="due_date" value={form.due_date} onChange={handleChange} />
        <button type="submit">Create Invoice</button>
      </form>
      {/* List of invoices */}
      <ul>
        {invoices.map((invoice) => (
          <li key={invoice.id}>
            Invoice ID: {invoice.id}, Treatment ID: {invoice.treatment_id}, Issue Date: {invoice.issue_date}, Due Date: {invoice.due_date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Billing;
