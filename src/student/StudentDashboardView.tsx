import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CourseCard, Modal } from '../components/SharedComponents';
import { 
  Award, BookOpen, Clock, CheckSquare, Heart, User, Check, Play, 
  Send, ExternalLink, Calendar, Plus, ChevronRight, BookOpenCheck, Settings, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudentDashboardProps {
  activeTab: string;
}

export const StudentDashboardView: React.FC<StudentDashboardProps> = ({ activeTab }) => {
  const { 
    currentUser, courses, progress, assignments, submissions, 
    certificates, updateProfile, submitAssignment, updateVideoProgress, videos, addReview
  } = useApp();

  const { courseId } = useParams<{ courseId?: string }>();
  const [selectedLearningCourse, setSelectedLearningCourse] = useState<string | null>(courseId || null);

  useEffect(() => {
    if (courseId) {
      setSelectedLearningCourse(courseId);
    }
  }, [courseId]);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  
  // Modals state
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');

  const [certModalOpen, setCertModalOpen] = useState(false);
  const [activeCert, setActiveCert] = useState<any | null>(null);

  // Profile Edit fields
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileBio, setProfileBio] = useState(currentUser?.bio || '');
  const [profileSkill, setProfileSkill] = useState('');
  const [profileMsg, setProfileMsg] = useState('');

  // Become a Mentor Form state
  const [mentorSkills, setMentorSkills] = useState('');
  const [mentorExperience, setMentorExperience] = useState('1 Year');
  const [mentorProposedCourse, setMentorProposedCourse] = useState('');
  const [mentorBio, setMentorBio] = useState('');
  const [mentorRequestSent, setMentorRequestSent] = useState(false);

  const { applyBecomeMentor } = useApp();

  if (!currentUser) return null;

  // Derive relevant stats
  const enrolledIds = currentUser.enrolledCourses || [];
  const studentCourses = courses.filter((c) => enrolledIds.includes(c.id));
  const wishlistCourses = courses.filter((c) => (currentUser.wishlist || []).includes(c.id));
  const earnedCerts = certificates.filter((c) => c.studentName === currentUser.name);
  const pendingAssignments = assignments.filter((as) => enrolledIds.includes(as.courseId) && !submissions.some(sub => sub.assignmentId === as.id && sub.studentId === currentUser.id));

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      bio: profileBio
    });
    setProfileMsg('Profile updated successfully!');
    setTimeout(() => setProfileMsg(''), 3000);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileSkill.trim() && !currentUser.skills.includes(profileSkill.trim())) {
      const updatedSkills = [...currentUser.skills, profileSkill.trim()];
      updateProfile({ skills: updatedSkills });
      setProfileSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const updatedSkills = currentUser.skills.filter(s => s !== skill);
    updateProfile({ skills: updatedSkills });
  };

  const handleBecomeMentorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mentorProposedCourse && mentorBio) {
      applyBecomeMentor({
        skills: mentorSkills.split(',').map(s => s.trim()).filter(Boolean),
        experience: mentorExperience,
        proposedCourse: mentorProposedCourse,
        bio: mentorBio
      });
      setMentorRequestSent(true);
    }
  };

  const handleOpenAssignment = (asId: string) => {
    setActiveAssignmentId(asId);
    setSubmissionText('');
    setSubmissionUrl('');
    setAssignmentModalOpen(true);
  };

  const handleSubmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeAssignmentId && submissionText) {
      submitAssignment(activeAssignmentId, submissionText, submissionUrl);
      setAssignmentModalOpen(false);
      setActiveAssignmentId(null);
    }
  };

  const handleOpenCert = (cert: any) => {
    setActiveCert(cert);
    setCertModalOpen(true);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. OVERVIEW VIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 text-left">
          
          {/* Headline Greeting Card */}
          <div className="bg-gradient-to-r from-brand-blue/10 via-indigo-500/5 to-brand-purple/10 border border-slate-200/50 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs uppercase font-bold text-brand-purple tracking-widest block">Active Progress Hub</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-800 dark:text-white leading-tight">
                Hey, {currentUser.name}! 👋
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md leading-relaxed">
                You've earned <strong>{earnedCerts.length} certificates</strong> so far. Keep pushing your skills to reach new milestones!
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  // Direct link or trigger
                  const firstEnrolled = studentCourses[0];
                  if (firstEnrolled) {
                    setSelectedLearningCourse(firstEnrolled.id);
                  }
                }}
                className="px-5 py-3 bg-brand-blue hover:bg-brand-blue/95 text-white rounded-xl text-xs font-bold shadow-md transition"
              >
                Continue Learning
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center mb-4">
                <BookOpen className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">{studentCourses.length}</p>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Enrolled Courses</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mb-4">
                <Award className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">{earnedCerts.length}</p>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Certificates Earned</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mb-4">
                <CheckSquare className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">{pendingAssignments.length}</p>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Pending Assignments</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mb-4">
                <Heart className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">{wishlistCourses.length}</p>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Wishlist Items</p>
            </div>
          </div>

          {/* Recently Accessed Courses */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg font-display text-slate-800 dark:text-white">Your Learning Catalog</h3>
            {studentCourses.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-12 text-center border rounded-2xl space-y-4">
                <p className="text-sm text-slate-400">You are not enrolled in any courses yet.</p>
                <Link to="/courses" className="px-4 py-2 bg-brand-blue text-white rounded-xl text-xs font-bold inline-block">
                  Browse Course Catalog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {studentCourses.map((c) => {
                  const courseProgressObj = progress.find(p => p.courseId === c.id);
                  const progressPct = courseProgressObj ? courseProgressObj.progressPercentage : 0;
                  return (
                    <div 
                      key={c.id}
                      className="bg-white dark:bg-slate-900 border rounded-2xl p-5 flex items-center space-x-4 shadow-sm"
                    >
                      <img src={c.thumbnail} alt="" className="h-16 w-24 rounded-lg object-cover bg-slate-100 dark:bg-slate-800" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">{c.courseName}</h4>
                        <p className="text-xs text-slate-400">Mentor: {c.mentorName}</p>
                        {/* Progress */}
                        <div className="pt-2">
                          <div className="flex justify-between text-[10px] font-bold mb-1">
                            <span className="text-slate-400">Course Progress</span>
                            <span className="text-brand-blue">{progressPct}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-brand-blue h-full" style={{ width: `${progressPct}%` }} />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedLearningCourse(c.id)}
                        className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-brand-blue/10 hover:text-brand-blue rounded-xl transition"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* 2. MY COURSES / LEARNING PORTAL VIEW */}
      {activeTab === 'courses' && (
        <div className="space-y-6 text-left">
          
          {selectedLearningCourse ? (
            /* ACTIVE VIDEO LEARNING SCREEN */
            <div className="space-y-6">
              
              <button 
                onClick={() => { setSelectedLearningCourse(null); setSelectedVideoUrl(null); }}
                className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                <ArrowRight className="h-3.5 w-3.5 transform rotate-180" />
                <span>Back to My Courses</span>
              </button>

              {(() => {
                const activeCourse = courses.find(c => c.id === selectedLearningCourse);
                if (!activeCourse) return null;

                const courseProg = progress.find(p => p.courseId === activeCourse.id);
                const progressPct = courseProg ? courseProg.progressPercentage : 0;
                
                // Collect all videos from all modules
                const allVideosList = activeCourse.modules.reduce((acc, mod) => {
                  mod.videos.forEach(vidId => {
                    const videoObj = videos.find(v => v.id === vidId);
                    if (videoObj) acc.push({ ...videoObj, moduleId: mod.id });
                  });
                  return acc;
                }, [] as any[]);

                // Determine active playing video
                const defaultVideo = allVideosList[0];
                const activeVideoIdToUse = selectedVideoId || defaultVideo?.id;
                const activeVideo = allVideosList.find((v: any) => v.id === activeVideoIdToUse);

                const isVideoCompleted = courseProg?.completedVideos.includes(activeVideo?.id);

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Video Player Column */}
                    <div className="lg:col-span-8 space-y-6">
                      
                      <div className="aspect-video w-full rounded-3xl overflow-hidden bg-slate-950 shadow-lg border border-slate-200/50 dark:border-slate-800 relative">
                        {activeVideo ? (
                          <video
                            key={activeVideo.id}
                            src={activeVideo.videoUrl}
                            controls
                            className="w-full h-full object-contain"
                            poster={activeCourse.thumbnail}
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                            <Play className="h-10 w-10 animate-pulse mb-2" />
                            <p className="text-sm font-semibold">Select a video from the syllabus to play</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 p-4 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-brand-purple tracking-widest uppercase">Currently Watching</p>
                          <h2 className="text-lg font-bold text-slate-800 dark:text-white">{activeVideo?.title || 'Welcome Video'}</h2>
                          <p className="text-xs text-slate-400">Course: {activeCourse.courseName}</p>
                        </div>
                        {activeVideo && (
                          <button
                            onClick={() => updateVideoProgress(activeCourse.id, activeVideo.id, !isVideoCompleted)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                              isVideoCompleted 
                                ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-brand-blue/10 hover:text-brand-blue'
                            }`}
                          >
                            <Check className="h-4.5 w-4.5" />
                            <span>{isVideoCompleted ? 'Completed' : 'Mark as Complete'}</span>
                          </button>
                        )}
                      </div>

                    </div>

                    {/* Syllabus/Modules Sidebar Column */}
                    <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 max-h-[80vh] overflow-y-auto">
                      <div>
                        <h3 className="font-bold text-base">Course Progress</h3>
                        <div className="flex justify-between text-xs font-semibold mt-1 mb-1">
                          <span className="text-slate-400">Completion</span>
                          <span className="text-brand-purple font-mono">{progressPct}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-brand-blue to-brand-purple h-full" style={{ width: `${progressPct}%` }} />
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Course Playlist</p>
                        <div className="space-y-4">
                          {activeCourse.modules.map((mod, modIdx) => (
                            <div key={mod.id} className="space-y-2 text-left">
                              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Module {modIdx + 1}: {mod.title}</h4>
                              <div className="space-y-1.5 flex flex-col">
                                {mod.videos.map((vId) => {
                                  const videoObj = videos.find(v => v.id === vId);
                                  if (!videoObj) return null;
                                  
                                  const isSelected = activeVideoIdToUse === vId;
                                  const isCompleted = courseProg?.completedVideos.includes(vId);

                                  return (
                                    <button
                                      key={vId}
                                      onClick={() => { setSelectedVideoId(vId); setSelectedVideoUrl(videoObj.videoUrl); }}
                                      className={`text-left p-3 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                                        isSelected 
                                          ? 'bg-brand-blue/5 text-brand-blue border border-brand-blue/10 dark:text-blue-400' 
                                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 border border-transparent'
                                      }`}
                                    >
                                      <span className="flex items-center space-x-2.5 truncate">
                                        {isCompleted ? (
                                          <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                        ) : (
                                          <Play className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                                        )}
                                        <span className="truncate">{videoObj.title}</span>
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-mono ml-2 flex-shrink-0">{videoObj.duration}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>
                );
              })()}

            </div>
          ) : (
            /* LIST OF STUDENT ENROLLED COURSES */
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">My Enrolled Courses</h2>
                <p className="text-xs text-slate-400 mt-1">Select a course workspace to resume streaming recorded lessons</p>
              </div>

              {studentCourses.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border p-12 text-center rounded-2xl space-y-4">
                  <p className="text-sm text-slate-400">You are not enrolled in any courses yet.</p>
                  <Link to="/courses" className="px-4 py-2 bg-brand-blue text-white rounded-xl text-xs font-bold inline-block">
                    Explore course collections
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {studentCourses.map((course) => {
                    const cProgressObj = progress.find(p => p.courseId === course.id);
                    const progressPct = cProgressObj ? cProgressObj.progressPercentage : 0;
                    return (
                      <div key={course.id} className="relative">
                        <CourseCard course={course} progressPercentage={progressPct} />
                        {/* Overlay play quick link */}
                        <button
                          onClick={() => setSelectedLearningCourse(course.id)}
                          className="absolute bottom-5 right-5 z-20 p-2 bg-brand-purple text-white rounded-xl shadow-md transition hover:scale-105 active:scale-95"
                          title="Resume Learning"
                        >
                          <Play className="h-4 w-4 fill-white" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* 3. ASSIGNMENTS VIEW */}
      {activeTab === 'assignments' && (
        <div className="space-y-6 text-left">
          <div>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Assignments Center</h2>
            <p className="text-xs text-slate-400 mt-1">Complete your coding projects to acquire final mentor approval and unlock credentials</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {assignments.filter(as => enrolledIds.includes(as.courseId)).length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-12 text-center border rounded-2xl space-y-2">
                <p className="text-sm text-slate-400">No active assignments found for your enrolled course collections.</p>
              </div>
            ) : (
              assignments
                .filter(as => enrolledIds.includes(as.courseId))
                .map((as) => {
                  const submission = submissions.find(sub => sub.assignmentId === as.id && sub.studentId === currentUser.id);
                  const isSubmitted = !!submission;

                  return (
                    <div 
                      key={as.id}
                      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded">
                            {as.courseName}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            Due: {as.dueDate}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-slate-800 dark:text-white truncate">{as.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">{as.description}</p>
                      </div>

                      <div className="flex-shrink-0 flex items-center space-x-3">
                        {isSubmitted ? (
                          <div className="text-right space-y-1">
                            <span className={`inline-flex px-3 py-1 rounded-xl text-xs font-bold ${
                              submission.status === 'graded' 
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' 
                                : 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400'
                            }`}>
                              {submission.status === 'graded' ? `Graded: ${submission.grade}/100` : 'Pending Grade'}
                            </span>
                            {submission.feedback && (
                              <p className="text-[10px] text-slate-400 max-w-xs truncate italic">Feedback: "{submission.feedback}"</p>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenAssignment(as.id)}
                            className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-xs font-bold transition shadow-sm"
                          >
                            Submit Project
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

      {/* 4. CERTIFICATES VAULT */}
      {activeTab === 'certificates' && (
        <div className="space-y-6 text-left">
          <div>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Certificates of Completion</h2>
            <p className="text-xs text-slate-400 mt-1">Unlock formal course certifications once progress reaches 100%</p>
          </div>

          {earnedCerts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border p-12 text-center rounded-2xl space-y-3">
              <Award className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-sm text-slate-400">You haven't earned any completion certificates yet.</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">Finish streaming all lessons of any course to auto-generate your credentials!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {earnedCerts.map((cert) => (
                <div 
                  key={cert.id}
                  className="bg-gradient-to-tr from-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800 text-white flex flex-col justify-between h-56 shadow-lg relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full filter blur-[20px] -z-10" />
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-blue">SkillBridge Academic</span>
                    <h3 className="font-display font-bold text-sm sm:text-base line-clamp-2 leading-snug">{cert.courseName}</h3>
                    <p className="text-[10px] text-slate-400">Issued: {cert.issueDate}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 mt-auto">
                    <div>
                      <p className="text-[9px] uppercase text-slate-400 font-bold leading-none">Credential ID</p>
                      <p className="text-[10px] font-mono text-slate-200 mt-1">{cert.certificateId}</p>
                    </div>
                    <button
                      onClick={() => handleOpenCert(cert)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[11px] font-bold transition flex items-center space-x-1"
                    >
                      <span>Preview</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* 5. WISHLIST VIEW */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6 text-left">
          <div>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">My Saved Courses</h2>
            <p className="text-xs text-slate-400 mt-1">Review bookmarks and complete enrollments at your own speed</p>
          </div>

          {wishlistCourses.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border p-12 text-center rounded-2xl space-y-2">
              <p className="text-sm text-slate-400">Your wishlist is currently empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlistCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}

        </div>
      )}

      {/* 6. PROFILE / SETTINGS VIEW */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          
          {/* Main Account Settings */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold font-display">Account Profile Details</h2>
              <p className="text-xs text-slate-400 mt-1">Configure your personal name, digital bio, and portfolio references</p>
            </div>

            {profileMsg && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold text-xs rounded-xl text-center border border-emerald-100">
                {profileMsg}
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Your Display Name</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Login Email (Read-Only)</label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Short Profile Bio</label>
                <textarea
                  rows={4}
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl text-xs transition shadow-sm"
              >
                Save Settings
              </button>
            </form>

            {/* Skills checklist */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div>
                <h4 className="font-semibold text-sm">Professional Skills Tracker</h4>
                <p className="text-xs text-slate-400">Add skills that help instructors understand your credentials</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {currentUser.skills.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No skills cataloged. Add some below!</p>
                ) : (
                  currentUser.skills.map((s, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-850 text-xs font-semibold rounded-full border dark:border-slate-850"
                    >
                      <span>{s}</span>
                      <button onClick={() => handleRemoveSkill(s)} className="text-slate-400 hover:text-red-500 font-bold">×</button>
                    </span>
                  ))
                )}
              </div>

              <form onSubmit={handleAddSkill} className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  placeholder="e.g. Figma"
                  value={profileSkill}
                  onChange={(e) => setProfileSkill(e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-750 flex items-center space-x-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add</span>
                </button>
              </form>
            </div>
          </div>

          {/* Become a Mentor Section */}
          <div className="bg-gradient-to-tr from-brand-blue/5 to-brand-purple/5 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold font-display">Become a Mentor</h2>
              <p className="text-xs text-slate-500 mt-1">Ready to share your coding expertise? Submit an application to Administrator review panels</p>
            </div>

            {mentorRequestSent ? (
              <div className="p-4 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl border border-emerald-100 leading-relaxed text-center">
                <strong>Application Pending Review!</strong> <br />
                Your credentials are filed with Administrators. You will receive an in-app notice once authorized.
              </div>
            ) : (
              <form onSubmit={handleBecomeMentorSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Expertise Skills (Comma separated)</label>
                  <input
                    type="text"
                    required
                    placeholder="Next.js, UI/UX, SEO"
                    value={mentorSkills}
                    onChange={(e) => setMentorSkills(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Teaching Experience</label>
                  <select
                    value={mentorExperience}
                    onChange={(e) => setMentorExperience(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-white"
                  >
                    <option value="1 Year">1 Year</option>
                    <option value="2-4 Years">2-4 Years</option>
                    <option value="5+ Years">5+ Years</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Proposed Course Topic</label>
                  <input
                    type="text"
                    required
                    placeholder="Advanced Next.js Architecture"
                    value={mentorProposedCourse}
                    onChange={(e) => setMentorProposedCourse(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Short Teaching Bio</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Introduce yourself to student reviewers..."
                    value={mentorBio}
                    onChange={(e) => setMentorBio(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-brand-purple hover:bg-brand-purple/90 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-purple/10 active:scale-95"
                >
                  File Application
                </button>
              </form>
            )}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* MODALS RENDER SECTION */}
      {/* ============================================================== */}
      
      {/* 1. ASSIGNMENT SUBMISSION MODAL */}
      <Modal
        isOpen={assignmentModalOpen}
        onClose={() => setAssignmentModalOpen(false)}
        title="Submit Course Assignment"
      >
        <form onSubmit={handleSubmissionSubmit} className="space-y-5 text-left">
          <p className="text-xs text-slate-500 leading-relaxed">
            Write your project summary and attach references. Your mentor will inspect and grade this work in real-time.
          </p>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase">Project Text Summary *</label>
            <textarea
              required
              rows={4}
              placeholder="Hi, here is my implementation. I covered all responsive constraints..."
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase">Submission URL (e.g. GitHub, Figma Link)</label>
            <input
              type="url"
              placeholder="https://github.com/yourusername/project"
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl text-xs transition"
          >
            Send Submission
          </button>
        </form>
      </Modal>

      {/* 2. GORGEOUS HIGH-FIDELITY CERTIFICATE PREVIEW MODAL */}
      <Modal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        title="Academic Certificate Preview"
      >
        {activeCert && (
          <div className="space-y-6 text-center">
            
            {/* Elegant Golden Board Certificate Card */}
            <div className="border-[8px] border-amber-800/40 dark:border-slate-850 p-6 sm:p-10 bg-amber-50/20 dark:bg-slate-950 rounded-2xl relative shadow-inner text-slate-800 dark:text-slate-100">
              {/* Seals & watermarks */}
              <div className="absolute top-4 right-4 h-12 w-12 border-2 border-brand-blue/20 rounded-full flex items-center justify-center font-display font-bold text-[9px] text-slate-300 dark:text-slate-700 select-none">
                SEAL
              </div>

              <span className="text-xs font-display font-bold text-brand-purple uppercase tracking-widest block mb-4">
                SkillBridge Academics
              </span>
              
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">This certifies that</p>
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display mb-3">
                {activeCert.studentName}
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                has successfully completed all assignments, lesson modules, and grading reviews required for the curriculum
              </p>
              
              <h3 className="text-sm sm:text-base font-bold text-brand-blue dark:text-blue-400 font-display mt-5 mb-6">
                {activeCert.courseName}
              </h3>

              <div className="grid grid-cols-2 gap-4 text-left pt-6 border-t border-slate-200/50 dark:border-slate-850">
                <div>
                  <p className="text-[9px] uppercase text-slate-400 font-bold leading-none">Instructed by</p>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">{activeCert.mentorName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] uppercase text-slate-400 font-bold leading-none">Issue Date</p>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">{activeCert.issueDate}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <span className="text-xs text-slate-400 font-mono self-center">ID: {activeCert.certificateId}</span>
              <button
                onClick={() => {
                  alert(`Downloading file sb_certificate_${activeCert.certificateId}.pdf ...`);
                  setCertModalOpen(false);
                }}
                className="px-4 py-2 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Download PDF
              </button>
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
};
