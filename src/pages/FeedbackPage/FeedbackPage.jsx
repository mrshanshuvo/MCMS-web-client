import {
  Star,
  User,
  MessageSquare,
  ChevronLeft,
  Search,
  Filter,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router";
import { useState, useMemo } from "react";

const FeedbackPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [ratingFilter, setRatingFilter] = useState(
    searchParams.get("rating") || "all"
  );

  const {
    data: feedbacks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allFeedback"],
    queryFn: async () => {
      const res = await fetch(`https://mcms-server-red.vercel.app/feedback`);
      if (!res.ok) throw new Error("Failed to fetch feedback");
      return res.json();
    },
  });

  // Calculate statistics
  const stats = useMemo(() => {
    const total = feedbacks.length;
    const average =
      total > 0
        ? feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / total
        : 0;

    const distribution = [0, 0, 0, 0, 0];
    feedbacks.forEach((feedback) => {
      distribution[feedback.rating - 1]++;
    });

    return { total, average, distribution };
  }, [feedbacks]);

  // Filter feedbacks
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((feedback) => {
      const matchesSearch =
        searchTerm === "" ||
        feedback.participantName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        feedback.campName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.feedback?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRating =
        ratingFilter === "all" || feedback.rating === parseInt(ratingFilter);

      return matchesSearch && matchesRating;
    });
  }, [feedbacks, searchTerm, ratingFilter]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("search", value);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const handleRatingFilter = (rating) => {
    setRatingFilter(rating);
    const newParams = new URLSearchParams(searchParams);
    if (rating !== "all") {
      newParams.set("rating", rating);
    } else {
      newParams.delete("rating");
    }
    setSearchParams(newParams);
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F7F8] to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-red-800 mb-4">
              Failed to Load Feedback
            </h2>
            <p className="text-red-600 mb-6">Please try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-[#495E57]/10 overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-[#495E57]/10 rounded-full h-12 w-12 mr-4"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-[#495E57]/10 rounded w-1/3"></div>
            <div className="h-3 bg-[#495E57]/10 rounded w-1/4"></div>
          </div>
        </div>
        <div className="flex mb-4 space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className="h-5 w-5 bg-[#495E57]/10 rounded"></div>
          ))}
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-[#495E57]/10 rounded"></div>
          <div className="h-4 bg-[#495E57]/10 rounded w-5/6"></div>
          <div className="h-4 bg-[#495E57]/10 rounded w-2/3"></div>
        </div>
        <div className="h-3 bg-[#495E57]/10 rounded w-1/4"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F7F8] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center text-[#495E57] hover:text-[#45474B] transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="ml-1">Back to Home</span>
            </Link>
          </div>
          <div className="inline-flex items-center px-4 py-2 bg-[#495E57]/10 rounded-full text-[#495E57] font-medium">
            <MessageSquare className="mr-2" size={20} />
            All Feedback
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#45474B] mb-4">
            Participant
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#495E57] to-[#F4CE14]">
              {" "}
              Feedback
            </span>
          </h1>
          <p className="text-xl text-[#45474B]/70 max-w-3xl mx-auto">
            Read what our participants have to say about their medical camp
            experiences
          </p>
        </div>

        {/* Statistics Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#495E57]/10 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-5xl font-bold text-[#45474B] mb-2">
                {isLoading ? "..." : stats.average.toFixed(1)}
                <span className="text-2xl text-[#45474B]/60">/5</span>
              </div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 ${
                      star <= Math.round(stats.average)
                        ? "fill-[#F4CE14] text-[#F4CE14]"
                        : "text-[#495E57]/30"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[#45474B]/70">
                {isLoading ? "Loading..." : `Based on ${stats.total} reviews`}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-[#45474B] mb-4">
                Rating Distribution
              </h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex items-center w-12">
                      <span className="text-[#45474B] font-medium">
                        {rating}
                      </span>
                      <Star className="h-4 w-4 fill-[#F4CE14] text-[#F4CE14] ml-2" />
                    </div>
                    <div className="flex-1 h-3 bg-[#495E57]/10 rounded-full overflow-hidden">
                      {!isLoading && stats.total > 0 && (
                        <div
                          className="h-full bg-[#F4CE14] transition-all duration-500"
                          style={{
                            width: `${
                              (stats.distribution[rating - 1] / stats.total) *
                              100
                            }%`,
                          }}
                        ></div>
                      )}
                    </div>
                    <span className="text-sm text-[#45474B]/60 w-12 text-right">
                      {isLoading ? "-" : stats.distribution[rating - 1]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-[#495E57]/10 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#495E57]"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by participant, camp, or feedback..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#495E57]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:border-[#495E57] bg-white"
              />
            </div>

            {/* Rating Filter */}
            <div className="flex items-center gap-2">
              <Filter className="text-[#495E57]" size={20} />
              <select
                value={ratingFilter}
                onChange={(e) => handleRatingFilter(e.target.value)}
                className="px-4 py-3 border border-[#495E57]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:border-[#495E57] bg-white"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-[#45474B]/70">
            {isLoading
              ? "Loading..."
              : `Showing ${filteredFeedbacks.length} of ${feedbacks.length} feedback entries`}
          </p>
        </div>

        {/* Feedback Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {isLoading ? (
            [...Array(6)].map((_, i) => <LoadingSkeleton key={i} />)
          ) : filteredFeedbacks.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#495E57]/10 mb-4">
                <Search className="h-8 w-8 text-[#495E57]" />
              </div>
              <h3 className="text-xl font-semibold text-[#45474B] mb-2">
                No feedback found
              </h3>
              <p className="text-[#45474B]/70">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          ) : (
            filteredFeedbacks.map((feedback) => (
              <div
                key={feedback._id}
                className="bg-white rounded-xl shadow-sm border border-[#495E57]/10 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="bg-[#495E57]/10 p-2 rounded-full mr-4 group-hover:bg-[#495E57]/20 transition-colors">
                      {feedback.participantPhotoURL ? (
                        <img
                          src={feedback.participantPhotoURL}
                          alt="Participant photo"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-[#495E57]" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-[#45474B] text-lg">
                        {feedback.participantName || "Anonymous"}
                      </h3>
                      <p className="text-[#495E57] font-medium">
                        {feedback.campName}
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= feedback.rating
                            ? "fill-[#F4CE14] text-[#F4CE14]"
                            : "text-[#495E57]/30"
                        }`}
                      />
                    ))}
                  </div>

                  {feedback.feedback && (
                    <p className="text-[#45474B]/70 mb-4 leading-relaxed text-base">
                      "{feedback.feedback}"
                    </p>
                  )}

                  <div className="flex justify-between items-center">
                    <p className="text-sm text-[#45474B]/50">
                      {new Date(feedback.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        feedback.rating >= 4
                          ? "bg-green-50 text-green-700"
                          : feedback.rating >= 3
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {feedback.rating} Star{feedback.rating !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
