import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CourseCard, LoadingSkeleton } from '../components/SharedComponents';
import categoriesData from '../data/categories.json';
import { Search, Filter, X, SlidersHorizontal, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export const Courses: React.FC = () => {
  const { courses } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Local state for filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || 'All');
  const [isLoading, setIsLoading] = useState(false);

  // Sync URL search parameters on load
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlCategory = searchParams.get('category');
    const urlLevel = searchParams.get('level');

    if (urlSearch !== null) setSearch(urlSearch);
    if (urlCategory !== null) setSelectedCategory(urlCategory);
    if (urlLevel !== null) setSelectedLevel(urlLevel);
  }, [searchParams]);

  // Handle filter changes and update URL
  const updateFilters = (key: string, value: string) => {
    setIsLoading(true);
    const newParams = new URLSearchParams(searchParams);
    
    if (value === 'All' || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    
    setSearchParams(newParams);
    
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    updateFilters('search', val);
  };

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSearchParams({});
  };

  // Filter local courses list
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.courseName.toLowerCase().includes(search.toLowerCase()) || 
                          course.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.difficultyLevel === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      
      {/* Title Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">Explore Courses</h1>
        <p className="text-sm text-slate-500 mt-1">Acquire state-of-the-art expertise with verified peer mentors</p>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Sidebar Filters (Desktop only) */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-sm flex items-center space-x-2">
                <SlidersHorizontal className="h-4 w-4 text-brand-blue" />
                <span>Filters</span>
              </span>
              <button 
                onClick={clearAllFilters}
                className="text-xs font-semibold text-brand-purple hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2.5 text-left">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</label>
              <div className="space-y-1.5 flex flex-col">
                <button
                  onClick={() => { setSelectedCategory('All'); updateFilters('category', 'All'); }}
                  className={`text-left px-3 py-2 rounded-xl text-sm font-semibold transition ${
                    selectedCategory === 'All' 
                      ? 'bg-brand-blue/5 text-brand-blue dark:text-blue-400' 
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-850'
                  }`}
                >
                  All Categories
                </button>
                {categoriesData.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.name); updateFilters('category', cat.name); }}
                    className={`text-left px-3 py-2 rounded-xl text-sm font-semibold transition ${
                      selectedCategory === cat.name 
                        ? 'bg-brand-blue/5 text-brand-blue dark:text-blue-400' 
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-850'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level Filter */}
            <div className="space-y-2.5 text-left pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Difficulty Level</label>
              <div className="space-y-1.5 flex flex-col">
                {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <button
                    key={level}
                    onClick={() => { setSelectedLevel(level); updateFilters('level', level); }}
                    className={`text-left px-3 py-2 rounded-xl text-sm font-semibold transition ${
                      selectedLevel === level 
                        ? 'bg-brand-blue/5 text-brand-blue dark:text-blue-400' 
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-850'
                    }`}
                  >
                    {level === 'All' ? 'All Difficulty' : level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Search and Listings Grid */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Search & Mobile Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search course titles or descriptions..."
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue dark:text-white"
              />
              {search && (
                <button 
                  onClick={() => { setSearch(''); updateFilters('search', ''); }}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Mobile Filters Dropdown controls */}
            <div className="flex gap-2 lg:hidden">
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); updateFilters('category', e.target.value); }}
                className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                <option value="All">All Categories</option>
                {categoriesData.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => { setSelectedLevel(e.target.value); updateFilters('level', e.target.value); }}
                className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Active Chips */}
          {(selectedCategory !== 'All' || selectedLevel !== 'All' || search !== '') && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 mr-1">Active filters:</span>
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-brand-blue/5 dark:bg-blue-900/20 text-brand-blue dark:text-blue-400 text-xs font-bold rounded-full">
                  <span>{selectedCategory}</span>
                  <X className="h-3 w-3 cursor-pointer" onClick={() => { setSelectedCategory('All'); updateFilters('category', 'All'); }} />
                </span>
              )}
              {selectedLevel !== 'All' && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-brand-purple/5 dark:bg-purple-900/20 text-brand-purple dark:text-purple-400 text-xs font-bold rounded-full">
                  <span>{selectedLevel}</span>
                  <X className="h-3 w-3 cursor-pointer" onClick={() => { setSelectedLevel('All'); updateFilters('level', 'All'); }} />
                </span>
              )}
              {search && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full">
                  <span>"{search}"</span>
                  <X className="h-3 w-3 cursor-pointer" onClick={() => { setSearch(''); updateFilters('search', ''); }} />
                </span>
              )}
              <button 
                onClick={clearAllFilters}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Course Listings Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => <LoadingSkeleton key={i} />)}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-12 text-center space-y-4">
              <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="font-bold text-lg text-slate-700 dark:text-slate-300">No Courses Match your Query</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">Try broadening your search keywords or resetting the filter panels.</p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-brand-blue text-white rounded-xl text-xs font-bold shadow-md transition hover:opacity-90"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
