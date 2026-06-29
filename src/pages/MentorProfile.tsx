import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CourseCard } from '../components/SharedComponents';
import { Star, Mail, Award, Globe, Users, BookOpen, Twitter, Linkedin, Github } from 'lucide-react';

export const MentorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { mentors, courses, reviews } = useApp();

  const mentor = mentors.find((m) => m.id === id);
  if (!mentor) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold">Mentor Not Found</h2>
        <Link to="/mentors" className="text-brand-blue font-semibold hover:underline">
          Back to Mentors Directory
        </Link>
      </div>
    );
  }

  // Load courses taught by this mentor
  const mentorCourses = courses.filter((c) => c.mentorId === mentor.id);

  // Load reviews on mentor's courses
  const mentorReviews = reviews.filter((r) => mentorCourses.some(c => c.id === r.courseId));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left space-y-10">
      
      {/* Breadcrumb */}
      <div className="text-xs text-slate-400">
        <Link to="/mentors" className="hover:text-slate-600">Mentors</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-500 font-medium">{mentor.name}</span>
      </div>

      {/* Profile Header Hero */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Avatar */}
        <div className="md:col-span-3 flex flex-col items-center text-center">
          <img src={mentor.avatar} alt="" className="h-32 w-32 rounded-3xl object-cover bg-slate-50 dark:bg-slate-800 border-2 border-brand-purple/20" referrerPolicy="no-referrer" />
          
          <div className="flex space-x-3.5 mt-5">
            <a href={mentor.socialLinks?.twitter || '#'} className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-400 hover:text-brand-blue rounded-xl transition">
              <Twitter className="h-5 w-5" />
            </a>
            <a href={mentor.socialLinks?.linkedin || '#'} className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-400 hover:text-brand-blue rounded-xl transition">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href={mentor.socialLinks?.github || '#'} className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-400 hover:text-brand-blue rounded-xl transition">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Content details */}
        <div className="md:col-span-9 space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-purple bg-purple-50 dark:bg-purple-950/30 px-3 py-1 rounded-full">
              {mentor.experience} Experience
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white mt-2">
              {mentor.name}
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center">
              <Mail className="h-3.5 w-3.5 mr-1" />
              <span>{mentor.email}</span>
            </p>
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {mentor.bio}
          </p>

          {/* Statistics widgets */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/85">
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-xl font-bold font-display text-slate-800 dark:text-white">★ {mentor.rating.toFixed(1)}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Rating</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-xl font-bold font-display text-slate-800 dark:text-white">{mentor.totalStudents}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Students</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800 col-span-2 sm:col-span-1">
              <p className="text-xl font-bold font-display text-slate-800 dark:text-white">{mentorCourses.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Courses</p>
            </div>
          </div>

          {/* Skills */}
          <div className="pt-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Expertise</p>
            <div className="flex flex-wrap gap-2">
              {mentor.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Courses Taught Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Courses Instructed</h2>
          <p className="text-xs text-slate-400 mt-1">Acquire professional qualifications structured by {mentor.name}</p>
        </div>

        {mentorCourses.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No courses currently live for this mentor.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentorCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
