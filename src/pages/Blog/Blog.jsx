import React, { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { CalendarDays, Clock, User, ArrowRight, Star } from "lucide-react";
import { Link, useSearchParams } from "react-router";

// Constants
const POSTS_PER_PAGE = 6;
const CATEGORY_COLORS = {
  "Success Stories": { bg: "bg-green-100", text: "text-green-800" },
  "Tips & Guides": { bg: "bg-blue-100", text: "text-blue-800" },
  "Medical News": { bg: "bg-purple-100", text: "text-purple-800" },
  default: { bg: "bg-[#495E57]/10", text: "text-[#495E57]" },
};

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const axiosSecure = useAxiosSecure();

  // Get initial state from URL params
  const selectedCategory = searchParams.get("category") || "All";

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosSecure.get("/blogs");
      return res.data.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Memoized computations
  const categories = useMemo(
    () => ["All", ...new Set(posts.map((post) => post.category))],
    [posts],
  );

  const filteredPosts = useMemo(
    () =>
      selectedCategory === "All"
        ? posts
        : posts.filter((post) => post.category === selectedCategory),
    [posts, selectedCategory],
  );

  const featuredPosts = useMemo(
    () => posts.filter((post) => post.featured).slice(0, 3),
    [posts],
  );

  const totalPages = useMemo(
    () => Math.ceil(filteredPosts.length / POSTS_PER_PAGE),
    [filteredPosts.length],
  );

  const currentPosts = useMemo(
    () =>
      filteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE,
      ),
    [filteredPosts, currentPage],
  );

  // Event handlers
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
    },
    [searchParams, setSearchParams],
  );

  const goToPage = useCallback(
    (page) => {
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [totalPages],
  );

  const getPaginationRange = useCallback(() => {
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  const getCategoryColors = useCallback((category) => {
    return CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F7F8] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#495E57] mx-auto mb-4"></div>
          <p className="text-[#45474B] text-lg">Loading blog posts...</p>
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
            Failed to load posts
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-[#495E57]/10 rounded-full text-[#495E57] font-medium mb-4">
            <Star size={16} className="text-[#F4CE14] mr-2" fill="#F4CE14" />
            Latest Updates
          </div>
          <h2 className="text-4xl font-bold text-[#45474B] mb-4">
            CareCamp
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#495E57] to-[#F4CE14]">
              {" "}
              Blog & Insights
            </span>
          </h2>
          <p className="text-xl text-[#45474B]/70 max-w-3xl mx-auto">
            Discover success stories, best practices, and innovations in medical
            camp management
          </p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 &&
          currentPage === 1 &&
          selectedCategory === "All" && (
            <div className="mb-16">
              <h3 className="text-2xl font-semibold text-[#45474B] mb-8 flex items-center gap-2">
                <span className="w-4 h-4 bg-[#495E57] rounded-full"></span>
                Featured Stories
              </h3>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredPosts.map((post) => {
                  const categoryColors = getCategoryColors(post.category);
                  return (
                    <article
                      key={post._id}
                      className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-[#495E57]/10 group"
                    >
                      <div className="relative">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          width={400}
                          height={240}
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-gradient-to-r from-[#495E57] to-[#495E57]/90 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                            Featured
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors.bg} ${categoryColors.text}`}
                          >
                            {post.category}
                          </span>
                          <div className="flex items-center text-xs text-[#45474B]/60">
                            <Clock className="w-3 h-3 mr-1" />
                            {post.readingTime}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-[#45474B] line-clamp-2 group-hover:text-[#495E57] transition-colors">
                          {post.title}
                        </h3>
                        <div className="flex items-center text-sm text-[#45474B]/60 mb-4">
                          <User className="w-4 h-4 mr-1" />
                          {post.author} •
                          <CalendarDays className="w-4 h-4 ml-2 mr-1" />
                          {post.date}
                        </div>
                        <p className="text-[#45474B]/70 mb-5 line-clamp-3 leading-relaxed">
                          {post.summary}
                        </p>
                        <Link
                          to={`/blog/${post._id}`}
                          className="inline-flex items-center text-[#495E57] hover:text-[#45474B] font-medium text-sm group/link transition-colors focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2 rounded"
                          aria-label={`Read more about ${post.title}`}
                        >
                          Read More
                          <ArrowRight className="ml-1 w-4 h-4 text-[#F4CE14] group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

        {/* Category Filter */}
        <div className="mb-8">
          <div
            className="flex flex-wrap gap-3 justify-center"
            role="tablist"
            aria-label="Blog categories"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-[#495E57] to-[#495E57]/90 text-white shadow-sm"
                    : "bg-white text-[#45474B] hover:bg-[#495E57]/5 border border-[#495E57]/20"
                }`}
                role="tab"
                aria-selected={selectedCategory === category}
                aria-controls="blog-posts"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <>
            <div
              id="blog-posts"
              role="tabpanel"
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {currentPosts.map((post) => {
                const categoryColors = getCategoryColors(post.category);
                return (
                  <article
                    key={post._id}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-[#495E57]/10 group"
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      width={400}
                      height={192}
                    />
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors.bg} ${categoryColors.text}`}
                        >
                          {post.category}
                        </span>
                        <div className="flex items-center text-xs text-[#45474B]/60">
                          <Clock className="w-3 h-3 mr-1" />
                          {post.readingTime}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-3 text-[#45474B] line-clamp-2 group-hover:text-[#495E57] transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center text-sm text-[#45474B]/60 mb-4">
                        <User className="w-4 h-4 mr-1" />
                        {post.author} •
                        <CalendarDays className="w-4 h-4 ml-2 mr-1" />
                        {post.date}
                      </div>
                      <p className="text-[#45474B]/70 mb-5 line-clamp-3 leading-relaxed">
                        {post.summary}
                      </p>
                      <Link
                        to={`/blog/${post._id}`}
                        className="inline-flex items-center text-[#495E57] hover:text-[#45474B] font-medium text-sm group/link transition-colors focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2 rounded"
                        aria-label={`Read more about ${post.title}`}
                      >
                        Read More
                        <ArrowRight className="ml-1 w-4 h-4 text-[#F4CE14] group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                className="flex justify-center items-center gap-2 mt-12"
                aria-label="Pagination"
              >
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-[#495E57]/20 hover:bg-[#495E57]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1 text-[#45474B] focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2"
                  aria-label="Go to previous page"
                >
                  Previous
                </button>

                {getPaginationRange().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2 ${
                      currentPage === pageNum
                        ? "bg-gradient-to-r from-[#495E57] to-[#495E57]/90 text-white shadow-sm"
                        : "hover:bg-[#495E57]/5 text-[#45474B]"
                    }`}
                    aria-label={`Go to page ${pageNum}`}
                    aria-current={currentPage === pageNum ? "page" : undefined}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-[#495E57]/20 hover:bg-[#495E57]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1 text-[#45474B] focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2"
                  aria-label="Go to next page"
                >
                  Next
                </button>
              </div>
            )}

            {/* Results Info */}
            <div
              className="text-center mt-8 text-[#45474B]/60"
              aria-live="polite"
              aria-atomic="true"
            >
              Showing{" "}
              <span className="font-medium">
                {Math.min(
                  (currentPage - 1) * POSTS_PER_PAGE + 1,
                  filteredPosts.length,
                )}
              </span>{" "}
              -{" "}
              <span className="font-medium">
                {Math.min(currentPage * POSTS_PER_PAGE, filteredPosts.length)}
              </span>{" "}
              of <span className="font-medium">{filteredPosts.length}</span>{" "}
              posts
              {selectedCategory !== "All" && ` in "${selectedCategory}"`}
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-[#495E57]/10">
            <p className="text-[#45474B]/70 text-lg mb-4">
              No posts found in this category.
            </p>
            <button
              onClick={() => handleCategoryChange("All")}
              className="px-4 py-2 bg-[#495E57]/10 text-[#495E57] rounded-lg font-medium hover:bg-[#495E57]/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2"
            >
              View All Posts
            </button>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 bg-gradient-to-r from-[#495E57]/5 to-[#F4CE14]/5 rounded-2xl p-8 sm:p-10 text-center border border-[#495E57]/10">
          <h3 className="text-2xl font-semibold text-[#45474B] mb-3">
            Stay Updated
          </h3>
          <p className="text-[#45474B]/70 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest medical camp insights and
            success stories.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg border border-[#495E57]/20 focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:border-transparent bg-white"
              aria-label="Email address for newsletter subscription"
            />
            <button
              className="px-6 py-3 bg-gradient-to-r from-[#495E57] to-[#495E57]/90 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2"
              aria-label="Subscribe to newsletter"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Blog);
