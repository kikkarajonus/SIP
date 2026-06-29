import React from 'react';
import { Award, Compass, BookOpen, Users, HelpCircle, Shield, Heart, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const About: React.FC = () => {
  const values = [
    { title: "Our Mission", desc: "To democratize premium digital education by turning eager learners into active, certified peer mentors, building a sustainable and supportive community.", icon: Compass, color: "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" },
    { title: "Our Vision", desc: "A world where high-quality technical skills are open, accessible, and community-guided without massive corporate price inflation or rigid schedules.", icon: Sparkles, color: "bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400" },
    { title: "Why SkillBridge", desc: "We bridge the gap between static recorded videos and direct coding feedback. Our mentors review your code and grade your practical assignments in real-time.", icon: Heart, color: "bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400" },
  ];

  const features = [
    { title: "Recorded Video Curriculums", desc: "Access organized, bite-sized instructional videos that go straight to the point.", icon: BookOpen },
    { title: "Peer Code Reviews", desc: "Submit real coding projects and assignments. Get comprehensive grading and review lines from mentors.", icon: Users },
    { title: "Verifiable Certifications", desc: "Earn public cryptographic-grade certificates to display your accomplishments on LinkedIn or resumes.", icon: Award },
    { title: "Full-Scale Student & Mentor Dashboards", desc: "Track learning progress, explore wishlist, upload video lectures, or manage request panels in intuitive layouts.", icon: Shield },
  ];

  return (
    <div className="space-y-20 pb-20 pt-8 text-left max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Hero Intro */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white leading-tight">
          SaaS Peer Learning <br />
          <span className="bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">
            Built for Eager Students
          </span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
          SkillBridge is a self-sustaining peer academy designed to support custom course creations, active assignment grading, and verifiable professional credentials.
        </p>
      </section>

      {/* Core Values */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((v, idx) => {
          const Icon = v.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm"
            >
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-6 ${v.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-3">
                {v.title}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {v.desc}
              </p>
            </motion.div>
          );
        })}
      </section>

      {/* Narrative Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
            The Journey: From Learner to Mentor
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Most digital platforms separate learning from teaching. Students watch passive content and rarely interact with creators. SkillBridge completely breaks this mold.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            We believe that the best way to master a skill is to teach it. That is why our platform actively incentivizes advanced students to build introduction lessons, draft quizzes, apply to become mentors, and host their own spaces.
          </p>
          <div className="flex items-center space-x-6 pt-2">
            <div>
              <p className="text-2xl font-bold text-brand-blue">98%</p>
              <p className="text-xs uppercase font-bold text-slate-400">Completion rate</p>
            </div>
            <div className="border-l border-slate-200 h-8 dark:border-slate-800" />
            <div>
              <p className="text-2xl font-bold text-brand-purple">120+</p>
              <p className="text-xs uppercase font-bold text-slate-400">Student-turned-mentors</p>
            </div>
          </div>
        </div>
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800" 
            alt="Students collaborating" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">Premium Platform Features</h2>
          <p className="text-sm text-slate-500 mt-1">A unified educational suite built with standard frontend widgets</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="flex space-x-4 p-6 bg-slate-100/50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/20 dark:border-slate-800/20">
                <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/30 dark:border-slate-800/30 flex items-center justify-center text-brand-blue dark:text-blue-400 flex-shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
