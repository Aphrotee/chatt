import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from '../src/components/Login/login'
import {
  BrowserRouter as Router,
  Routes,
  Route } from 'react-router-dom'
import Messages from './components/Messages/messsages'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Messages />}></Route>
        <Route path="login" element={<Login />}></Route>
      </Routes>
    </Router>
  </React.StrictMode>
)
