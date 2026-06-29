import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Course, Mentor } from '../types';
import { 
  Star, Clock, Award, Users, ChevronRight, 
  BookOpen, Eye, ArrowRight, Heart, Sparkles, Check
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

// CourseCard
interface CourseCardProps {
  course: Course;
  isWishlisted?: boolean;
  progressPercentage?: number;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, progressPercentage }) => {
  const { currentUser, enrollInCourse, toggleWishlist } = useApp();
  const navigate = useNavigate();
  const isEnrolled = currentUser?.enrolledCourses?.includes(course.id);
  const isWishlisted = currentUser?.wishlist?.includes(course.id);

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    enrollInCourse(course.id);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    toggleWishlist(course.id);
  };

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all flex flex-col h-full relative"
    >
      {/* Category Badge */}
      <span className="absolute top-3 left-3 z-10 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-900/80 text-white backdrop-blur-sm">
        {course.category}
      </span>

      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img 
          src={course.thumbnail} 
          alt={course.courseName} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          referrerPolicy="no-referrer"
        />
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 dark:bg-slate-950/80 hover:bg-white dark:hover:bg-slate-900 text-slate-400 hover:text-red-500 shadow-sm transition-all"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">{course.mentorName}</span>
          <span>•</span>
          <span className="flex items-center text-amber-500 font-bold">
            <Star className="h-3 w-3 fill-amber-500 mr-0.5" />
            {course.rating.toFixed(1)}
          </span>
        </div>

        <Link to={`/courses/${course.id}`} className="block flex-1">
          <h3 className="font-display font-bold text-base text-slate-800 dark:text-white hover:text-brand-blue dark:hover:text-blue-400 transition leading-snug mb-2 line-clamp-2">
            {course.courseName}
          </h3>
        </Link>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 py-3 border-t border-slate-100 dark:border-slate-800/80 mt-auto">
          <span className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {course.duration}
          </span>
          <span className="flex items-center">
            <Users className="h-3.5 w-3.5 mr-1" />
            {course.studentsEnrolled} enrolled
          </span>
          <span className="font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {course.difficultyLevel}
          </span>
        </div>

        {/* Progress bar if student is enrolled */}
        {isEnrolled && progressPercentage !== undefined && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-500">Learning Progress</span>
              <span className="text-brand-purple">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-brand-blue to-brand-purple h-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-800 dark:text-white">
            ${course.price.toFixed(2)}
          </span>
          {isEnrolled ? (
            <Link
              to={`/student/learning/${course.id}`}
              className="text-xs font-semibold text-brand-purple dark:text-purple-400 hover:underline flex items-center space-x-1"
            >
              <span>Continue Learning</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          ) : (
            <button
              onClick={handleEnrollClick}
              className="text-xs font-semibold bg-brand-blue hover:bg-brand-blue/90 text-white px-4 py-2 rounded-xl shadow-sm transition active:scale-95"
            >
              Enroll Now
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// MentorCard
interface MentorCardProps {
  mentor: Mentor;
}

export const MentorCard: React.FC<MentorCardProps> = ({ mentor }) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center h-full"
    >
      <img 
        src={mentor.avatar} 
        alt={mentor.name} 
        className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 object-cover mb-4 border border-brand-purple/20" 
        referrerPolicy="no-referrer"
      />
      <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white leading-tight mb-1">
        {mentor.name}
      </h3>
      <p className="text-xs text-slate-400 mb-3">{mentor.experience} Experience</p>
      
      {/* Bio */}
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
        {mentor.bio}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 justify-center mb-5 flex-1">
        {mentor.skills.slice(0, 3).map((skill, index) => (
          <span 
            key={index} 
            className="text-[10px] font-bold bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full border border-slate-100 dark:border-slate-800"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-white">{mentor.rating.toFixed(1)}</p>
          <p className="text-[10px] uppercase font-bold text-slate-400">Rating</p>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-white">{mentor.totalStudents}</p>
          <p className="text-[10px] uppercase font-bold text-slate-400">Students</p>
        </div>
      </div>

      <Link
        to={`/mentors/${mentor.id}`}
        className="w-full text-center mt-5 text-xs font-semibold bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 py-2.5 rounded-xl transition"
      >
        View Profile
      </Link>
    </motion.div>
  );
};

// CategoryCard
interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: string;
    coursesCount: number;
    color: string;
  };
}

import * as Icons from 'lucide-react';

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  // Dynamically resolve lucide icons
  const IconComponent = (Icons as any)[category.icon] || Icons.BookOpen;

  return (
    <Link to={`/courses?category=${encodeURIComponent(category.name)}`}>
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center space-x-4 h-full"
      >
        <div className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${category.color} flex items-center justify-center text-white`}>
          <IconComponent className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-display font-semibold text-sm text-slate-800 dark:text-white">
            {category.name}
          </h4>
          <p className="text-xs text-slate-400 mt-1">{category.coursesCount} Courses</p>
        </div>
      </motion.div>
    </Link>
  );
};

// LoadingSkeleton
export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm animate-pulse p-4">
      <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800 rounded-xl mb-4" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-2" />
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-4" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full mb-2" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
    </div>
  );
};

// Toast
interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`fixed bottom-5 right-5 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
        type === 'success' 
          ? 'bg-emerald-50 text-emerald-800 border-emerald-100 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/50'
          : type === 'error'
          ? 'bg-red-50 text-red-800 border-red-100 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800/50'
          : 'bg-slate-50 text-slate-800 border-slate-100 dark:bg-slate-900/80 dark:text-slate-300 dark:border-slate-800/50'
      }`}
    >
      <Check className="h-4 w-4" />
      <span>{message}</span>
    </motion.div>
  );
};

// Modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl"
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Icons.X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
