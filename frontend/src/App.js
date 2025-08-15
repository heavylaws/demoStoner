import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Patient from './components/Patient';
import Appointment from './components/Appointment';
import Doctor from './components/Doctor';
import Receptionist from './components/Receptionist';
import Billing from './components/Billing';
import Medication from './components/Medication';
import Visitor from './components/Visitor';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/patients">Patients</Link>
            </li>
            <li>
              <Link to="/appointments">Appointments</Link>
            </li>
            <li>
              <Link to="/doctor">Doctor</Link>
            </li>
            <li>
              <Link to="/receptionist">Receptionist</Link>
            </li>
            <li>
              <Link to="/billing">Billing</Link>
            </li>
            <li>
              <Link to="/medications">Medications</Link>
            </li>
            <li>
              <Link to="/visitors">Visitors</Link>
            </li>
          </ul>
        </nav>

        <hr />

        <Routes>
          <Route path="/patients" element={<Patient />} />
          <Route path="/appointments" element={<Appointment />} />
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/receptionist" element={<Receptionist />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/medications" element={<Medication />} />
          <Route path="/visitors" element={<Visitor />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Home</h2>;
}

export default App;
