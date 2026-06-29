import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Shield, Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, currentUser } = useApp();
  const [searchParams] = useSearchParams();

  const [role, setRole] = useState<UserRole>((searchParams.get('role') as UserRole) || 'student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill credentials based on selected role for standard testing
  useEffect(() => {
    if (role === 'student') {
      setEmail('student@skillbridge.com');
      setPassword('password123');
    } else if (role === 'mentor') {
      setEmail('mentor@skillbridge.com');
      setPassword('password123');
    } else if (role === 'admin') {
      setEmail('admin@skillbridge.com');
      setPassword('password123');
    }
    setError('');
  }, [role]);

  // If already logged in, redirect to correct workspace
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') navigate('/admin');
      else if (currentUser.role === 'mentor') navigate('/mentor');
      else navigate('/student');
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill out all credentials.');
      return;
    }

    const result = login(email, password, role);
    if (!result.success) {
      setError(result.error || 'Login failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-left relative">
      {/* Glow shapes */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-brand-blue/5 rounded-full filter blur-[80px] -z-10" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-brand-purple/5 rounded-full filter blur-[80px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-8 rounded-3xl shadow-xl"
      >
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple items-center justify-center text-white font-bold text-xl mb-2">
            SB
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            Welcome Back!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Sign in to access your customized workspaces.
          </p>
        </div>

        {/* Role Tab Selector */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200/40 dark:border-slate-800/60">
          {(['student', 'mentor', 'admin'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`py-2 text-xs font-bold rounded-xl uppercase tracking-wider transition ${
                role === r 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-slate-700/50' 
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Info Banner for mock details */}
        <div className="p-3 bg-brand-blue/5 dark:bg-blue-950/20 border border-brand-blue/15 dark:border-blue-900/40 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed flex items-start space-x-2">
          <Sparkles className="h-4 w-4 text-brand-blue mt-0.5 flex-shrink-0" />
          <span>
            <strong>Testing Tip:</strong> We have pre-loaded default credentials for this <strong>{role}</strong> simulation. Click Sign In below to enter instantly!
          </span>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-xs text-red-600 dark:text-red-400 font-semibold rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Password</label>
              <Link to="/forgot-password" className="text-xs font-semibold text-brand-purple hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl text-sm transition shadow-md shadow-brand-blue/15 flex items-center justify-center space-x-2 active:scale-95"
          >
            <span>Sign In as {role}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
          <span>Don't have an account? </span>
          <Link to={`/register?role=${role}`} className="font-bold text-brand-blue hover:underline">
            Register now
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
