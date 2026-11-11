/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { getBlogPosts, BlogPost, DEFAULT_BLOG_POSTS } from '../lib/firestoreService';
import { FinalCTA } from '../components/FinalCTA';

interface BlogPageProps {
  onOpenBooking: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onOpenBooking }) => {
  const [posts, setPosts] = useState<BlogPost[]>(DEFAULT_BLOG_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Clinical Journal & Patient Guides | Dr. Samik Sharma';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Authoritative surgical guides and patient education on rhinoplasty, deep plane facelifts, body contouring, and aesthetic safety by Dr. Samik Sharma at Shalby Hospital, Mohali.'
      );
    }

    async function load() {
      setLoading(true);
      try {
        const publishedPosts = await getBlogPosts(false);
        if (publishedPosts && publishedPosts.length > 0) {
          setPosts(publishedPosts);
        }
      } catch (err) {
        console.warn('Using default blog posts:', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const categories = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'Facial Aesthetics', label: 'Facial Aesthetics' },
    { id: 'Body Contouring', label: 'Body Contouring' },
    { id: 'Hair Restoration', label: 'Hair Restoration' },
    { id: 'Reconstructive Surgery', label: 'Reconstructive Surgery' },
  ];

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchCat = selectedCategory === 'all' || post.category === selectedCategory;
      const matchSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F6F0E9] pt-24 sm:pt-28">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 border-b border-[#C9A47F]/20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none luxury-noise" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(201,164,127,0.08)_0%,transparent_70%)] blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-[1px] bg-[#C9A47F]" />
              <span className="text-[11px] font-sans tracking-[0.28em] text-[#C9A47F] uppercase font-semibold">
                PATIENT EDUCATION &amp; CLINICAL JOURNAL
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-[#F6F0E9] leading-tight">
              Evidence-Based Insights into Modern Plastic Surgery
            </h1>

            <p className="text-sm sm:text-base text-[#AFA89F] font-light mt-6 leading-relaxed max-w-2xl font-sans">
              Authoritative clinical publications by Dr. Samik Sharma examining surgical mechanics, anatomical preservation techniques, recovery expectations, and safety standards at Shalby Multi-Specialty Hospital, Mohali.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="py-8 border-b border-white/5 bg-[#12100F] sticky top-20 z-20 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors whitespace-nowrap cursor-pointer border ${
                  selectedCategory === cat.id
                    ? 'border-[#C9A47F] bg-[#24211E] text-[#C9A47F]'
                    : 'border-transparent text-[#AFA89F] hover:text-[#F6F0E9] hover:bg-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#AFA89F] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search clinical topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1C1817] border border-white/10 pl-9 pr-4 py-2 text-xs text-[#F6F0E9] placeholder-[#7C766F] focus:outline-none focus:border-[#C9A47F]"
            />
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#AFA89F]">Loading published articles...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-[#C9A47F] mx-auto opacity-40" />
            <p className="text-sm font-serif text-[#F6F0E9]">No articles found matching your criteria</p>
            <p className="text-xs text-[#AFA89F]">Try searching with different clinical keywords or reset the category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-[#141211] border border-white/5 hover:border-[#C9A47F]/50 transition-all duration-300 flex flex-col justify-between group overflow-hidden"
              >
                {/* Cover Image */}
                <Link to={`/blog/${post.slug}`} className="block aspect-[16/10] overflow-hidden relative">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141211] via-transparent to-transparent opacity-80" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#0B0B0B]/85 backdrop-blur-sm text-[10px] uppercase tracking-wider text-[#C9A47F] border border-white/10 font-medium">
                    {post.category}
                  </span>
                </Link>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[11px] text-[#7C766F] font-mono">
                      <span>{post.readTime}</span>
                      <span>·</span>
                      <span>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Recent Guide'}
                      </span>
                    </div>

                    <Link to={`/blog/${post.slug}`}>
                      <h2 className="text-xl font-serif text-[#F6F0E9] group-hover:text-[#C9A47F] transition-colors line-clamp-2 font-normal leading-snug">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-xs text-[#AFA89F] font-light leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-[#AFA89F] italic font-serif">
                      By {post.author || 'Dr. Samik Sharma'}
                    </span>

                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs text-[#C9A47F] group-hover:translate-x-1 transition-transform uppercase tracking-wider font-medium"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Final Consultation Section */}
      <FinalCTA onOpenBooking={onOpenBooking} />
    </div>
  );
};
