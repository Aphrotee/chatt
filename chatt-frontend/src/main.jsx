import React from 'react';
import ReactDOM from 'react-dom/client';
import Signup from './components/Signup/signup';
import Login from './components/Login/login';
import ResetPassword from './components/Reset-password/resetPassword';
import {
          BrowserRouter as Router,
          Routes,
          Route
        } from 'react-router-dom'
import Sidebar from './components/Sidebar/sidebar'
import './index.scss';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/messages" element={<Messages />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/reset-password" element={<ResetPassword />}></Route>
        <Route path="*" element={<h2>Page Not Found</h2>}></Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
