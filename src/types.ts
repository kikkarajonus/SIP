export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
}

export type UserRole = 'student' | 'mentor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  role: UserRole;
  avatar: string;
  bio: string;
  skills: string[];
  experience?: string;
  rating?: number;
  totalStudents?: number;
  socialLinks?: SocialLinks;
  enrolledCourses?: string[];
  wishlist?: string[];
  completedCourses?: string[];
}

export interface Mentor {
  id: string;
  name: string;
  email: string;
  avatar: string;
  skills: string[];
  bio: string;
  experience: string;
  rating: number;
  totalStudents: number;
  coursesCount: number;
  socialLinks?: SocialLinks;
}

export interface Video {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
}

export interface CourseModule {
  id: string;
  title: string;
  videos: string[]; // List of videoIds
}

export interface Course {
  id: string;
  courseName: string;
  description: string;
  mentorId: string;
  mentorName: string;
  rating: number;
  studentsEnrolled: number;
  duration: string;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  thumbnail: string;
  price: number;
  modules: CourseModule[];
}

export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string;
  maxPoints: number;
}

export interface Review {
  id: string;
  courseId: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  studentName: string;
  mentorName: string;
  issueDate: string;
  certificateId: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  role: UserRole;
}

export interface MentorRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  skills: string[];
  experience: string;
  proposedCourse: string;
  bio: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  courseId: string;
  courseName: string;
  studentId: string;
  studentName: string;
  submissionText: string;
  submissionUrl?: string;
  grade?: number;
  feedback?: string;
  status: 'submitted' | 'graded';
  date: string;
}

export interface StudentProgress {
  courseId: string;
  completedVideos: string[]; // List of videoIds
  progressPercentage: number; // e.g. 0 to 100
  completed: boolean;
}
