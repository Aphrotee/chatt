import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from '../src/components/Login/login'
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
        <Route path="/" element={<Sidebar />}></Route>
        <Route path="login" element={<Login />}></Route>
      </Routes>
    </Router>
  </React.StrictMode>
)
