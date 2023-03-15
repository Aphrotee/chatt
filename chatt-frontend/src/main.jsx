import React from 'react'
import ReactDOM from 'react-dom/client'
import Sidebar from './components/Sidebar/sidebar'
import Messages from './components/Messages/messsages'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Sidebar />
    <Messages />
  </React.StrictMode>
)
