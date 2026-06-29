import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, UserRole, Mentor, Course, Assignment, Review, 
  Certificate, Notification, MentorRequest, StudentSubmission, StudentProgress 
} from '../types';

import initialUsers from '../data/users.json';
import initialCourses from '../data/courses.json';
import initialMentors from '../data/mentors.json';
import initialAssignments from '../data/assignments.json';
import initialReviews from '../data/reviews.json';
import initialCertificates from '../data/certificates.json';
import initialNotifications from '../data/notifications.json';
import initialVideos from '../data/videos.json';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  courses: Course[];
  mentors: Mentor[];
  assignments: Assignment[];
  reviews: Review[];
  certificates: Certificate[];
  notifications: Notification[];
  mentorRequests: MentorRequest[];
  submissions: StudentSubmission[];
  progress: StudentProgress[];
  videos: any[];
  theme: 'light' | 'dark';
  
  // Auth Functions
  login: (email: string, password: string, role: UserRole) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string, role: UserRole) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  
  // Student Actions
  enrollInCourse: (courseId: string) => void;
  toggleWishlist: (courseId: string) => void;
  submitAssignment: (assignmentId: string, submissionText: string, submissionUrl?: string) => void;
  updateVideoProgress: (courseId: string, videoId: string, completed: boolean) => void;
  addReview: (courseId: string, rating: number, comment: string) => void;
  applyBecomeMentor: (data: { skills: string[]; experience: string; proposedCourse: string; bio: string }) => void;
  
  // Mentor Actions
  uploadCourse: (course: Omit<Course, 'id' | 'mentorId' | 'mentorName' | 'rating' | 'studentsEnrolled'>) => void;
  uploadVideo: (video: { id: string; title: string; duration: string; videoUrl: string }, courseId: string, moduleId: string) => void;
  gradeSubmission: (submissionId: string, grade: number, feedback: string) => void;
  
  // Admin Actions
  handleMentorRequest: (requestId: string, approve: boolean) => void;
  deleteCourse: (courseId: string) => void;
  deleteUser: (userId: string) => void;
  
  // General Utilities
  toggleDarkMode: () => void;
  markNotificationRead: (id: string) => void;
  addSystemNotification: (userId: string, title: string, message: string, role: UserRole) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sync states with LocalStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sb_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('sb_users');
    return saved ? JSON.parse(saved) : (initialUsers as User[]);
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('sb_courses');
    return saved ? JSON.parse(saved) : (initialCourses as Course[]);
  });

  const [mentors, setMentors] = useState<Mentor[]>(() => {
    const saved = localStorage.getItem('sb_mentors');
    return saved ? JSON.parse(saved) : (initialMentors as Mentor[]);
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('sb_assignments');
    return saved ? JSON.parse(saved) : (initialAssignments as Assignment[]);
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('sb_reviews');
    return saved ? JSON.parse(saved) : (initialReviews as Review[]);
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('sb_certificates');
    return saved ? JSON.parse(saved) : (initialCertificates as Certificate[]);
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('sb_notifications');
    return saved ? JSON.parse(saved) : (initialNotifications as Notification[]);
  });

  const [mentorRequests, setMentorRequests] = useState<MentorRequest[]>(() => {
    const saved = localStorage.getItem('sb_mentor_requests');
    if (saved) return JSON.parse(saved);
    
    // Add a default pending request for simulation purposes
    return [
      {
        id: "req-1",
        userId: "u-student-1",
        userName: "Jane Doe",
        userEmail: "student@skillbridge.com",
        skills: ["Next.js", "Tailwind CSS", "SEO"],
        experience: "2 Years",
        proposedCourse: "Next.js 14 Speedrun: Zero to Vercel Deploy",
        bio: "I finished the React & TypeScript Masterclass on SkillBridge and have built 5 production apps since then. Ready to teach!",
        status: "pending",
        date: "June 28, 2026"
      }
    ];
  });

  const [submissions, setSubmissions] = useState<StudentSubmission[]>(() => {
    const saved = localStorage.getItem('sb_submissions');
    if (saved) return JSON.parse(saved);
    
    // Default mock submission
    return [
      {
        id: "sub-1",
        assignmentId: "as-1",
        assignmentTitle: "Build a Generics-based Accordion",
        courseId: "course-1",
        courseName: "React & TypeScript Masterclass",
        studentId: "u-student-1",
        studentName: "Jane Doe",
        submissionText: "Hi Professor, here is my implementation of the Generic Accordion. I used motion for animations and generic React Props.",
        submissionUrl: "https://github.com/janedoe/react-accordion-ts",
        status: "submitted",
        date: "June 28, 2026"
      }
    ];
  });

  const [progress, setProgress] = useState<StudentProgress[]>(() => {
    const saved = localStorage.getItem('sb_progress');
    if (saved) return JSON.parse(saved);
    
    // Default mock student progress
    return [
      {
        courseId: "course-1",
        completedVideos: ["vid-1", "vid-2"],
        progressPercentage: 50,
        completed: false
      },
      {
        courseId: "course-3",
        completedVideos: [],
        progressPercentage: 0,
        completed: false
      }
    ];
  });

  const [videos, setVideos] = useState<any[]>(() => {
    const saved = localStorage.getItem('sb_videos');
    return saved ? JSON.parse(saved) : initialVideos;
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('sb_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  // Save changes to LocalStorage on modifications
  useEffect(() => {
    localStorage.setItem('sb_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('sb_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('sb_mentors', JSON.stringify(mentors));
  }, [mentors]);

  useEffect(() => {
    localStorage.setItem('sb_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('sb_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('sb_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('sb_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sb_mentor_requests', JSON.stringify(mentorRequests));
  }, [mentorRequests]);

  useEffect(() => {
    localStorage.setItem('sb_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('sb_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('sb_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('sb_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Auth Functions
  const login = (email: string, password: string, role: UserRole) => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!foundUser) {
      return { success: false, error: 'User with this email not found.' };
    }
    if (foundUser.password !== password) {
      return { success: false, error: 'Incorrect password.' };
    }
    if (foundUser.role !== role) {
      return { success: false, error: `User is not registered as a ${role}.` };
    }
    
    // Save current user
    setCurrentUser(foundUser);
    localStorage.setItem('sb_current_user', JSON.stringify(foundUser));
    
    addSystemNotification(
      foundUser.id, 
      "Login Successful", 
      `Welcome back, ${foundUser.name}! You have logged in as a ${role}.`, 
      role
    );
    
    return { success: true };
  };

  const register = (name: string, email: string, password: string, role: UserRole) => {
    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      name,
      email,
      password,
      role,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
      bio: `I am passionate about ${role === 'mentor' ? 'sharing my knowledge' : 'learning new technologies'} on SkillBridge!`,
      skills: [],
      enrolledCourses: [],
      wishlist: [],
      completedCourses: []
    };

    if (role === 'mentor') {
      newUser.experience = '1 Year';
      newUser.rating = 5.0;
      newUser.totalStudents = 0;
      newUser.socialLinks = { twitter: '', linkedin: '', github: '' };
    }

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    // If role is mentor, add to mentors list as well
    if (role === 'mentor') {
      const newMentor: Mentor = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        skills: newUser.skills,
        bio: newUser.bio,
        experience: newUser.experience,
        rating: newUser.rating,
        totalStudents: newUser.totalStudents,
        coursesCount: 0,
        socialLinks: newUser.socialLinks
      };
      setMentors([...mentors, newMentor]);
    }

    // Auto log in after registration
    setCurrentUser(newUser);
    localStorage.setItem('sb_current_user', JSON.stringify(newUser));

    addSystemNotification(
      newUser.id, 
      "Welcome to SkillBridge!", 
      `Account created successfully as ${role}!`, 
      role
    );

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sb_current_user');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...data };
    setCurrentUser(updatedUser);
    localStorage.setItem('sb_current_user', JSON.stringify(updatedUser));

    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...data } : u));
    
    if (currentUser.role === 'mentor') {
      setMentors(prev => prev.map(m => m.id === currentUser.id ? { 
        ...m, 
        name: data.name || m.name,
        avatar: data.avatar || m.avatar,
        skills: data.skills || m.skills,
        bio: data.bio || m.bio,
        socialLinks: data.socialLinks || m.socialLinks
      } : m));
    }
  };

  // Student Actions
  const enrollInCourse = (courseId: string) => {
    if (!currentUser) return;

    const alreadyEnrolled = currentUser.enrolledCourses?.includes(courseId);
    if (alreadyEnrolled) return;

    // Add to enrolledCourses
    const enrolled = currentUser.enrolledCourses || [];
    const updatedEnrolled = [...enrolled, courseId];
    updateProfile({ enrolledCourses: updatedEnrolled });

    // Initialize course progress
    if (!progress.some(p => p.courseId === courseId)) {
      const newProgress: StudentProgress = {
        courseId,
        completedVideos: [],
        progressPercentage: 0,
        completed: false
      };
      setProgress(prev => [...prev, newProgress]);
    }

    // Increment studentsEnrolled count in Course
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, studentsEnrolled: c.studentsEnrolled + 1 };
      }
      return c;
    }));

    addSystemNotification(
      currentUser.id,
      "Enrolled Successfully!",
      `You have successfully enrolled in ${courses.find(c => c.id === courseId)?.courseName}. Start learning now!`,
      "student"
    );
  };

  const toggleWishlist = (courseId: string) => {
    if (!currentUser) return;
    const wishlist = currentUser.wishlist || [];
    const exists = wishlist.includes(courseId);
    const updatedWishlist = exists 
      ? wishlist.filter(id => id !== courseId)
      : [...wishlist, courseId];

    updateProfile({ wishlist: updatedWishlist });
  };

  const submitAssignment = (assignmentId: string, submissionText: string, submissionUrl?: string) => {
    if (!currentUser) return;

    const assignment = assignments.find(as => as.id === assignmentId);
    if (!assignment) return;

    const newSubmission: StudentSubmission = {
      id: `sub-${Date.now()}`,
      assignmentId,
      assignmentTitle: assignment.title,
      courseId: assignment.courseId,
      courseName: assignment.courseName,
      studentId: currentUser.id,
      studentName: currentUser.name,
      submissionText,
      submissionUrl,
      status: 'submitted',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };

    setSubmissions(prev => [newSubmission, ...prev]);

    // Send notification to the mentor
    const course = courses.find(c => c.id === assignment.courseId);
    if (course) {
      addSystemNotification(
        course.mentorId,
        "Assignment Submission",
        `${currentUser.name} submitted work for '${assignment.title}'.`,
        "mentor"
      );
    }

    addSystemNotification(
      currentUser.id,
      "Assignment Submitted",
      `Your submission for '${assignment.title}' has been sent to your mentor.`,
      "student"
    );
  };

  const updateVideoProgress = (courseId: string, videoId: string, completed: boolean) => {
    if (!currentUser) return;

    setProgress(prev => {
      const courseProg = prev.find(p => p.courseId === courseId);
      
      const courseObj = courses.find(c => c.id === courseId);
      if (!courseObj) return prev;

      const totalVideosCount = courseObj.modules.reduce((sum, mod) => sum + mod.videos.length, 0);

      if (!courseProg) {
        const completedVideos = completed ? [videoId] : [];
        const progressPercentage = totalVideosCount > 0 ? Math.round((completedVideos.length / totalVideosCount) * 100) : 0;
        return [...prev, {
          courseId,
          completedVideos,
          progressPercentage,
          completed: progressPercentage === 100
        }];
      }

      let updatedCompletedVideos = [...courseProg.completedVideos];
      if (completed && !updatedCompletedVideos.includes(videoId)) {
        updatedCompletedVideos.push(videoId);
      } else if (!completed && updatedCompletedVideos.includes(videoId)) {
        updatedCompletedVideos = updatedCompletedVideos.filter(id => id !== videoId);
      }

      const progressPercentage = totalVideosCount > 0 
        ? Math.round((updatedCompletedVideos.length / totalVideosCount) * 100) 
        : 0;

      const isCompletedNow = progressPercentage === 100;

      // Handle certificate generation if fully completed!
      if (isCompletedNow && !courseProg.completed) {
        const hasCert = certificates.some(c => c.courseId === courseId && c.studentName === currentUser.name);
        if (!hasCert) {
          const newCert: Certificate = {
            id: `cert-${Date.now()}`,
            courseId,
            courseName: courseObj.courseName,
            studentName: currentUser.name,
            mentorName: courseObj.mentorName,
            issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            certificateId: `SB-${courseObj.id.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`
          };
          setCertificates(cPrev => [newCert, ...cPrev]);
          
          addSystemNotification(
            currentUser.id,
            "Certificate Unlocked! 🏆",
            `Congratulations! You completed '${courseObj.courseName}' and earned a Certificate of Completion!`,
            "student"
          );
        }
      }

      return prev.map(p => p.courseId === courseId ? {
        ...p,
        completedVideos: updatedCompletedVideos,
        progressPercentage,
        completed: isCompletedNow
      } : p);
    });
  };

  const addReview = (courseId: string, rating: number, comment: string) => {
    if (!currentUser) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      courseId,
      studentName: currentUser.name,
      rating,
      comment,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };

    setReviews(prev => [newReview, ...prev]);

    // Recalculate course average rating
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const courseReviews = reviews.filter(r => r.courseId === courseId).concat(newReview);
        const sum = courseReviews.reduce((s, r) => s + r.rating, 0);
        const avg = Math.round((sum / courseReviews.length) * 10) / 10;
        return { ...c, rating: avg };
      }
      return c;
    }));

    addSystemNotification(
      currentUser.id,
      "Review Submitted",
      "Thank you for sharing your feedback with the community!",
      "student"
    );
  };

  const applyBecomeMentor = (data: { skills: string[]; experience: string; proposedCourse: string; bio: string }) => {
    if (!currentUser) return;

    const newRequest: MentorRequest = {
      id: `req-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      skills: data.skills,
      experience: data.experience,
      proposedCourse: data.proposedCourse,
      bio: data.bio,
      status: 'pending',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };

    setMentorRequests(prev => [newRequest, ...prev]);

    addSystemNotification(
      currentUser.id,
      "Application Submitted",
      "Your application to become a mentor is pending Administrator approval.",
      "student"
    );

    // Notify admins
    users.filter(u => u.role === 'admin').forEach(admin => {
      addSystemNotification(
        admin.id,
        "New Mentor Request",
        `${currentUser.name} requested to become a mentor.`,
        "admin"
      );
    });
  };

  // Mentor Actions
  const uploadCourse = (courseData: Omit<Course, 'id' | 'mentorId' | 'mentorName' | 'rating' | 'studentsEnrolled'>) => {
    if (!currentUser || currentUser.role !== 'mentor') return;

    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
      mentorId: currentUser.id,
      mentorName: currentUser.name,
      rating: 5.0,
      studentsEnrolled: 0
    };

    setCourses(prev => [...prev, newCourse]);

    // Update mentor's courses count in Mentors
    setMentors(prev => prev.map(m => {
      if (m.id === currentUser.id) {
        return { ...m, coursesCount: m.coursesCount + 1 };
      }
      return m;
    }));

    addSystemNotification(
      currentUser.id,
      "Course Uploaded!",
      `Course '${courseData.courseName}' is live on the SkillBridge marketplace.`,
      "mentor"
    );
  };

  const uploadVideo = (videoData: { id: string; title: string; duration: string; videoUrl: string }, courseId: string, moduleId: string) => {
    // Add to main videos pool
    setVideos(prev => [...prev, videoData]);

    // Add video ID to course module
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const updatedModules = c.modules.map(mod => {
          if (mod.id === moduleId) {
            return { ...mod, videos: [...mod.videos, videoData.id] };
          }
          return mod;
        });
        return { ...c, modules: updatedModules };
      }
      return c;
    }));
  };

  const gradeSubmission = (submissionId: string, grade: number, feedback: string) => {
    if (!currentUser || currentUser.role !== 'mentor') return;

    setSubmissions(prev => prev.map(sub => {
      if (sub.id === submissionId) {
        const updatedSub: StudentSubmission = {
          ...sub,
          grade,
          feedback,
          status: 'graded'
        };

        // Notify student
        addSystemNotification(
          sub.studentId,
          "Assignment Graded!",
          `Your assignment '${sub.assignmentTitle}' was graded: ${grade}/100. Feedback: ${feedback}`,
          "student"
        );

        return updatedSub;
      }
      return sub;
    }));
  };

  // Admin Actions
  const handleMentorRequest = (requestId: string, approve: boolean) => {
    setMentorRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const status = approve ? 'approved' : 'rejected';
        
        if (approve) {
          // Promote student to mentor!
          setUsers(uPrev => uPrev.map(u => {
            if (u.id === req.userId) {
              return {
                ...u,
                role: 'mentor',
                skills: [...new Set([...u.skills, ...req.skills])],
                experience: req.experience,
                bio: req.bio,
                rating: 5.0,
                totalStudents: 0
              };
            }
            return u;
          }));

          // Add to Mentors list if not already there
          if (!mentors.some(m => m.id === req.userId)) {
            const newMentor: Mentor = {
              id: req.userId,
              name: req.userName,
              email: req.userEmail,
              avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(req.userName)}`,
              skills: req.skills,
              bio: req.bio,
              experience: req.experience,
              rating: 5.0,
              totalStudents: 0,
              coursesCount: 0
            };
            setMentors(mPrev => [...mPrev, newMentor]);
          }

          addSystemNotification(
            req.userId,
            "Congratulations! Application Approved 🌟",
            `You are now a certified Mentor on SkillBridge! Welcome to the faculty.`,
            "mentor"
          );
        } else {
          addSystemNotification(
            req.userId,
            "Application Status Update",
            `Your application to become a mentor was declined at this time. Feel free to reapply with updated skills.`,
            "student"
          );
        }

        return { ...req, status };
      }
      return req;
    }));
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    setMentors(prev => prev.filter(m => m.id !== userId));
  };

  // General Utilities
  const toggleDarkMode = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addSystemNotification = (userId: string, title: string, message: string, role: UserRole) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}-${Math.random()}`,
      userId,
      title,
      message,
      time: "Just now",
      read: false,
      role
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, courses, mentors, assignments, reviews, certificates,
      notifications, mentorRequests, submissions, progress, videos, theme,
      login, register, logout, updateProfile, enrollInCourse, toggleWishlist,
      submitAssignment, updateVideoProgress, addReview, applyBecomeMentor,
      uploadCourse, uploadVideo, gradeSubmission, handleMentorRequest,
      deleteCourse, deleteUser, toggleDarkMode, markNotificationRead, addSystemNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
