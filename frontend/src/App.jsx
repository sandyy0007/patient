import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages - creating placeholders for now
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 relative">
          {/* Decorative background blobs */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

          <div className="relative z-10 w-full h-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <Login />} />
              <Route path="/register" element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <Register />} />
              
              <Route path="/patient-dashboard" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientDashboard />
                </ProtectedRoute>
              } />
              <Route path="/doctor-dashboard" element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin-dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
