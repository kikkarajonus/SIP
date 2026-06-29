import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Star, Clock, Users, Award, Shield, Check, Lock, Play, 
  HelpCircle, ChevronDown, ChevronUp, MessageSquare, ArrowRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { courses, mentors, reviews, currentUser, enrollInCourse, videos } = useApp();
  
  const [openModuleId, setOpenModuleId] = useState<string | null>('m1');
  const [activeTab, setActiveTab] = useState<'syllabus' | 'mentor' | 'reviews'>('syllabus');

  // Load course details
  const course = courses.find((c) => c.id === id);
  if (!course) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold">Course Not Found</h2>
        <Link to="/courses" className="text-brand-blue font-semibold hover:underline">
          Back to Course Catalog
        </Link>
      </div>
    );
  }

  // Load mentor details
  const mentor = mentors.find((m) => m.id === course.mentorId);

  // Load reviews
  const courseReviews = reviews.filter((r) => r.courseId === course.id);

  const isEnrolled = currentUser?.enrolledCourses?.includes(course.id);

  const handleEnrollClick = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    enrollInCourse(course.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      
      {/* Breadcrumb */}
      <div className="text-xs text-slate-400 mb-4">
        <Link to="/courses" className="hover:text-slate-600">Courses</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-500 font-medium truncate">{course.courseName}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Course Main Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header titles */}
          <div className="space-y-4">
            <span className="inline-block text-xs font-bold bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full uppercase tracking-wider">
              {course.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white leading-tight">
              {course.courseName}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-4 items-center text-xs sm:text-sm text-slate-500 pt-1">
              <span className="flex items-center text-amber-500 font-bold">
                <Star className="h-4 w-4 fill-amber-500 mr-1" />
                {course.rating.toFixed(1)} ({courseReviews.length} reviews)
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {course.studentsEnrolled} enrolled
              </span>
              <span>•</span>
              <span>Created by <Link to={`/mentors/${course.mentorId}`} className="font-semibold text-brand-purple hover:underline">{course.mentorName}</Link></span>
            </div>
          </div>

          {/* Banner cover */}
          <div className="aspect-video w-full rounded-2xl overflow-hidden shadow bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-800">
            <img src={course.thumbnail} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>

          {/* Sub Navigation tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            {(['syllabus', 'mentor', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-6 text-sm font-semibold capitalize border-b-2 transition -mb-px ${
                  activeTab === tab 
                    ? 'border-brand-blue text-brand-blue dark:text-blue-400' 
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {tab === 'syllabus' ? 'Syllabus & Modules' : tab === 'mentor' ? 'Meet the Mentor' : 'Reviews'}
              </button>
            ))}
          </div>

          {/* Tab content renders */}
          <div className="py-2">
            {activeTab === 'syllabus' && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg mb-2">Course Curriculums</h3>
                <div className="space-y-3">
                  {course.modules.map((mod, index) => {
                    const isOpen = openModuleId === mod.id;
                    return (
                      <div key={mod.id} className="border border-slate-200/60 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                        <button
                          onClick={() => setOpenModuleId(isOpen ? null : mod.id)}
                          className="w-full flex items-center justify-between p-5 text-left font-semibold hover:bg-slate-50 dark:hover:bg-slate-850"
                        >
                          <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Module {index + 1}</p>
                            <h4 className="text-sm sm:text-base text-slate-800 dark:text-white">{mod.title}</h4>
                          </div>
                          {isOpen ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/25 px-5 py-3 divide-y divide-slate-100 dark:divide-slate-800/60"
                            >
                              {mod.videos.map((vidId) => {
                                const video = videos.find(v => v.id === vidId);
                                if (!video) return null;
                                return (
                                  <div key={vidId} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                                    <span className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                                      {isEnrolled ? (
                                        <Play className="h-4 w-4 text-brand-purple fill-brand-purple/20 flex-shrink-0" />
                                      ) : (
                                        <Lock className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                      )}
                                      <span className="font-medium">{video.title}</span>
                                    </span>
                                    <span className="text-xs text-slate-400 font-mono">{video.duration}</span>
                                  </div>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'mentor' && mentor && (
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <img src={mentor.avatar} alt="" className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800 border" referrerPolicy="no-referrer" />
                <div className="flex-1 space-y-2">
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">{mentor.name}</h3>
                  <p className="text-xs font-bold text-brand-purple">{mentor.experience} Experience</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{mentor.bio}</p>
                  <div className="pt-2 flex space-x-3 items-center">
                    <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded text-slate-600 dark:text-slate-300">
                      ★ {mentor.rating.toFixed(1)} Instructor Rating
                    </span>
                    <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded text-slate-600 dark:text-slate-300">
                      👥 {mentor.totalStudents} Students mentored
                    </span>
                  </div>
                  <div className="pt-3">
                    <Link to={`/mentors/${mentor.id}`} className="text-xs font-semibold text-brand-blue hover:underline flex items-center space-x-1">
                      <span>View Instructor Profile</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg mb-2">Student Feedback</h3>
                {courseReviews.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No reviews yet for this course. Be the first to share your thoughts!</p>
                ) : (
                  <div className="space-y-4">
                    {courseReviews.map((rev) => (
                      <div key={rev.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{rev.studentName}</span>
                          <span className="text-slate-400 font-mono">{rev.date}</span>
                        </div>
                        <div className="flex space-x-0.5">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          ))}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Checkout Pricing Widget */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-md space-y-6">
            
            <div className="text-left">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Tuition Cost</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold font-display">${course.price}</span>
                <span className="text-xs text-slate-400 line-through">$149.99</span>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">66% OFF</span>
              </div>
            </div>

            {/* Inclusions */}
            <div className="space-y-3.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Course Includes</p>
              <div className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-400">
                <Check className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0" />
                <span>{course.duration} on-demand video</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-400">
                <Check className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0" />
                <span>Graded Coding Assignments</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-400">
                <Check className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0" />
                <span>Direct Mentor Code Review</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-400">
                <Check className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0" />
                <span>Verifiable PDF Certificate</span>
              </div>
            </div>

            {/* Smart Action Button */}
            {isEnrolled ? (
              <Link
                to={`/student/learning/${course.id}`}
                className="w-full py-3.5 bg-gradient-to-r from-brand-purple to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/10 text-center block text-sm transition hover:opacity-90 active:scale-98"
              >
                Continue Learning
              </Link>
            ) : (
              <button
                onClick={handleEnrollClick}
                className="w-full py-3.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-2xl shadow-lg shadow-brand-blue/15 text-sm transition active:scale-95"
              >
                Enroll & Begin Learning
              </button>
            )}

            <p className="text-[10px] text-center text-slate-400">30-day money-back guarantee • Lifetime access</p>
          </div>
        </div>

      </div>

    </div>
  );
};
