import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Courses } from './pages/Courses';
import { CourseDetails } from './pages/CourseDetails';
import { Mentors } from './pages/Mentors';
import { MentorProfile } from './pages/MentorProfile';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';

// Dashboard views & Layouts
import { DashboardLayout } from './layouts/DashboardLayout';
import { StudentDashboardView } from './student/StudentDashboardView';
import { MentorDashboardView } from './mentor/MentorDashboardView';
import { AdminDashboardView } from './admin/AdminDashboardView';

// Scroll to top on route change helper
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [pathname]);
  return null;
};

// Public layout wrapper to centralize footer and header styles
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Route controller wrappers
const StudentDashboardController: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <StudentDashboardView activeTab={activeTab} />
    </DashboardLayout>
  );
};

const MentorDashboardController: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <MentorDashboardView activeTab={activeTab} />
    </DashboardLayout>
  );
};

const AdminDashboardController: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <AdminDashboardView activeTab={activeTab} />
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          
          {/* Public Pages */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/courses" element={<PublicLayout><Courses /></PublicLayout>} />
          <Route path="/courses/:id" element={<PublicLayout><CourseDetails /></PublicLayout>} />
          <Route path="/mentors" element={<PublicLayout><Mentors /></PublicLayout>} />
          <Route path="/mentors/:id" element={<PublicLayout><MentorProfile /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          
          {/* Auth Pages */}
          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
          <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />
          
          {/* Student Portal Workspaces */}
          <Route path="/student" element={<StudentDashboardController />} />
          <Route path="/student/learning/:courseId" element={<StudentDashboardController />} />
          
          {/* Mentor Portal Workspaces */}
          <Route path="/mentor" element={<MentorDashboardController />} />
          
          {/* Admin Portal Workspaces */}
          <Route path="/admin" element={<AdminDashboardController />} />
          
          {/* Fallback Catch */}
          <Route path="*" element={<PublicLayout><Home /></PublicLayout>} />

        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
