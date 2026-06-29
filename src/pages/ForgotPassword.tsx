import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSent(true);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-left relative">
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-brand-blue/5 rounded-full filter blur-[80px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-8 rounded-3xl shadow-xl"
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
            Reset Password
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Enter your email to receive recovery instructions.
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-4 py-6">
            <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Instructions Sent!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
              We have sent a simulator password recovery link to <strong>{email}</strong>. Check your inbox to complete.
            </p>
            <div className="pt-2">
              <Link to="/login" className="text-xs font-bold text-brand-blue hover:underline">
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Registered Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl text-sm transition"
            >
              Send Instructions
            </button>
          </form>
        )}

        {!sent && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link to="/login" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to login</span>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};
