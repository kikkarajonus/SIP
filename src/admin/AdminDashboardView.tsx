import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  Users, Award, BookOpen, Clock, Shield, Check, Trash2, 
  Search, ShieldAlert, BadgeCheck, FileText, XCircle
} from 'lucide-react';

interface AdminDashboardProps {
  activeTab: string;
}

export const AdminDashboardView: React.FC<AdminDashboardProps> = ({ activeTab }) => {
  const { 
    users, courses, mentors, mentorRequests, deleteUser, changeUserRole, 
    approveMentorRequest, rejectMentorRequest, setCourses
  } = useApp();

  const [userSearch, setUserSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');

  // Filtering users
  const filteredUsers = users.filter((u) => {
    return u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
           u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
           u.role.toLowerCase().includes(userSearch.toLowerCase());
  });

  // Filtering courses
  const filteredCourses = courses.filter((c) => {
    return c.courseName.toLowerCase().includes(courseSearch.toLowerCase()) ||
           c.mentorName.toLowerCase().includes(courseSearch.toLowerCase());
  });

  // Master stats
  const studentsCount = users.filter(u => u.role === 'student').length;
  const mentorsCount = users.filter(u => u.role === 'mentor').length;
  const pendingRequestsCount = mentorRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-8">
      
      {/* 1. OVERVIEW VIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 text-left">
          
          {/* Admin Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center mb-4">
                <Users className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">{users.length}</p>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Total Users</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-brand-purple flex items-center justify-center mb-4">
                <Award className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">{mentorsCount}</p>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Approved Mentors</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mb-4">
                <BookOpen className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">{courses.length}</p>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Live Curriculums</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mb-4">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">{pendingRequestsCount}</p>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Application Queue</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* User demographics circle */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-base">Academy Role Distribution</h3>
                <p className="text-xs text-slate-400">Total verified members registered by role</p>
              </div>

              <div className="flex items-center justify-around py-4">
                {/* Simulated donut indicator */}
                <div className="h-32 w-32 border-[16px] border-slate-100 dark:border-slate-800 rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-0 border-[16px] border-transparent border-t-brand-blue border-r-brand-purple rounded-full animate-pulse" />
                  <p className="text-center font-display">
                    <span className="text-xl font-bold text-slate-800 dark:text-white">{users.length}</span> <br />
                    <span className="text-[9px] uppercase text-slate-400 font-bold">Members</span>
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="h-3 w-3 rounded-full bg-brand-blue" />
                    <span className="text-slate-500 font-medium">Students:</span>
                    <span className="font-bold">{studentsCount}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="h-3 w-3 rounded-full bg-brand-purple" />
                    <span className="text-slate-500 font-medium">Mentors:</span>
                    <span className="font-bold">{mentorsCount}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="h-3 w-3 rounded-full bg-slate-400" />
                    <span className="text-slate-500 font-medium">Admins:</span>
                    <span className="font-bold">{users.filter(u => u.role === 'admin').length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Audit Logs */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-base">System Telemetry Log</h3>
                <p className="text-xs text-slate-400">Security audits and credentials events</p>
              </div>

              <div className="space-y-3 max-h-[160px] overflow-y-auto text-xs font-mono text-slate-400">
                <p>• [SYSTEM] Core modules running successfully on proxy</p>
                <p>• [AUTH] Active local session restored for user</p>
                <p>• [STORAGE] Sync completed on {users.length} user files</p>
                <p>• [MODERATION] 0 course reports flagged this period</p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. USERS MANAGEMENT VIEW */}
      {activeTab === 'users' && (
        <div className="space-y-6 text-left">
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Registered Users Directory</h2>
              <p className="text-xs text-slate-400 mt-1">Manage registration credentials, update academy roles, or purge stale files</p>
            </div>
            
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[600px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-[10px] font-bold uppercase text-slate-400 border-b">
                  <th className="p-4">Member Name</th>
                  <th className="p-4">Email Reference</th>
                  <th className="p-4">System Role</th>
                  <th className="p-4 text-center">Manage Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850">
                    <td className="p-4 flex items-center space-x-3">
                      <img src={u.avatar} alt="" className="h-8 w-8 rounded-full object-cover bg-slate-100" referrerPolicy="no-referrer" />
                      <span className="font-bold text-slate-800 dark:text-slate-200">{u.name}</span>
                    </td>
                    <td className="p-4 font-mono text-slate-500">{u.email}</td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => changeUserRole(u.id, e.target.value as UserRole)}
                        disabled={u.email === 'admin@skillbridge.com'} // Lock master admin
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded border font-semibold text-[11px] uppercase tracking-wider"
                      >
                        <option value="student">Student</option>
                        <option value="mentor">Mentor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          if (u.email === 'admin@skillbridge.com') return;
                          if (confirm(`Purge user account for ${u.name}? This is irreversible.`)) {
                            deleteUser(u.id);
                          }
                        }}
                        disabled={u.email === 'admin@skillbridge.com'}
                        className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition disabled:opacity-30"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 3. CERTIFIED MENTORS VIEW */}
      {activeTab === 'mentors' && (
        <div className="space-y-6 text-left">
          <div>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Certified Peer Mentors</h2>
            <p className="text-xs text-slate-400 mt-1">Review approved educators offering personalized curriculums and reviews</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((m) => (
              <div key={m.id} className="bg-white dark:bg-slate-900 border p-5 rounded-2xl shadow-sm flex items-start space-x-4">
                <img src={m.avatar} alt="" className="h-12 w-12 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center">
                    <span>{m.name}</span>
                    <BadgeCheck className="h-4.5 w-4.5 text-brand-blue ml-1" />
                  </h3>
                  <p className="text-xs text-brand-purple font-semibold">{m.experience} Experience</p>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. COURSES VIEW */}
      {activeTab === 'courses' && (
        <div className="space-y-6 text-left">
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Curriculum Registry Directory</h2>
              <p className="text-xs text-slate-400 mt-1">Audit active classes, moderate pricing structures, or delete spam</p>
            </div>
            
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search course title..."
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[600px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-[10px] font-bold uppercase text-slate-400 border-b">
                  <th className="p-4">Course Details</th>
                  <th className="p-4">Host Mentor</th>
                  <th className="p-4">Market Price</th>
                  <th className="p-4 text-center">Enrolled</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850">
                    <td className="p-4 flex items-center space-x-3">
                      <img src={c.thumbnail} alt="" className="h-8 w-12 rounded object-cover" referrerPolicy="no-referrer" />
                      <span className="font-bold text-slate-800 dark:text-slate-200">{c.courseName}</span>
                    </td>
                    <td className="p-4 font-semibold text-brand-purple">{c.mentorName}</td>
                    <td className="p-4 font-mono">
                      <input
                        type="number"
                        step="0.1"
                        value={c.price}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setCourses(courses.map(crs => crs.id === c.id ? { ...crs, price: val } : crs));
                        }}
                        className="w-20 px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800 border rounded font-bold"
                      />
                    </td>
                    <td className="p-4 text-center font-bold text-slate-500">{c.studentsEnrolled}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          if (confirm(`Completely remove course "${c.courseName}"?`)) {
                            setCourses(courses.filter(crs => crs.id !== c.id));
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition"
                        title="Delete Course"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 5. MENTOR APPLICATIONS VIEW */}
      {activeTab === 'mentor-requests' && (
        <div className="space-y-6 text-left">
          <div>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Peer Mentor Applications Board</h2>
            <p className="text-xs text-slate-400 mt-1">Approve or reject student requests seeking formal platform teaching credentials</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {mentorRequests.filter(r => r.status === 'pending').length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border p-12 text-center rounded-2xl">
                <p className="text-sm text-slate-400">Application board is currently empty. No active requests.</p>
              </div>
            ) : (
              mentorRequests
                .filter(r => r.status === 'pending')
                .map((req) => (
                  <div 
                    key={req.id}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded">
                          {req.experience} Experience
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Proposed: {req.proposedCourse}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-800 dark:text-white">Candidate: {req.studentName}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl italic leading-relaxed border border-slate-100">
                        "{req.bio}"
                      </p>
                      
                      {/* Skills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {req.skills.map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex-shrink-0 flex items-center space-x-3 self-end md:self-center">
                      <button
                        onClick={() => rejectMentorRequest(req.id)}
                        className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition"
                        title="Reject Candidate"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => approveMentorRequest(req.id)}
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition flex items-center space-x-1"
                      >
                        <Check className="h-4 w-4" />
                        <span>Authorize Mentor</span>
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>

        </div>
      )}

    </div>
  );
};
