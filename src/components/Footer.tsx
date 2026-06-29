import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Twitter, Linkedin, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-lg">
                SB
              </div>
              <span className="text-lg font-bold font-display text-white">
                SkillBridge
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              SkillBridge is a peer learning platform where students can learn new skills from mentors and, after gaining expertise, become mentors themselves to teach other students.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-white transition" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Platform</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/courses" className="hover:text-white transition">Explore Courses</Link>
              </li>
              <li>
                <Link to="/mentors" className="hover:text-white transition">Top Mentors</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">How it Works</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Community & Roles */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Roles</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/register?role=student" className="hover:text-white transition">Join as Student</Link>
              </li>
              <li>
                <Link to="/register?role=mentor" className="hover:text-white transition">Become a Mentor</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">User Login</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">Help & Support</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
                <span>100 Innovation Way, Suite 400, San Francisco, CA 94107</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-slate-500 flex-shrink-0" />
                <span>support@skillbridge.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-slate-500 flex-shrink-0" />
                <span>+1 (555) 234-5678</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p>© 2026 SkillBridge Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Use</a>
            <a href="#" className="hover:text-white transition">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
