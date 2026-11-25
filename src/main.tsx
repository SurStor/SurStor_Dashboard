import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import PersonalUsage from './pages/PersonalUsage'
import UsageDashboard from './pages/UsageDashboard'
import './index.css'
createRoot(document.getElementById('root')!).render(<StrictMode><BrowserRouter><Routes><Route path="/" element={<PersonalUsage/>}/><Route path="/dashboard/personal" element={<PersonalUsage/>}/><Route path="/dashboard" element={<UsageDashboard/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></BrowserRouter></StrictMode>)
