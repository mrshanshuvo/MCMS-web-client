import React, { useMemo, useState } from "react";
import { Star, User, MessageSquare, ChevronRight, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxios from "../../../hooks/useAxios";

const FEEDBACK_PREVIEW_CHARS = 140; // ✅ adjust as you want

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const normalizeText = (text = "") =>
  String(text)
    .replace(/\s+/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();

const truncateChars = (text, maxChars) => {
  const t = normalizeText(text);
  if (!t) return "";
  if (t.length <= maxChars) return t;
  return t.slice(0, maxChars).trimEnd() + "…";
};

const FeedbackModal = ({ open, onClose, feedback }) => {
  if (!open || !feedback) return null;

  const rating = clamp(Number(feedback?.rating) || 0, 1, 5);
  const dateText =
    feedback?.date && !Number.isNaN(new Date(feedback.date).getTime())
      ? new Date(feedback.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Feedback details"
      onMouseDown={(e) => {
        // click outside to close
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-[#495E57]/10 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[#495E57]/10">
          <div className="flex items-center gap-2">
            <MessageSquare
              className="h-5 w-5 text-[#495E57]"
              aria-hidden="true"
            />
            <h3 className="font-semibold text-[#45474B]">Full Review</h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#F5F7F8] transition"
            aria-label="Close modal"
            type="button"
          >
            <X className="h-5 w-5 text-[#45474B]" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6">
          {/* header */}
          <div className="flex items-center mb-4">
            <div className="bg-[#495E57]/10 p-2 rounded-full mr-3">
              {feedback?.participantPhotoURL ? (
                <img
                  src={feedback.participantPhotoURL}
                  alt={`${feedback.participantName || "Participant"} photo`}
                  className="h-7 w-7 rounded-full object-cover"
                  loading="lazy"
                />
              ) : (
                <User className="h-5 w-5 text-[#495E57]" aria-hidden="true" />
              )}
            </div>

            <div>
              <h4 className="font-semibold text-[#45474B]">
                {feedback?.participantName || "Anonymous"}
              </h4>
              <p className="text-xs text-[#495E57]">{feedback?.campName}</p>
            </div>
          </div>

          {/* stars */}
          <div className="flex mb-3" aria-label={`${rating} out of 5 stars`}>
            <span className="sr-only">{rating} out of 5 stars</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                aria-hidden="true"
                className={`h-5 w-5 ${
                  star <= rating
                    ? "fill-[#F4CE14] text-[#F4CE14]"
                    : "text-[#495E57]/30"
                }`}
              />
            ))}
          </div>

          {/* full text */}
          {feedback?.feedback && (
            <p className="text-[#45474B]/80 leading-relaxed">
              “{normalizeText(feedback.feedback)}”
            </p>
          )}

          {dateText && (
            <p className="mt-4 text-xs text-[#45474B]/50">{dateText}</p>
          )}
        </div>
      </div>

      {/* ESC close */}
      <span className="sr-only">
        {(() => {
          const onKeyDown = (e) => e.key === "Escape" && onClose();
          window.addEventListener("keydown", onKeyDown, { once: true });
          return null;
        })()}
      </span>
    </div>
  );
};

const FeedbackRatings = () => {
  const axios = useAxios();

  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const modalOpen = Boolean(selectedFeedback);

  const {
    data: feedbacks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["homeFeedback"],
    queryFn: async () => {
      const res = await axios.get("/feedback", { params: { limit: 6 } });
      return res.data || [];
    },
    staleTime: 60_000,
  });

  const { averageRating, ratingDistribution } = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    const sum = feedbacks.reduce((acc, f) => {
      const r = clamp(Number(f?.rating) || 0, 1, 5);
      dist[r - 1] += 1;
      return acc + (Number(f?.rating) || 0);
    }, 0);

    const avg = feedbacks.length ? sum / feedbacks.length : 0;
    return { averageRating: avg, ratingDistribution: dist };
  }, [feedbacks]);

  const LoadingSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-[#495E57]/10 overflow-hidden h-48 animate-pulse">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-[#495E57]/10 p-2 rounded-full mr-3 h-9 w-9" />
          <div className="space-y-2">
            <div className="h-4 bg-[#495E57]/10 rounded w-24" />
            <div className="h-3 bg-[#495E57]/10 rounded w-16" />
          </div>
        </div>
        <div className="flex mb-3 space-x-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-5 w-5 bg-[#495E57]/10 rounded" />
          ))}
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-[#495E57]/10 rounded" />
          <div className="h-4 bg-[#495E57]/10 rounded w-5/6" />
        </div>
        <div className="h-3 bg-[#495E57]/10 rounded w-16" />
      </div>
    </div>
  );

  if (isError) {
    return (
      <div className="bg-gradient-to-b from-[#F5F7F8] to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center text-red-500">
          Failed to load feedback. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-b from-[#F5F7F8] to-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-[#495E57]/10 rounded-full text-[#495E57] font-medium mb-4">
              <MessageSquare className="mr-2" size={20} aria-hidden="true" />
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

                <div
                  className="flex justify-center mb-2"
                  aria-label={`${averageRating.toFixed(1)} out of 5 stars`}
                >
                  <span className="sr-only">
                    {averageRating.toFixed(1)} out of 5 stars
                  </span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      aria-hidden="true"
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
                      <Star
                        className="h-4 w-4 fill-[#F4CE14] text-[#F4CE14] ml-1"
                        aria-hidden="true"
                      />
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
                        />
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
              ? Array.from({ length: 6 }).map((_, i) => (
                  <LoadingSkeleton key={i} />
                ))
              : feedbacks.map((feedback) => {
                  const rating = clamp(Number(feedback?.rating) || 0, 1, 5);

                  const dateText =
                    feedback?.date &&
                    !Number.isNaN(new Date(feedback.date).getTime())
                      ? new Date(feedback.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "";

                  const fullText = normalizeText(feedback?.feedback || "");
                  const previewText = truncateChars(
                    fullText,
                    FEEDBACK_PREVIEW_CHARS,
                  );
                  const isTruncated = fullText.length > previewText.length;

                  return (
                    <div
                      key={
                        feedback?._id ||
                        `${feedback?.participantName}-${feedback?.campName}`
                      }
                      className="bg-white rounded-xl shadow-sm border border-[#495E57]/10 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                    >
                      <div className="p-6 flex flex-col h-full">
                        <div className="flex items-center mb-4">
                          <div className="bg-[#495E57]/10 p-2 rounded-full mr-3 group-hover:bg-[#495E57]/20 transition-colors">
                            {feedback?.participantPhotoURL ? (
                              <img
                                src={feedback.participantPhotoURL}
                                alt={`${
                                  feedback.participantName || "Participant"
                                } photo`}
                                className="h-6 w-6 rounded-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <User
                                className="h-5 w-5 text-[#495E57]"
                                aria-hidden="true"
                              />
                            )}
                          </div>

                          <div>
                            <h3 className="font-semibold text-[#45474B]">
                              {feedback?.participantName || "Anonymous"}
                            </h3>
                            <p className="text-xs text-[#495E57]">
                              {feedback?.campName}
                            </p>
                          </div>
                        </div>

                        <div
                          className="flex mb-3"
                          aria-label={`${rating} out of 5 stars`}
                        >
                          <span className="sr-only">
                            {rating} out of 5 stars
                          </span>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              aria-hidden="true"
                              className={`h-5 w-5 ${
                                star <= rating
                                  ? "fill-[#F4CE14] text-[#F4CE14]"
                                  : "text-[#495E57]/30"
                              }`}
                            />
                          ))}
                        </div>

                        {/* ✅ consistent preview (same max chars) */}
                        {fullText && (
                          <p className="text-[#45474B]/70 mb-4 italic leading-relaxed">
                            “{previewText}”
                          </p>
                        )}

                        {/* footer row */}
                        <div className="mt-auto flex items-center justify-between gap-3">
                          {dateText ? (
                            <p className="text-xs text-[#45474B]/50">
                              {dateText}
                            </p>
                          ) : (
                            <span />
                          )}

                          {/* ✅ view more -> modal */}
                          {fullText && isTruncated && (
                            <button
                              type="button"
                              onClick={() => setSelectedFeedback(feedback)}
                              className="text-sm font-medium text-[#495E57] hover:text-[#45474B] inline-flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              View more
                              <ChevronRight
                                className="h-4 w-4 text-[#F4CE14]"
                                aria-hidden="true"
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Modal */}
      <FeedbackModal
        open={modalOpen}
        feedback={selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
      />
    </>
  );
};

export default FeedbackRatings;
