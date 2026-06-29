import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, Award, CheckSquare, Heart, User, Settings, Bell, 
  PlusCircle, Users, Percent, Shield, Menu, X, ArrowLeft, LogOut,
  TrendingUp, FileText, UploadCloud, DollarSign, ListChecks, Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarItem {
  id: string;
  label: string;
  icon: any;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { currentUser, logout, theme, toggleDarkMode } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="text-center p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full shadow-lg">
          <Shield className="h-12 w-12 text-brand-purple mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-sm text-slate-500 mb-6">Please log in to access your dashboard portal.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 px-4 bg-brand-blue text-white rounded-xl text-sm font-semibold hover:opacity-90 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Define sidebar menu items based on user role
  const getSidebarItems = (): SidebarItem[] => {
    switch (currentUser.role) {
      case 'student':
        return [
          { id: 'overview', label: 'Dashboard', icon: TrendingUp },
          { id: 'courses', label: 'My Courses', icon: BookOpen },
          { id: 'assignments', label: 'Assignments', icon: CheckSquare },
          { id: 'certificates', label: 'Certificates', icon: Award },
          { id: 'wishlist', label: 'Wishlist', icon: Heart },
          { id: 'profile', label: 'My Profile', icon: User },
        ];
      case 'mentor':
        return [
          { id: 'overview', label: 'Dashboard', icon: TrendingUp },
          { id: 'courses', label: 'My Courses', icon: BookOpen },
          { id: 'upload-course', label: 'Upload Course', icon: PlusCircle },
          { id: 'upload-video', label: 'Upload Videos', icon: UploadCloud },
          { id: 'assignments', label: 'Submissions', icon: ListChecks },
          { id: 'students', label: 'Student List', icon: Users },
          { id: 'earnings', label: 'Earnings', icon: DollarSign },
          { id: 'profile', label: 'My Profile', icon: User },
        ];
      case 'admin':
        return [
          { id: 'overview', label: 'Dashboard', icon: TrendingUp },
          { id: 'users', label: 'Users Directory', icon: Users },
          { id: 'mentors', label: 'Mentors Directory', icon: User },
          { id: 'courses', label: 'Manage Courses', icon: BookOpen },
          { id: 'requests', label: 'Mentor Requests', icon: FileText },
        ];
      default:
        return [];
    }
  };

  const menuItems = getSidebarItems();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800/60 z-50 w-64 transform transition-transform duration-300 md:translate-x-0 md:static md:flex md:flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-base">
              SB
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent font-display">
              SkillBridge
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 mt-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 flex items-center space-x-3">
          <img src={currentUser.avatar} alt="" className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800 object-cover" referrerPolicy="no-referrer" />
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-sm truncate text-slate-800 dark:text-slate-200">{currentUser.name}</h4>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple dark:text-purple-400">
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative
                  ${isSelected 
                    ? 'text-brand-blue dark:text-blue-400 bg-brand-blue/5 dark:bg-blue-400/5' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850'}
                `}
              >
                <Icon className={`h-5 w-5 ${isSelected ? 'text-brand-blue dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{item.label}</span>
                {isSelected && (
                  <motion.div 
                    layoutId="sidebar-active-indicator"
                    className="absolute right-0 top-2 bottom-2 w-1 bg-brand-blue dark:bg-blue-400 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2 bg-slate-50/50 dark:bg-slate-950/20">
          <Link
            to="/"
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Public Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* Main Dashboard Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/50 h-16 flex items-center justify-between px-6 transition-colors duration-300">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold font-display capitalize hidden sm:block text-slate-800 dark:text-white">
              {currentUser.role} Workspace — {activeTab.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200/50 dark:border-slate-800">
              <img src={currentUser.avatar} alt="" className="h-8 w-8 object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        {/* Dashboard Dynamic View Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};
