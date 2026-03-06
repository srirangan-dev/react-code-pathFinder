import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider }  from './context/AuthContext'
import ProtectedRoute    from './components/ProtectedRoute'
import Navbar            from './components/Navbar'
import Footer            from './components/Footer'
import AIAssistant       from './components/AIAssistant'
import Home              from './pages/Home'
import Quiz              from './pages/Quiz'
import FieldQuiz         from './pages/Fieldquiz'
import CareerPaths       from './pages/Careerpaths'
import Colleges          from './pages/Colleges'
import Timeline          from './pages/Timeline'
import Dashboard         from './pages/Dashboard'
import Login             from './pages/Login'
import Signup            from './pages/Signup'

export default function App() {
  return (
    <AuthProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            {/* ✅ Public — anyone can access */}
            <Route path="/"       element={<Home />} />
            <Route path="/login"  element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* 🔒 Protected — must login first */}
            <Route path="/quiz" element={
              <ProtectedRoute><Quiz /></ProtectedRoute>
            } />
            <Route path="/quiz/:fieldId" element={
              <ProtectedRoute><FieldQuiz /></ProtectedRoute>
            } />
            <Route path="/careers" element={
              <ProtectedRoute><CareerPaths /></ProtectedRoute>
            } />
            <Route path="/colleges" element={
              <ProtectedRoute><Colleges /></ProtectedRoute>
            } />
            <Route path="/timeline" element={
              <ProtectedRoute><Timeline /></ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <AIAssistant />
      </div>
    </AuthProvider>
  )
}