import { Star, User, MessageSquare, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

const FeedbackRatings = () => {
  const {
    data: feedbacks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["homeFeedback"],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/feedback?limit=6`);
      if (!res.ok) throw new Error("Failed to fetch feedback");
      return res.json();
    },
  });

  const averageRating =
    feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length ||
    0;

  // Calculate rating distribution
  const ratingDistribution = [0, 0, 0, 0, 0];
  feedbacks.forEach((feedback) => {
    ratingDistribution[feedback.rating - 1]++;
  });

  if (isError) {
    return (
      <div className="bg-gradient-to-b from-[#F5F7F8] to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center text-red-500">
          Failed to load feedback. Please try again later.
        </div>
      </div>
    );
  }

  // Simple loading skeleton component
  const LoadingSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-[#495E57]/10 overflow-hidden h-48 animate-pulse">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-[#495E57]/10 p-2 rounded-full mr-3 h-9 w-9"></div>
          <div className="space-y-2">
            <div className="h-4 bg-[#495E57]/10 rounded w-24"></div>
            <div className="h-3 bg-[#495E57]/10 rounded w-16"></div>
          </div>
        </div>
        <div className="flex mb-3 space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className="h-5 w-5 bg-[#495E57]/10 rounded"></div>
          ))}
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-[#495E57]/10 rounded"></div>
          <div className="h-4 bg-[#495E57]/10 rounded w-5/6"></div>
        </div>
        <div className="h-3 bg-[#495E57]/10 rounded w-16"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-[#F5F7F8] to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-[#495E57]/10 rounded-full text-[#495E57] font-medium mb-4">
            <MessageSquare className="mr-2" size={20} />
            Participant Feedback
          </div>
          <h2 className="text-4xl font-bold text-[#45474B] mb-4">
            What Our
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#495E57] to-[#F4CE14]">
              {" "}
              Participants Say
            </span>
          </h2>
          <p className="text-xl text-[#45474B]/70 max-w-3xl mx-auto">
            Hear from those who have experienced our medical camps firsthand
          </p>
        </div>

        {/* Rating Summary */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#495E57]/10 p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-5xl font-bold text-[#45474B] mb-2">
                {isLoading ? "..." : averageRating.toFixed(1)}
                <span className="text-2xl text-[#45474B]/60">/5</span>
              </div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 ${
                      star <= Math.round(averageRating)
                        ? "fill-[#F4CE14] text-[#F4CE14]"
                        : "text-[#495E57]/30"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[#45474B]/70">
                {isLoading
                  ? "Loading reviews..."
                  : `Based on ${feedbacks.length} reviews`}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 w-full max-w-md">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3 mb-2">
                  <div className="flex items-center w-10">
                    <span className="text-[#45474B]">{rating}</span>
                    <Star className="h-4 w-4 fill-[#F4CE14] text-[#F4CE14] ml-1" />
                  </div>
                  <div className="flex-1 h-3 bg-[#495E57]/10 rounded-full overflow-hidden">
                    {!isLoading && (
                      <div
                        className="h-full bg-[#F4CE14]"
                        style={{
                          width: `${
                            (ratingDistribution[rating - 1] /
                              feedbacks.length) *
                              100 || 0
                          }%`,
                        }}
                      ></div>
                    )}
                  </div>
                  <span className="text-sm text-[#45474B]/60 w-8 text-right">
                    {isLoading ? "-" : ratingDistribution[rating - 1]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isLoading
            ? [...Array(6)].map((_, i) => <LoadingSkeleton key={i} />)
            : feedbacks.map((feedback) => (
                <div
                  key={feedback._id}
                  className="bg-white rounded-xl shadow-sm border border-[#495E57]/10 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-[#495E57]/10 p-2 rounded-full mr-3 group-hover:bg-[#495E57]/20 transition-colors">
                        {feedback.participantPhotoURL ? (
                          <img
                            src={feedback.participantPhotoURL}
                            alt="Participant photo"
                            className="h-6 w-6 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-[#495E57]" />
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold text-[#45474B]">
                          {feedback.participantName || "Anonymous"}
                        </h3>
                        <p className="text-xs text-[#495E57]">
                          {feedback.campName}
                        </p>
                      </div>
                    </div>

                    <div className="flex mb-3">
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
                      <p className="text-[#45474B]/70 mb-4 italic leading-relaxed">
                        "{feedback.feedback}"
                      </p>
                    )}

                    <p className="text-xs text-[#45474B]/50">
                      {new Date(feedback.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <Link
            to="/feedback"
            className="inline-flex items-center text-[#495E57] hover:text-[#45474B] font-medium transition-colors group/link"
          >
            View All Feedback
            <ChevronRight
              className="ml-1 text-[#F4CE14] group-hover/link:translate-x-1 transition-transform"
              size={16}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeedbackRatings;
