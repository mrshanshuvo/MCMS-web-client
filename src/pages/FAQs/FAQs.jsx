import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const categoryColors = {
  General: "bg-blue-100 text-blue-800",
  Registration: "bg-purple-100 text-purple-800",
  Payments: "bg-green-100 text-green-800",
  Organizers: "bg-amber-100 text-amber-800",
  Eligibility: "bg-red-100 text-red-800",
  Feedback: "bg-teal-100 text-teal-800",
};

const FAQS_PER_PAGE = 5;

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const axiosSecure = useAxiosSecure();

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
  });

  const faqs = faqsRes.data || [];

  const toggleFAQ = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  const filteredFAQs =
    activeCategory === "All"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  const totalPages = Math.ceil(filteredFAQs.length / FAQS_PER_PAGE);
  const paginatedFAQs = filteredFAQs.slice(
    (currentPage - 1) * FAQS_PER_PAGE,
    currentPage * FAQS_PER_PAGE
  );

  const categories = ["All", ...new Set(faqs.map((faq) => faq.category))];

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setOpenIndex(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate pagination range with ellipsis
  const getPaginationRange = () => {
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
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-white flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md mx-4">
          <h3 className="text-xl font-semibold text-red-600 mb-2">
            Failed to load FAQs
          </h3>
          <p className="text-gray-600 mb-4">
            {error.message || "Please try again later"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 font-medium mb-4">
            <HelpCircle className="mr-2" size={20} />
            Need Help?
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Questions
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about MCMS
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setCurrentPage(1);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? `${
                      categoryColors[category] || "bg-gray-100 text-gray-800"
                    } shadow-md`
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 divide-y divide-gray-100">
          {paginatedFAQs.length > 0 ? (
            paginatedFAQs.map((faq, index) => (
              <div
                key={faq._id || index}
                className={`transition-colors ${
                  openIndex === index ? "bg-blue-50/20" : "hover:bg-gray-50"
                }`}
              >
                <button
                  className="w-full text-left p-6 flex justify-between items-start gap-4"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-1 p-2 rounded-lg ${
                        categoryColors[faq.category] || "bg-gray-100"
                      }`}
                    >
                      <HelpCircle size={18} />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900 text-left">
                        {faq.question}
                      </p>
                      <span
                        className={`inline-block mt-2 text-xs font-medium ${
                          categoryColors[faq.category] || "text-gray-500"
                        } px-2 py-1 rounded-full`}
                      >
                        {faq.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-gray-500 shrink-0 mt-1">
                    {openIndex === index ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6 ml-16 text-gray-700 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No questions found in this category
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
            >
              <ChevronDown className="rotate-90" size={16} />
              Previous
            </button>

            {getPaginationRange().map((page, index) =>
              page === "..." ? (
                <span key={index} className="px-2 py-1 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={index}
                  onClick={() => goToPage(page)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                    currentPage === page
                      ? "bg-blue-600 text-white shadow-md"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
            >
              Next
              <ChevronDown className="-rotate-90" size={16} />
            </button>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Still need help?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is ready to
              assist you with any questions.
            </p>
            <button
              onClick={() => (window.location.href = "/contact")}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all group"
            >
              Contact Support
              <ChevronDown
                className="ml-1 -rotate-90 group-hover:translate-x-1 transition-transform"
                size={18}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
