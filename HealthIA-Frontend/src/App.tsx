import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import TestLogin from './pages/TestLogin';
import MainLayout from './components/Layout/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import PacienteManagement from './pages/Admin/PacienteManagement';
import MedicoManagement from './pages/Admin/MedicoManagement';
import AdminManagement from './pages/Admin/AdminManagement';
import ConsultaManagement from './pages/Admin/ConsultaManagement';
import PacienteProfile from './pages/Admin/PacienteProfile';
import MedicoProfile from './pages/Admin/MedicoProfile';
import AdminProfile from './pages/Admin/AdminProfile';
import ConsultaProfile from './pages/Admin/ConsultaProfile';

// Doctor Pages
import DoctorDashboard from './pages/Doctor/NewDoctorDashboard';
import MedicalValidation from './pages/Doctor/NewMedicalValidation';
import DoctorPatients from './pages/Doctor/DoctorPatients';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorPatientProfile from './pages/Doctor/DoctorPatientProfile';

// Patient Pages
import PatientHome from './pages/Patient/NewPatientHome';
import PatientHistory from './pages/Patient/PatientHistory';
import PatientProfile from './pages/Patient/PatientProfile';
import PatientResults from './pages/Patient/PatientResults';
import PatientConsultas from './pages/Patient/PatientConsultas';
import PatientConsultaDetail from './pages/Patient/PatientConsultaDetail';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/test-login" element={<TestLogin />} />

          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/pacientes" element={<PacienteManagement />} />
              <Route path="/admin/medicos" element={<MedicoManagement />} />
              <Route path="/admin/medicos/:id" element={<MedicoProfile />} />
              <Route path="/admin/admins" element={<AdminManagement />} />
              <Route path="/admin/admins/:id" element={<AdminProfile />} />
              <Route path="/admin/consultas" element={<ConsultaManagement />} />
              <Route path="/admin/consultas/:id" element={<ConsultaProfile />} />
              <Route path="/admin/pacientes/:id" element={<PacienteProfile />} />

              {/* Doctor Routes */}
              <Route path="/doctor" element={<DoctorDashboard />} />
              <Route path="/doctor/patients" element={<DoctorPatients />} />
              <Route path="/doctor/patients/:id" element={<DoctorPatientProfile />} />
              <Route path="/doctor/consultations" element={<MedicalValidation />} />
              <Route path="/doctor/profile" element={<DoctorProfile />} />

              {/* Patient Routes */}
              <Route path="/patient" element={<PatientHome />} />
              <Route path="/patient/history" element={<PatientHistory />} />
              <Route path="/patient/consultas" element={<PatientConsultas />} />
              <Route path="/patient/consultas/:id" element={<PatientConsultaDetail />} />
              <Route path="/patient/profile" element={<PatientProfile />} />
              <Route path="/patient/results" element={<PatientResults />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
