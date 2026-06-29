import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
      setTimeout(() => {
        // Reset
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }, 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-12">
      
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">Get in Touch</h1>
        <p className="text-sm text-slate-500">Have questions about corporate licensing or peer certifications? Our support agents are here to assist.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Contact Info Panel */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-6">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Contact Information</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              For general support queries, student enrollment concerns, or business partnerships, reach out directly via these channels.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 bg-brand-blue/10 rounded-xl flex items-center justify-center text-brand-blue flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-400">Our HQ</h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    100 Innovation Way, Suite 400, <br />
                    San Francisco, CA 94107
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 bg-brand-purple/10 rounded-xl flex items-center justify-center text-brand-purple flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-400">Direct Email</h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                    support@skillbridge.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 bg-rose-100/50 dark:bg-rose-950/20 rounded-xl flex items-center justify-center text-rose-500 flex-shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-400">Phone Hotline</h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                    +1 (555) 234-5678
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps placeholder */}
          <div className="rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800 shadow bg-slate-100 dark:bg-slate-900 aspect-video flex flex-col items-center justify-center p-6 text-center text-slate-400 relative">
            <MapPin className="h-8 w-8 text-brand-blue mb-2 animate-bounce" />
            <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Interactive Map</h4>
            <p className="text-[11px] max-w-xs mt-1">100 Innovation Way, San Francisco, CA</p>
            {/* Soft grid background */}
            <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 -z-10" />
          </div>

        </div>

        {/* Contact Form Panel */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-8 rounded-3xl shadow-sm">
            
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg">Message Received!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Thank you for contacting SkillBridge. One of our course coordinators will reach out within 24 business hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Send us a Message</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-400 uppercase">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-400 uppercase">Your Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-slate-400 uppercase">Subject</label>
                  <input
                    type="text"
                    placeholder="General Question"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-slate-400 uppercase">Your Message *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe how we can help you..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl text-sm transition flex items-center justify-center space-x-2 shadow-md shadow-brand-blue/15"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
