import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Course, CourseModule } from '../types';
import { Modal } from '../components/SharedComponents';
import categoriesData from '../data/categories.json';
import { 
  Award, BookOpen, Clock, Users, Shield, Plus, Check, Play, Upload, 
  Settings, User, Star, DollarSign, ListChecks, ArrowUpRight, ChevronRight, FileText
} from 'lucide-react';
import { motion } from 'motion/react';

interface MentorDashboardProps {
  activeTab: string;
}

export const MentorDashboardView: React.FC<MentorDashboardProps> = ({ activeTab }) => {
  const { 
    currentUser, courses, users, submissions, progress, mentors,
    uploadCourse, uploadVideo, gradeSubmission, updateProfile
  } = useApp();

  // Load active mentor's assets
  const mentorCourses = courses.filter((c) => c.mentorId === currentUser?.id);
  const mentorCourseIds = mentorCourses.map(c => c.id);

  // Load student lists enrolled in these courses
  const enrolledStudents = users.filter((u) => 
    u.role === 'student' && u.enrolledCourses?.some(cId => mentorCourseIds.includes(cId))
  );

  // Load assignment submissions on these courses
  const mentorSubmissions = submissions.filter((sub) => 
    mentorCourseIds.includes(sub.courseId)
  );

  // State for Upload Course
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState('49.99');
  const [newCourseCat, setNewCourseCat] = useState(categoriesData[0]?.name || 'Web Development');
  const [newCourseLevel, setNewCourseLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [newCourseThumb, setNewCourseThumb] = useState('https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=600');
  const [moduleTitle1, setModuleTitle1] = useState('Syllabus Foundations');
  const [courseCreatedMsg, setCourseCreatedMsg] = useState('');

  // State for Upload Video
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDuration, setVideoDuration] = useState('15:30');
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  const [targetCourseId, setTargetCourseId] = useState(mentorCourses[0]?.id || '');
  const [targetModuleId, setTargetModuleId] = useState('m1');
  const [videoCreatedMsg, setVideoCreatedMsg] = useState('');

  // Grading State
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [activeSubId, setActiveSubId] = useState<string | null>(null);
  const [pointsGrade, setPointsGrade] = useState('95');
  const [feedbackText, setFeedbackText] = useState('');

  // Profile Edit fields
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileBio, setProfileBio] = useState(currentUser?.bio || '');
  const [profileExp, setProfileExp] = useState(currentUser?.experience || '1 Year');
  const [twitterUrl, setTwitterUrl] = useState(currentUser?.socialLinks?.twitter || '');
  const [linkedinUrl, setLinkedinUrl] = useState(currentUser?.socialLinks?.linkedin || '');
  const [githubUrl, setGithubUrl] = useState(currentUser?.socialLinks?.github || '');
  const [profileMsg, setProfileMsg] = useState('');

  if (!currentUser) return null;

  // Overview Stats
  const totalStudentsCount = mentorCourses.reduce((sum, c) => sum + c.studentsEnrolled, 0);
  const pendingSubmissionsCount = mentorSubmissions.filter(sub => sub.status === 'submitted').length;

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCourseName && newCourseDesc) {
      const defaultModules: CourseModule[] = [
        {
          id: `m-${Date.now()}-1`,
          title: moduleTitle1 || 'Getting Started Intro',
          videos: []
        }
      ];

      uploadCourse({
        courseName: newCourseName,
        description: newCourseDesc,
        price: parseFloat(newCoursePrice) || 0,
        category: newCourseCat,
        difficultyLevel: newCourseLevel,
        thumbnail: newCourseThumb,
        modules: defaultModules
      });

      setCourseCreatedMsg('Course uploaded and live successfully!');
      
      // Reset
      setNewCourseName('');
      setNewCourseDesc('');
      setNewCoursePrice('49.99');
      
      setTimeout(() => setCourseCreatedMsg(''), 4000);
    }
  };

  const handleUploadVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (videoTitle && targetCourseId) {
      uploadVideo(
        {
          id: `vid-${Date.now()}`,
          title: videoTitle,
          duration: videoDuration,
          videoUrl: videoUrl
        },
        targetCourseId,
        targetModuleId
      );

      setVideoCreatedMsg(`Video successfully attached to course module!`);
      setVideoTitle('');
      setTimeout(() => setVideoCreatedMsg(''), 4000);
    }
  };

  const handleOpenGradeModal = (subId: string) => {
    setActiveSubId(subId);
    setPointsGrade('95');
    setFeedbackText('');
    setGradeModalOpen(true);
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSubId && pointsGrade) {
      gradeSubmission(activeSubId, parseInt(pointsGrade) || 0, feedbackText);
      setGradeModalOpen(false);
      setActiveSubId(null);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      bio: profileBio,
      experience: profileExp,
      socialLinks: {
        twitter: twitterUrl,
        linkedin: linkedinUrl,
        github: githubUrl
      }
    });
    setProfileMsg('Mentor profile details updated successfully!');
    setTimeout(() => setProfileMsg(''), 3000);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. OVERVIEW HUB */}
      {activeTab === 'overview' && (
        <div className="space-y-8 text-left">
          
          {/* Bento metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-brand-purple flex items-center justify-center mb-4">
                <BookOpen className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">{mentorCourses.length}</p>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Courses Instructed</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center mb-4">
                <Users className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">{totalStudentsCount}</p>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Total Students mentored</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mb-4">
                <Star className="h-5 w-5 fill-amber-500" />
              </div>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">4.9</p>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Average Rating</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mb-4">
                <ListChecks className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">{pendingSubmissionsCount}</p>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Pending reviews</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* SVG Bento Chart Column */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-base">Monthly Earnings & Engagement</h3>
                <p className="text-xs text-slate-400">Illustrative engagements across Q2 2026</p>
              </div>

              {/* Simulated Chart */}
              <div className="aspect-[2/1] w-full flex items-end justify-between px-4 pt-12 relative border-b border-l border-slate-100 dark:border-slate-800">
                <div className="absolute inset-x-0 top-1/2 border-t border-slate-100 dark:border-slate-800/50" />
                <div className="absolute inset-x-0 top-1/4 border-t border-slate-100 dark:border-slate-800/50" />
                
                {/* Columns */}
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, idx) => {
                  const heights = [40, 55, 30, 85, 75, 95];
                  const height = heights[idx];
                  return (
                    <div key={idx} className="flex flex-col items-center flex-1 space-y-2">
                      <div 
                        className="w-10 bg-gradient-to-t from-brand-blue to-brand-purple rounded-t-lg transition-all duration-500 hover:opacity-80 relative group"
                        style={{ height: `${height * 1.5}px` }}
                      >
                        <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">
                          ${height * 15}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">{month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Pending grading reviews list column */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-sm sm:text-base">Quick Tasks Queue</h3>
                <p className="text-xs text-slate-400">Items requiring grading reviews</p>
              </div>

              <div className="space-y-3.5 max-h-[300px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {mentorSubmissions.filter(s => s.status === 'submitted').length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4 text-center">Clean desk! No items in queue.</p>
                ) : (
                  mentorSubmissions.filter(s => s.status === 'submitted').map((sub) => (
                    <div key={sub.id} className="pt-3.5 flex justify-between items-start text-xs text-left">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-800 dark:text-slate-200">{sub.studentName}</p>
                        <p className="text-[10px] text-slate-400 max-w-[150px] truncate">{sub.assignmentTitle}</p>
                      </div>
                      <button
                        onClick={() => handleOpenGradeModal(sub.id)}
                        className="text-[10px] font-bold bg-brand-blue/5 hover:bg-brand-blue/10 text-brand-blue px-2 py-1 rounded-lg"
                      >
                        Review
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. MY COURSES VIEW */}
      {activeTab === 'courses' && (
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Active Courses Instructed</h2>
              <p className="text-xs text-slate-400 mt-1">Review student enrollments and structures of courses you host</p>
            </div>
          </div>

          {mentorCourses.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 text-center border rounded-2xl space-y-4">
              <p className="text-sm text-slate-400">No courses uploaded under your name yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mentorCourses.map((c) => (
                <div key={c.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 p-5 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <img src={c.thumbnail} alt="" className="aspect-video w-full object-cover rounded-xl bg-slate-100 dark:bg-slate-850" referrerPolicy="no-referrer" />
                    <span className="text-[9px] font-bold bg-purple-50 text-brand-purple px-2 py-0.5 rounded uppercase tracking-wider">{c.category}</span>
                    <h3 className="font-bold text-sm sm:text-base leading-snug line-clamp-2">{c.courseName}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-3 text-center">
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{c.studentsEnrolled}</p>
                      <p className="text-[9px] uppercase font-bold text-slate-400">Students</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">${c.price}</p>
                      <p className="text-[9px] uppercase font-bold text-slate-400">Pricing</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. UPLOAD COURSE VIEW */}
      {activeTab === 'upload-course' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm text-left max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-xl font-bold font-display">Create a New Curriculum</h2>
            <p className="text-xs text-slate-400 mt-1">Fill the details to launch a new peer course. Once created, it is immediately available in the marketplace!</p>
          </div>

          {courseCreatedMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 font-semibold text-xs rounded-xl text-center">
              {courseCreatedMsg}
            </div>
          )}

          <form onSubmit={handleCreateCourse} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Course Title *</label>
              <input
                type="text"
                required
                placeholder="Next.js 14 Speedrun: Zero to Production"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Course Syllabus Summary *</label>
              <textarea
                required
                rows={4}
                placeholder="Dive into advanced server actions, page router routing schemas, API optimization, and styling..."
                value={newCourseDesc}
                onChange={(e) => setNewCourseDesc(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm dark:text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Tuition Fee ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newCoursePrice}
                  onChange={(e) => setNewCoursePrice(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Category *</label>
                <select
                  value={newCourseCat}
                  onChange={(e) => setNewCourseCat(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm"
                >
                  {categoriesData.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Target Difficulty *</label>
                <select
                  value={newCourseLevel}
                  onChange={(e) => setNewCourseLevel(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Course Cover Image URL</label>
                <input
                  type="text"
                  required
                  value={newCourseThumb}
                  onChange={(e) => setNewCourseThumb(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Initial Module 1 Name</label>
                <input
                  type="text"
                  required
                  value={moduleTitle1}
                  onChange={(e) => setModuleTitle1(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl text-xs tracking-wider uppercase transition shadow-md shadow-brand-blue/15"
            >
              Launch Curriculum
            </button>
          </form>
        </div>
      )}

      {/* 4. UPLOAD VIDEOS VIEW */}
      {activeTab === 'upload-video' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm text-left max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-xl font-bold font-display">Attach Lecture Video</h2>
            <p className="text-xs text-slate-400 mt-1">Upload and link instructional pre-recorded mp4 streams to specific course modules</p>
          </div>

          {videoCreatedMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 font-semibold text-xs rounded-xl text-center">
              {videoCreatedMsg}
            </div>
          )}

          {mentorCourses.length === 0 ? (
            <p className="text-xs text-amber-500 italic">Please launch a course curriculum first before uploading lecture videos.</p>
          ) : (
            <form onSubmit={handleUploadVideoSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Target Course</label>
                  <select
                    value={targetCourseId}
                    onChange={(e) => {
                      setTargetCourseId(e.target.value);
                      // Auto-select first module of that course
                      const crs = courses.find(c => c.id === e.target.value);
                      if (crs && crs.modules.length > 0) {
                        setTargetModuleId(crs.modules[0].id);
                      }
                    }}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                  >
                    {mentorCourses.map(c => <option key={c.id} value={c.id}>{c.courseName}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Target Syllabus Module</label>
                  <select
                    value={targetModuleId}
                    onChange={(e) => setTargetModuleId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                  >
                    {courses.find(c => c.id === targetCourseId)?.modules.map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    )) || <option value="m1">Module 1 (Default)</option>}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Video Lecture Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lesson 3: Routing Patterns"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Video Duration (mm:ss) *</label>
                  <input
                    type="text"
                    required
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Video Source URL (MP4 stream) *</label>
                  <input
                    type="text"
                    required
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-purple hover:bg-brand-purple/90 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition"
              >
                Attach Video Lesson
              </button>
            </form>
          )}
        </div>
      )}

      {/* 5. ASSIGNMENTS / SUBMISSIONS MANAGEMENT VIEW */}
      {activeTab === 'assignments' && (
        <div className="space-y-6 text-left">
          <div>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Student Project Submissions</h2>
            <p className="text-xs text-slate-400 mt-1">Review student portfolio code repositories, run validations, and assign feedback</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {mentorSubmissions.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-12 text-center border rounded-2xl">
                <p className="text-sm text-slate-400">No active assignment submissions recorded for your courses.</p>
              </div>
            ) : (
              mentorSubmissions.map((sub) => {
                const isGraded = sub.status === 'graded';
                return (
                  <div 
                    key={sub.id}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple bg-purple-50 dark:bg-purple-950/40 px-2.5 py-0.5 rounded">
                          {sub.courseName}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {sub.assignmentTitle}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm sm:text-base">Submitted by: {sub.studentName}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 italic leading-relaxed">
                        "{sub.submissionText}"
                      </p>
                      {sub.submissionUrl && (
                        <a 
                          href={sub.submissionUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs text-brand-blue dark:text-blue-400 font-semibold hover:underline inline-flex items-center space-x-1"
                        >
                          <span>Review Code Repository</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      )}
                    </div>

                    <div className="flex-shrink-0 flex items-center space-x-3 self-end md:self-center">
                      {isGraded ? (
                        <div className="text-right">
                          <span className="inline-flex px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold border border-emerald-100">
                            Graded: {sub.grade}/100
                          </span>
                          {sub.feedback && <p className="text-[10px] text-slate-400 mt-1">Feedback: "{sub.feedback}"</p>}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenGradeModal(sub.id)}
                          className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-xs font-bold shadow-sm"
                        >
                          Grade Project
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* 6. STUDENTS DIRECTORY */}
      {activeTab === 'students' && (
        <div className="space-y-6 text-left">
          <div>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Active Learners Directory</h2>
            <p className="text-xs text-slate-400 mt-1">View personal summaries of students currently studying under your guidance</p>
          </div>

          {enrolledStudents.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No students currently enrolled in your courses.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledStudents.map((stud) => (
                <div 
                  key={stud.id}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl flex items-center space-x-4 shadow-sm"
                >
                  <img src={stud.avatar} alt="" className="h-12 w-12 rounded-full object-cover bg-slate-50" referrerPolicy="no-referrer" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white">{stud.name}</h3>
                    <p className="text-xs text-slate-400 truncate">{stud.email}</p>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-1">{stud.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. EARNINGS */}
      {activeTab === 'earnings' && (
        <div className="space-y-8 text-left">
          <div>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Earnings & Payouts</h2>
            <p className="text-xs text-slate-400 mt-1">Acquire and manage monthly course sale payouts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 border p-6 rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Wallet Balance</span>
              <p className="text-2xl font-bold font-display mt-1">${(totalStudentsCount * 49.99 * 0.7).toFixed(2)}</p>
              <p className="text-[10px] text-slate-400 mt-1">70% revenue splits share</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border p-6 rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Sales</span>
              <p className="text-2xl font-bold font-display mt-1">{totalStudentsCount}</p>
              <p className="text-[10px] text-slate-400 mt-1">Paid enrollments</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Next Payout Date</span>
                <p className="text-sm font-bold mt-1">July 10, 2026</p>
              </div>
              <button
                onClick={() => alert('Payout triggered! Funds are routed to your simulated bank routing balance.')}
                className="mt-4 w-full py-2 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-xs font-bold transition"
              >
                Trigger Bank Payout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm text-left max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-xl font-bold font-display">Instructor Profile Credentials</h2>
            <p className="text-xs text-slate-400 mt-1">Configure expertise descriptors, experience lengths, and social references</p>
          </div>

          {profileMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 font-semibold text-xs rounded-xl text-center">
              {profileMsg}
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Your Professional Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Teaching Experience</label>
                <input
                  type="text"
                  required
                  value={profileExp}
                  onChange={(e) => setProfileExp(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Biography</label>
              <textarea
                rows={4}
                required
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm resize-none"
              />
            </div>

            {/* Social Links */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Social Reference Portfolios</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Twitter</label>
                  <input
                    type="url"
                    placeholder="https://twitter.com/yourhandle"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">LinkedIn</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/yourhandle"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">GitHub</label>
                  <input
                    type="url"
                    placeholder="https://github.com/yourhandle"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl text-xs"
            >
              Update Credentials
            </button>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* GRADING MODAL */}
      {/* ============================================================== */}
      <Modal
        isOpen={gradeModalOpen}
        onClose={() => setGradeModalOpen(false)}
        title="Grade Assignment Submission"
      >
        <form onSubmit={handleGradeSubmit} className="space-y-5 text-left">
          <p className="text-xs text-slate-500">Assign final grades and code reviews. This will instantly push grade metrics into the Student's portal.</p>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase">Grade Points (Out of 100) *</label>
            <input
              type="number"
              min="0"
              max="100"
              required
              value={pointsGrade}
              onChange={(e) => setPointsGrade(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase">Instructor Code Review feedback *</label>
            <textarea
              required
              rows={4}
              placeholder="Excellent work! I love the generic prop typing. Keep optimizing custom hooks!"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-white resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl text-xs"
          >
            Assign Grade & Authorize
          </button>
        </form>
      </Modal>

    </div>
  );
};
