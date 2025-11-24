import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminUsers from './pages/AdminUsers';
import Crops from './pages/Crops';
import Livestock from './pages/Livestock';
import Tasks from './pages/Tasks';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import DiseaseDetection from './pages/DiseaseDetection';
import Finance from './pages/Finance';
import Inventory from './pages/Inventory';
import FieldMap from './pages/FieldMap';
import Help from './pages/Help';
import InfoPage from './pages/InfoPage';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:resettoken"
                element={<ResetPassword />}
              />
              <Route path="/privacy" element={<InfoPage />} />
              <Route path="/terms" element={<InfoPage />} />
              <Route path="/cookies" element={<InfoPage />} />
              <Route path="/security" element={<InfoPage />} />
              <Route path="/licenses" element={<InfoPage />} />
              <Route path="/about" element={<InfoPage />} />

              {/* Protected Routes with Layout */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/crops"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Crops />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/livestock"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Livestock />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/disease-detection"
                element={
                  <ProtectedRoute>
                    <DiseaseDetection />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Tasks />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/finance"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Finance />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/inventory"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Inventory />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <FieldMap />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Layout>
                      <AdminUsers />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/help"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Help />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
