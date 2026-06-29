import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Sun, Moon, Menu, X, Bell, User, LogOut, 
  BookOpen, Award, Shield, ChevronDown, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const { currentUser, logout, theme, toggleDarkMode, notifications, markNotificationRead } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const activeNotifications = notifications.filter(n => !n.read && (!currentUser || n.userId === currentUser.id || n.role === currentUser?.role));

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Mentors', path: '/mentors' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleDashboardRedirect = () => {
    setProfileDropdownOpen(false);
    if (!currentUser) return;
    if (currentUser.role === 'admin') navigate('/admin');
    else if (currentUser.role === 'mentor') navigate('/mentor');
    else navigate('/student');
  };

  const handleNotificationClick = (id: string) => {
    markNotificationRead(id);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-xl shadow-md shadow-brand-blue/20">
              SB
            </div>
            <span className="text-xl font-bold font-display bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">
              SkillBridge
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-200 py-2 relative ${
                    isActive 
                      ? 'text-brand-blue dark:text-blue-400' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue dark:bg-blue-400 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions Panel */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Dark Mode Toggle */}
            <button
              id="dark-mode-toggle"
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications Dropdown */}
            {currentUser && (
              <div className="relative">
                <button
                  id="notifications-toggle"
                  onClick={() => {
                    setNotifDropdownOpen(!notifDropdownOpen);
                    setProfileDropdownOpen(false);
                  }}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-all relative"
                >
                  <Bell className="h-5 w-5" />
                  {activeNotifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border border-white dark:border-slate-950 animate-pulse" />
                  )}
                </button>

                <AnimatePresence>
                  {notifDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                        <span className="font-semibold text-sm">Notifications</span>
                        {activeNotifications.length > 0 && (
                          <span className="text-xs bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-medium px-2 py-0.5 rounded-full">
                            {activeNotifications.length} New
                          </span>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                        {activeNotifications.length === 0 ? (
                          <div className="p-6 text-center text-slate-400 dark:text-slate-500 text-xs">
                            No unread notifications.
                          </div>
                        ) : (
                          activeNotifications.map((notif) => (
                            <div 
                              key={notif.id} 
                              className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition cursor-pointer flex items-start space-x-3"
                              onClick={() => handleNotificationClick(notif.id)}
                            >
                              <div className="h-2 w-2 rounded-full bg-brand-blue mt-1.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{notif.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>
                                <span className="text-[10px] text-slate-400 mt-1 block">{notif.time}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Auth Buttons or Profile Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="profile-dropdown-toggle"
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setNotifDropdownOpen(false);
                  }}
                  className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all border border-slate-200/50 dark:border-slate-800/50"
                >
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 object-cover" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left hidden lg:block pr-1">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{currentUser.name}</p>
                    <p className="text-[10px] uppercase font-bold text-brand-purple dark:text-purple-400 tracking-wider leading-none mt-0.5">{currentUser.role}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-xl overflow-hidden z-50 divide-y divide-slate-100 dark:divide-slate-800"
                    >
                      <div className="p-4 flex items-center space-x-3 bg-slate-50 dark:bg-slate-950">
                        <img src={currentUser.avatar} alt="" className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 object-cover" referrerPolicy="no-referrer" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold truncate text-slate-800 dark:text-slate-200">{currentUser.name}</p>
                          <p className="text-xs text-slate-500 truncate dark:text-slate-400">{currentUser.email}</p>
                        </div>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={handleDashboardRedirect}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2"
                        >
                          <BookOpen className="h-4 w-4 text-brand-blue" />
                          <span>My Dashboard</span>
                        </button>
                        {currentUser.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2"
                          >
                            <Shield className="h-4 w-4 text-brand-purple" />
                            <span>Admin Portal</span>
                          </Link>
                        )}
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                            navigate('/login');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center space-x-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-gradient-to-r from-brand-blue to-brand-purple px-4 py-2.5 rounded-xl shadow-sm hover:opacity-90 transition active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex items-center md:hidden space-x-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-950 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-3">
                {currentUser ? (
                  <>
                    <div className="px-4 py-2 flex items-center space-x-3">
                      <img src={currentUser.avatar} alt="" className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{currentUser.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{currentUser.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleDashboardRedirect();
                      }}
                      className="w-full text-center block px-4 py-2.5 rounded-xl text-base font-semibold bg-slate-100 dark:bg-slate-900 hover:opacity-90 text-brand-blue"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full text-center block px-4 py-2.5 rounded-xl text-base font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3 px-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center block px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center block px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-95"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
