import React, { useState, useMemo, useCallback } from "react";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Loader2,
  Star,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link, useSearchParams } from "react-router";

// Constants
const FAQS_PER_PAGE = 5;
const CATEGORY_COLORS = {
  General: { bg: "bg-[#495E57]/10", text: "text-[#495E57]" },
  Registration: { bg: "bg-[#495E57]/10", text: "text-[#495E57]" },
  Payments: { bg: "bg-[#495E57]/10", text: "text-[#495E57]" },
  Organizers: { bg: "bg-[#495E57]/10", text: "text-[#495E57]" },
  Eligibility: { bg: "bg-[#495E57]/10", text: "text-[#495E57]" },
  Feedback: { bg: "bg-[#495E57]/10", text: "text-[#495E57]" },
  default: { bg: "bg-[#495E57]/10", text: "text-[#495E57]" },
};

const FAQs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openIndex, setOpenIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const axiosSecure = useAxiosSecure();

  // Get initial state from URL params
  const activeCategory = searchParams.get("category") || "All";

  const {
    data: faqsRes = { data: [] },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/faqs");
      return res.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
  });

  const faqs = faqsRes.data || [];

  // Memoized computations
  const categories = useMemo(
    () => ["All", ...new Set(faqs.map((faq) => faq.category))],
    [faqs]
  );

  const filteredFAQs = useMemo(
    () =>
      activeCategory === "All"
        ? faqs
        : faqs.filter((faq) => faq.category === activeCategory),
    [faqs, activeCategory]
  );

  const totalPages = useMemo(
    () => Math.ceil(filteredFAQs.length / FAQS_PER_PAGE),
    [filteredFAQs.length]
  );

  const paginatedFAQs = useMemo(
    () =>
      filteredFAQs.slice(
        (currentPage - 1) * FAQS_PER_PAGE,
        currentPage * FAQS_PER_PAGE
      ),
    [filteredFAQs, currentPage]
  );

  // Event handlers
  const toggleFAQ = useCallback(
    (index) => {
      setOpenIndex(index === openIndex ? null : index);
    },
    [openIndex]
  );

  const handleCategoryChange = useCallback(
    (category) => {
      const newParams = new URLSearchParams(searchParams);
      if (category === "All") {
        newParams.delete("category");
      } else {
        newParams.set("category", category);
      }
      setSearchParams(newParams);
      setCurrentPage(1);
      setOpenIndex(null);
    },
    [searchParams, setSearchParams]
  );

  const goToPage = useCallback(
    (page) => {
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);
      setOpenIndex(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [totalPages]
  );

  const getPaginationRange = useCallback(() => {
    const range = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      const leftBound = Math.max(1, currentPage - 2);
      const rightBound = Math.min(totalPages, currentPage + 2);

      if (leftBound > 1) range.push(1);
      if (leftBound > 2) range.push("...");

      for (let i = leftBound; i <= rightBound; i++) {
        range.push(i);
      }

      if (rightBound < totalPages - 1) range.push("...");
      if (rightBound < totalPages) range.push(totalPages);
    }

    return range;
  }, [currentPage, totalPages]);

  const getCategoryColors = useCallback((category) => {
    return CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F7F8] to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-[#495E57] mx-auto mb-4" />
          <p className="text-[#45474B] text-lg">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F7F8] to-white flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-[#495E57]/10 max-w-md mx-4">
          <h3 className="text-xl font-semibold text-red-600 mb-2">
            Failed to load FAQs
          </h3>
          <p className="text-[#45474B]/70 mb-4">
            {error?.message || "Please try again later"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#495E57]/10 text-[#495E57] px-4 py-2 rounded-lg font-medium hover:bg-[#495E57]/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F7F8] to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-[#495E57]/10 rounded-full text-[#495E57] font-medium mb-4">
            <Star size={16} className="text-[#F4CE14] mr-2" fill="#F4CE14" />
            Need Help?
          </div>
          <h2 className="text-4xl font-bold text-[#45474B] mb-4">
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#495E57] to-[#F4CE14]">
              Questions
            </span>
          </h2>
          <p className="text-xl text-[#45474B]/70 max-w-3xl mx-auto">
            Find answers to common questions about MCMS
          </p>
        </div>

        {/* Category Filter */}
        <div
          className="flex flex-wrap gap-3 justify-center mb-8"
          role="tablist"
          aria-label="FAQ categories"
        >
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2 ${
                  isActive
                    ? "bg-gradient-to-r from-[#495E57] to-[#495E57]/90 text-white shadow-sm"
                    : "bg-white text-[#45474B] hover:bg-[#495E57]/5 border border-[#495E57]/20"
                }`}
                role="tab"
                aria-selected={isActive}
                aria-controls="faq-content"
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* FAQ List */}
        <div
          id="faq-content"
          className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#495E57]/10 divide-y divide-[#495E57]/10"
          role="tabpanel"
        >
          {paginatedFAQs.length > 0 ? (
            paginatedFAQs.map((faq, index) => {
              const isOpen = openIndex === index;
              const categoryColors = getCategoryColors(faq.category);

              return (
                <div
                  key={faq._id || index}
                  className={`transition-colors duration-200 ${
                    isOpen ? "bg-[#495E57]/5" : "hover:bg-[#495E57]/3"
                  }`}
                >
                  <button
                    className="w-full text-left p-6 flex justify-between items-start gap-4 focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-inset rounded-lg"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`mt-1 p-2 rounded-lg ${categoryColors.bg} ${categoryColors.text} shrink-0`}
                        aria-hidden="true"
                      >
                        <HelpCircle size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-semibold text-[#45474B] text-left leading-relaxed">
                          {faq.question}
                        </p>
                        <span
                          className={`inline-block mt-2 text-xs font-medium ${categoryColors.bg} ${categoryColors.text} px-3 py-1 rounded-full`}
                        >
                          {faq.category}
                        </span>
                      </div>
                    </div>
                    <span
                      className="text-[#495E57] shrink-0 mt-1 transition-transform duration-200"
                      aria-hidden="true"
                    >
                      {isOpen ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      id={`faq-answer-${index}`}
                      className="px-6 pb-6 ml-16 text-[#45474B]/70 leading-relaxed animate-fadeIn"
                      aria-live="polite"
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-[#45474B]/70">
              No questions found in this category
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex justify-center items-center gap-2 mt-8"
            aria-label="Pagination"
          >
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-[#495E57]/20 hover:bg-[#495E57]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1 text-[#45474B] focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2"
              aria-label="Go to previous page"
            >
              <ChevronDown className="rotate-90" size={16} aria-hidden="true" />
              Previous
            </button>

            {getPaginationRange().map((page, index) =>
              page === "..." ? (
                <span
                  key={index}
                  className="px-2 py-1 text-[#45474B]/50"
                  aria-hidden="true"
                >
                  ...
                </span>
              ) : (
                <button
                  key={index}
                  onClick={() => goToPage(page)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2 ${
                    currentPage === page
                      ? "bg-gradient-to-r from-[#495E57] to-[#495E57]/90 text-white shadow-sm"
                      : "hover:bg-[#495E57]/5 text-[#45474B]"
                  }`}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-[#495E57]/20 hover:bg-[#495E57]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1 text-[#45474B] focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2"
              aria-label="Go to next page"
            >
              Next
              <ChevronDown
                className="-rotate-90"
                size={16}
                aria-hidden="true"
              />
            </button>
          </div>
        )}

        {/* Results Info */}
        {filteredFAQs.length > 0 && (
          <div
            className="text-center mt-4 text-[#45474B]/60 text-sm"
            aria-live="polite"
            aria-atomic="true"
          >
            Showing{" "}
            {Math.min(
              (currentPage - 1) * FAQS_PER_PAGE + 1,
              filteredFAQs.length
            )}{" "}
            - {Math.min(currentPage * FAQS_PER_PAGE, filteredFAQs.length)} of{" "}
            {filteredFAQs.length} questions
            {activeCategory !== "All" && ` in "${activeCategory}"`}
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-[#495E57]/5 to-[#F4CE14]/5 rounded-2xl p-8 border border-[#495E57]/10">
            <h3 className="text-2xl font-semibold text-[#45474B] mb-3">
              Still need help?
            </h3>
            <p className="text-[#45474B]/70 mb-6 max-w-2xl mx-auto leading-relaxed">
              Can't find what you're looking for? Our support team is ready to
              assist you with any questions.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#495E57] to-[#495E57]/90 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2"
              aria-label="Contact our support team"
            >
              Contact Support
              <ChevronDown
                className="ml-1 -rotate-90 group-hover:translate-x-1 transition-transform duration-200"
                size={18}
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(FAQs);
