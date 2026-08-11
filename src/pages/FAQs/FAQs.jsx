import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Minus, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Link, useSearchParams } from 'react-router';

const FAQS_PER_PAGE = 5;

const FAQs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openIndex, setOpenIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const axiosSecure = useAxiosSecure();

  const activeCategory = searchParams.get('category') || 'All';

  const {
    data: faqsRes = { data: [] },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const res = await axiosSecure.get('/faqs');
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  const faqs = useMemo(() => faqsRes?.data || [], [faqsRes]);

  const categories = useMemo(() => ['All', ...new Set(faqs.map((faq) => faq.category))], [faqs]);

  const filteredFAQs = useMemo(() => {
    return faqs.filter((faq) => activeCategory === 'All' || faq.category === activeCategory);
  }, [faqs, activeCategory]);

  const totalPages = useMemo(
    () => Math.ceil(filteredFAQs.length / FAQS_PER_PAGE),
    [filteredFAQs.length]
  );

  const paginatedFAQs = useMemo(
    () => filteredFAQs.slice((currentPage - 1) * FAQS_PER_PAGE, currentPage * FAQS_PER_PAGE),
    [filteredFAQs, currentPage]
  );

  const toggleFAQ = useCallback(
    (index) => {
      setOpenIndex(index === openIndex ? null : index);
    },
    [openIndex]
  );

  const handleCategoryChange = useCallback(
    (category) => {
      const newParams = new URLSearchParams(searchParams);
      if (category === 'All') {
        newParams.delete('category');
      } else {
        newParams.set('category', category);
      }
      setSearchParams(newParams);
      setCurrentPage(1);
      setOpenIndex(0);
    },
    [searchParams, setSearchParams]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F7F8] dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-[#495E57] dark:text-[#F4CE14] mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#F5F7F8] dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 max-w-md w-full">
          <h3 className="text-lg font-bold text-red-600 mb-2">Failed to load FAQs</h3>
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
    <div className="min-h-screen bg-[#F5F7F8] dark:bg-slate-950 py-12 sm:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column Header & Category Pills */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              FAQs
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mt-4 leading-relaxed font-normal">
              Everything you need to know about medical camps, registration, payments, and
              healthcare services.
            </p>
          </div>

          {/* Category Pill Buttons */}
          <div className="flex flex-wrap gap-2.5 pt-2" role="tablist" aria-label="FAQ Categories">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                      : 'border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-700 bg-white/60 dark:bg-slate-900/60'
                  }`}
                  role="tab"
                  aria-selected={isActive}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column Accordion & Bottom Contact Box */}
        <div className="lg:col-span-7 space-y-10">
          {/* Accordion Items List */}
          <div className="divide-y divide-slate-200 dark:divide-slate-800 border-t border-slate-200 dark:border-slate-800">
            {paginatedFAQs.length > 0 ? (
              paginatedFAQs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={faq._id || index} className="py-6">
                    <button
                      className="w-full flex justify-between items-center text-left gap-4 cursor-pointer focus:outline-none group"
                      onClick={() => toggleFAQ(index)}
                      aria-expanded={isOpen}
                    >
                      <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#495E57] dark:group-hover:text-[#F4CE14] transition-colors leading-snug">
                        {faq.question}
                      </span>
                      <span className="text-slate-900 dark:text-slate-100 shrink-0 p-1">
                        {isOpen ? <Minus size={22} /> : <Plus size={22} />}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="pt-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-slate-400 text-sm">
                No questions found in this category.
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setCurrentPage((prev) => Math.max(1, prev - 1));
                  setOpenIndex(0);
                }}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => {
                      setCurrentPage(pageNum);
                      setOpenIndex(0);
                    }}
                    className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer transition ${
                      currentPage === pageNum
                        ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                        : 'border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                  setOpenIndex(0);
                }}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          )}

          {/* Bottom Contact Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Still have questions?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Contact our support team and we will make sure everything is clear and intuitive for
              you!
            </p>
            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-block px-6 py-3 bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold rounded-2xl text-xs sm:text-sm hover:opacity-90 transition cursor-pointer shadow-sm"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(FAQs);
