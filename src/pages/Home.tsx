import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CategoryCard, CourseCard, MentorCard } from '../components/SharedComponents';
import categoriesData from '../data/categories.json';
import testimonialsData from '../data/testimonials.json';
import { 
  Search, BookOpen, Users, Award, Shield, Sparkles, 
  ChevronRight, ArrowRight, Heart, HelpCircle, ChevronDown, Star 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { courses, mentors } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/courses');
    }
  };

  const featuredCourses = courses.slice(0, 3);
  const popularMentors = mentors.slice(0, 3);

  const stats = [
    { label: 'Active Learners', value: '12,500+', icon: Users, color: 'text-blue-500 bg-blue-100/50 dark:bg-blue-950/40' },
    { label: 'Expert Mentors', value: '450+', icon: Award, color: 'text-purple-500 bg-purple-100/50 dark:bg-purple-950/40' },
    { label: 'Online Courses', value: '1,200+', icon: BookOpen, color: 'text-emerald-500 bg-emerald-100/50 dark:bg-emerald-950/40' },
    { label: 'Certificates Issued', value: '8,400+', icon: Shield, color: 'text-rose-500 bg-rose-100/50 dark:bg-rose-950/40' },
  ];

  const faqs = [
    {
      q: "How does SkillBridge's peer learning work?",
      a: "SkillBridge connects eager students directly with certified mentors. You study pre-recorded video curricula, complete coding assignments, and obtain graded feedback. Once you gain high-level skills, you can submit an application to become a mentor, allowing you to upload your own courses and earn rewards."
    },
    {
      q: "Is there any subscription fee?",
      a: "No! SkillBridge operates on a direct course-enrollment model. You pay a one-time fee per course, which unlocks permanent lifetime access, assignment reviews, recorded video modules, and your shareable Certificate of Completion."
    },
    {
      q: "Can I be both a student and a mentor?",
      a: "Absolutely! The core mission of SkillBridge is 'Learn first, teach later.' Many of our top mentors began as students on the platform, acquired advanced expertise, and transitioned to sharing their own knowledge."
    },
    {
      q: "How do I claim my course certificate?",
      a: "Once you watch 100% of the recorded video lessons and pass all corresponding course modules, your Certificate of Completion is instantly generated. You can view, share, or download it directly from your Student Dashboard."
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-blue/10 dark:bg-brand-blue/5 rounded-full filter blur-[100px] -z-10" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-brand-purple/10 dark:bg-brand-purple/5 rounded-full filter blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue dark:text-blue-300 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase"
            >
              <Sparkles className="h-4 w-4" />
              <span>The Peer-to-Peer Learning Revolution</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display leading-[1.1]"
            >
              Learn Skills from Peers. <br />
              <span className="bg-gradient-to-r from-brand-blue via-indigo-500 to-brand-purple bg-clip-text text-transparent">
                Become a Mentor.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl"
            >
              Unlock your true potential in our collaborative ecosystem. Gain real-world mastery through curated video courses, code reviews, and direct mentorship from students who have been in your exact shoes.
            </motion.p>

            {/* Search Bar */}
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-lg"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="What do you want to learn today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent dark:text-white shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold px-6 py-3.5 rounded-2xl transition duration-250 flex items-center justify-center space-x-2 shadow-md shadow-brand-blue/15"
              >
                <span>Search</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.form>
          </div>

          {/* Banner Illustration Visual */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-900 aspect-[4/3]"
            >
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800" 
                alt="Online peer learning dashboard representation" 
                className="w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white text-left p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <p className="text-xs uppercase font-bold text-blue-300 tracking-wider">Live Active Peer Sessions</p>
                <p className="text-sm font-semibold mt-1">Jane Doe (Student) is finishing React & TS Masterclass with Prof. Marcus!</p>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 2. Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">Popular Categories</h2>
            <p className="text-sm text-slate-500 mt-1">Explore our most active learning paths</p>
          </div>
          <Link to="/courses" className="text-sm font-semibold text-brand-blue dark:text-blue-400 hover:underline flex items-center space-x-1">
            <span>All Categories</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesData.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* 3. Featured Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">Featured Courses</h2>
            <p className="text-sm text-slate-500 mt-1">Acquire top certifications designed and peer-graded by experts</p>
          </div>
          <Link to="/courses" className="text-sm font-semibold text-brand-blue dark:text-blue-400 hover:underline flex items-center space-x-1">
            <span>Explore Catalog</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* 4. Statistics */}
      <section className="bg-slate-100/50 dark:bg-slate-900/50 py-16 border-y border-slate-200/40 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex flex-col items-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm text-center">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-4 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
                    {stat.value}
                  </span>
                  <span className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Top Mentors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">Top Mentors</h2>
            <p className="text-sm text-slate-500 mt-1">Learn from industry veterans who active-guide your career</p>
          </div>
          <Link to="/mentors" className="text-sm font-semibold text-brand-blue dark:text-blue-400 hover:underline flex items-center space-x-1">
            <span>All Mentors</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularMentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      </section>

      {/* 6. Become a Mentor CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-blue to-brand-purple p-8 sm:p-12 lg:p-16 text-white shadow-xl">
          {/* Visual Elements */}
          <div className="absolute inset-0 bg-grid-white/[0.05] -z-10" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full filter blur-[80px] -z-10" />

          <div className="max-w-3xl space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
              Earn & Give Back
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
              Ready to Share your Knowledge? <br />
              Become a SkillBridge Mentor Today
            </h2>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              Join our growing network of mentors. Share your custom recorded video playlists, build practical coding assignments, support peer reviews, and earn rewards helping students master advanced engineering.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                to="/register?role=mentor"
                className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-6 py-3 rounded-xl shadow-md transition duration-200 text-center text-sm"
              >
                Apply as Mentor
              </Link>
              <Link
                to="/about"
                className="border border-white/30 hover:bg-white/10 font-bold px-6 py-3 rounded-xl transition text-center text-sm"
              >
                How it Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">What Our Learners Say</h2>
          <p className="text-sm text-slate-500 mt-1">Real reviews from our proactive peer learning community</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((t) => (
            <div key={t.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
              <div>
                {/* Rating stars */}
                <div className="flex space-x-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed mb-6">
                  "{t.content}"
                </p>
              </div>
              <div className="flex items-center space-x-3.5">
                <img src={t.avatar} alt="" className="h-10 w-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">{t.name}</h4>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-500 mt-1 font-sans">Everything you need to know to get started</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left font-semibold text-slate-800 dark:text-white hover:text-brand-blue dark:hover:text-blue-400 transition"
                >
                  <span className="flex items-center space-x-3 text-sm sm:text-base">
                    <HelpCircle className="h-5 w-5 text-slate-400 flex-shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`h-5 w-5 text-slate-400 transform transition-transform duration-250 ${isOpen ? 'rotate-180 text-brand-blue' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20"
                    >
                      <p className="px-6 py-5 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
