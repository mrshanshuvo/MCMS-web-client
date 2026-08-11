import React, { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import { toast } from 'react-hot-toast';

const POSTS_PER_PAGE = 6;

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [emailInput, setEmailInput] = useState('');
  const axiosSecure = useAxiosSecure();

  const selectedCategory = searchParams.get('category') || 'All';

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await axiosSecure.get('/blogs');
      return res.data.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const categories = useMemo(
    () => ['View all', ...new Set(posts.map((post) => post.category))],
    [posts]
  );

  const activeCategory = selectedCategory === 'All' ? 'View all' : selectedCategory;

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      return activeCategory === 'View all' || post.category === activeCategory;
    });
  }, [posts, activeCategory]);

  const totalPages = useMemo(
    () => Math.ceil(filteredPosts.length / POSTS_PER_PAGE),
    [filteredPosts.length]
  );

  const currentPosts = useMemo(
    () => filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE),
    [filteredPosts, currentPage]
  );

  const handleCategoryChange = useCallback(
    (category) => {
      const newParams = new URLSearchParams(searchParams);
      if (category === 'View all' || category === 'All') {
        newParams.delete('category');
      } else {
        newParams.set('category', category);
      }
      setSearchParams(newParams);
      setCurrentPage(1);
    },
    [searchParams, setSearchParams]
  );

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    toast.success('Thank you for subscribing!');
    setEmailInput('');
  };

  const goToPage = useCallback(
    (page) => {
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [totalPages]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F7F8] dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-[#495E57] dark:text-[#F4CE14] mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
            Loading articles...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#F5F7F8] dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 max-w-md w-full">
          <h3 className="text-lg font-bold text-red-600 mb-2">Failed to load posts</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
            {error?.message || 'Please try again later'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#495E57] text-white rounded-xl font-bold text-xs hover:opacity-90 transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7F8] dark:bg-slate-950 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        {/* Top Header Section with Subscribe Bar */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8">
          <div>
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              CareCamp Blog
            </h1>

            {/* Email Subscribe Input Pill */}
            <form
              onSubmit={handleSubscribe}
              className="mt-6 flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full p-1.5 shadow-xs max-w-md"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="flex-1 px-4 py-2 text-xs sm:text-sm bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-bold rounded-full hover:opacity-90 transition cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-xs leading-relaxed md:text-right">
            New product features, the latest in healthcare technology, solutions, and medical camp
            updates.
          </p>
        </div>

        {/* Category Navigation Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-800 flex gap-6 sm:gap-8 overflow-x-auto my-8 no-scrollbar">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`text-sm font-semibold whitespace-nowrap pb-3 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-b-2 border-slate-950 dark:border-white text-slate-950 dark:text-slate-100 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Articles Cards Grid */}
        {filteredPosts.length > 0 ? (
          <>
            <div className="grid gap-8 md:grid-cols-2">
              {currentPosts.map((post) => (
                <article key={post._id} className="group flex flex-col">
                  {/* Image Container with Frosted Glass Overlay */}
                  <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 dark:border-slate-800">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-xs flex items-end justify-between text-white">
                      <div>
                        <p className="font-bold text-sm leading-tight text-white drop-shadow-xs">
                          {post.author || 'CareCamp Team'}
                        </p>
                        <p className="text-xs text-slate-300 font-medium mt-0.5">
                          {post.date || 'Recent'}
                        </p>
                      </div>
                      <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white">
                        {post.category || 'Article'}
                      </span>
                    </div>
                  </div>

                  {/* Article Title & Summary below image */}
                  <div className="pt-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <Link to={`/blog/${post._id}`}>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 hover:underline cursor-pointer leading-snug tracking-tight">
                          {post.title}
                        </h2>
                      </Link>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-2 line-clamp-2">
                        {post.summary}
                      </p>
                    </div>

                    <div className="pt-2">
                      <Link
                        to={`/blog/${post._id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-slate-100 hover:underline cursor-pointer group/link"
                      >
                        <span>Read post</span>
                        <ArrowUpRight
                          size={15}
                          className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => goToPage(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer transition ${
                      currentPage === pageNum
                        ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
              No articles found in this category.
            </p>
            <button
              type="button"
              onClick={() => handleCategoryChange('View all')}
              className="px-4 py-2 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl text-xs font-bold hover:opacity-90 transition cursor-pointer"
            >
              View All Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Blog);
