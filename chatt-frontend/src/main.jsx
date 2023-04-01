import React from 'react';
import ReactDOM from 'react-dom/client';
import Signup from './components/Signup/signup';
import Login from './components/Login/login';
import ResetPassword from './components/Reset-password/resetPassword';
import UpdateStatusQuote from './components/Update-status-quote/updatestatusquote';
import {
          BrowserRouter as Router,
          Routes,
          Route
        } from 'react-router-dom'
import Sidebar from './components/Sidebar/sidebar'
import Home from './components/Home/home';
import './index.scss';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/messages" element={<Sidebar />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/update-status-quote" element={<UpdateStatusQuote />}></Route>
        <Route path="/reset-password" element={<ResetPassword />}></Route>
        <Route path="*" element={<h2>Page Not Found</h2>}></Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
