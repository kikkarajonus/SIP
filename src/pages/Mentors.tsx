import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MentorCard } from '../components/SharedComponents';
import { Search, Users, Award, Sparkles } from 'lucide-react';

export const Mentors: React.FC = () => {
  const { mentors } = useApp();
  const [search, setSearch] = useState('');

  const filteredMentors = mentors.filter((m) => {
    return m.name.toLowerCase().includes(search.toLowerCase()) ||
           m.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left space-y-8">
      
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">Meet our Mentors</h1>
        <p className="text-sm text-slate-500 mt-1">Acquire advanced insights and code reviews from high-performance industry veterans</p>
      </div>

      {/* Filter toolbar */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by mentor name or skill (e.g. React)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>
      </div>

      {/* Mentors grid list */}
      {filteredMentors.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border text-center space-y-4">
          <Users className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 dark:text-slate-300">No Mentors Found</h3>
          <p className="text-xs text-slate-400">We couldn't find any mentors matching your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      )}

    </div>
  );
};
