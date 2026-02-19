import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import LeadsTable from './components/LeadsTable'
import GalleryManager from './components/GalleryManager'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<LeadsTable />} />
          <Route path="/gallery" element={<GalleryManager />} />
          <Route path="/settings" element={<div className="text-center py-12 text-text-muted">Settings coming soon...</div>} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
