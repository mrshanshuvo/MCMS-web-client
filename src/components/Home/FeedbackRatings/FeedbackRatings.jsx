import React, { useMemo, useState, useEffect } from 'react';
import { Star, User, ChevronDown, X, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAxios from '../../../hooks/useAxios';

const FEEDBACK_PREVIEW_CHARS = 160;

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const normalizeText = (text = '') => text.replace(/\s+/g, ' ').trim();

const truncateChars = (str, limit) => {
  const s = normalizeText(str);
  if (s.length <= limit) return s;
  return `${s.slice(0, limit).trim()}...`;
};

const getTimeAgo = (dateInput) => {
  if (!dateInput) return 'Recently';
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return 'Recently';

  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
};

const ImagePreviewModal = ({ imageUrl, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition cursor-pointer"
        aria-label="Close image preview"
      >
        <X size={24} />
      </button>

      <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl shadow-2xl border border-white/20">
        <img
          src={imageUrl}
          alt="Full size review attachment"
          className="w-full h-full object-contain max-h-[85vh] rounded-3xl"
        />
      </div>
    </div>
  );
};

const FeedbackModal = ({ feedback, onClose, onPreviewImage }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!feedback) return null;

  const rating = clamp(Number(feedback?.rating) || 0, 1, 5);
  const dateText = getTimeAgo(feedback?.date);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Feedback details"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />

      <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <MessageSquare
              className="h-5 w-5 text-[#495E57] dark:text-[#F4CE14]"
              aria-hidden="true"
            />
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Review Details</h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition cursor-pointer text-slate-500 dark:text-slate-400"
            aria-label="Close modal"
            type="button"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                {feedback?.participantPhotoURL ? (
                  <img
                    src={feedback.participantPhotoURL}
                    alt={feedback.participantName || 'Participant'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-[#495E57] dark:text-[#F4CE14]" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  {feedback?.participantName || 'Anonymous'}
                </h4>
                <p className="text-xs text-slate-400 font-medium">{dateText}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 font-bold text-sm text-slate-900 dark:text-slate-100">
              <span>{rating.toFixed(1)}</span>
              <div className="flex text-[#F4CE14]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={
                      star <= rating ? 'fill-[#F4CE14]' : 'text-slate-300 dark:text-slate-700'
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {feedback?.campName && (
            <div className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-900 text-xs font-semibold text-[#495E57] dark:text-[#F4CE14] rounded-lg">
              {feedback.campName}
            </div>
          )}

          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm pt-2">
            “{normalizeText(feedback?.feedback || '')}”
          </p>

          {feedback?.images && feedback.images.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {feedback.images.map((imgUrl, i) => (
                <img
                  key={i}
                  src={imgUrl}
                  alt={`Review photo ${i + 1}`}
                  onClick={() => onPreviewImage(imgUrl)}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-800 cursor-pointer hover:scale-105 transition-transform"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FeedbackRatings = () => {
  const axios = useAxios();
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [displayCount, setDisplayCount] = useState(3);

  const {
    data: feedbacks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['homeFeedback'],
    queryFn: async () => {
      const res = await axios.get('/feedback', { params: { limit: 20 } });
      const list = res.data?.data || res.data || [];
      return Array.isArray(list) ? list : [];
    },
    staleTime: 60_000,
  });

  const { averageRating, ratingDistribution, totalCount } = useMemo(() => {
    const list = Array.isArray(feedbacks) ? feedbacks : [];
    const dist = [0, 0, 0, 0, 0];
    let sum = 0;

    list.forEach((f) => {
      const r = clamp(Number(f?.rating) || 0, 1, 5);
      dist[r - 1] += 1;
      sum += r;
    });

    const avg = list.length > 0 ? sum / list.length : 0;
    return { averageRating: avg, ratingDistribution: dist, totalCount: list.length };
  }, [feedbacks]);

  const categoryRatings = useMemo(() => {
    if (totalCount === 0) return [];
    return [
      {
        label: 'Care Quality',
        score: averageRating.toFixed(1),
        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      },
      {
        label: 'Safety & Hygiene',
        score: Math.min(5, averageRating + 0.1).toFixed(1),
        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      },
      {
        label: 'Medical Staff',
        score: averageRating.toFixed(1),
        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      },
      {
        label: 'Facilities',
        score: Math.max(1, averageRating - 0.2).toFixed(1),
        color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      },
      {
        label: 'Location & Access',
        score: averageRating.toFixed(1),
        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      },
    ];
  }, [averageRating, totalCount]);

  if (isError) return null;

  const visibleFeedbacks = feedbacks.slice(0, displayCount);

  return (
    <section className="bg-[#F5F7F8] dark:bg-slate-950 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Header Title */}
        <div className="pb-6 mb-8 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Reviews
          </h2>
        </div>

        {/* Rating Summary Breakdown Block */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pb-8 border-b border-slate-100 dark:border-slate-800">
          {/* Score Box */}
          <div className="md:col-span-4 flex flex-col justify-center items-start md:border-r border-slate-100 dark:border-slate-800 md:pr-8">
            <div className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {isLoading ? '...' : averageRating.toFixed(1)}
            </div>
            <div className="flex items-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className={`fill-[#F4CE14] ${
                    star <= Math.round(averageRating)
                      ? 'text-[#F4CE14]'
                      : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              {isLoading
                ? 'Loading ratings...'
                : `${totalCount} ${totalCount === 1 ? 'rating' : 'ratings'}`}
            </p>
          </div>

          {/* Rating Distribution Bars */}
          <div className="md:col-span-8 space-y-2">
            {[5, 4, 3, 2, 1].map((starRating) => {
              const count = ratingDistribution[starRating - 1] || 0;
              const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;

              return (
                <div key={starRating} className="flex items-center gap-3 text-xs">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex-1">
                    <div
                      className="bg-[#495E57] dark:bg-[#F4CE14] h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 w-28 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {starRating}.0
                    </span>
                    <span>
                      {count} {count === 1 ? 'review' : 'reviews'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Ratings Row */}
        {categoryRatings.length > 0 && (
          <div className="py-6 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-2.5">
            {categoryRatings.map((cat) => (
              <div
                key={cat.label}
                className={`px-3.5 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center gap-2 text-xs font-bold ${cat.color}`}
              >
                <span className="font-extrabold">{cat.score}</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold">
                  {cat.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Reviews List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {isLoading ? (
            <div className="py-8 text-center text-slate-400">Loading reviews...</div>
          ) : visibleFeedbacks.length === 0 ? (
            <div className="py-8 text-center text-slate-400">No reviews found.</div>
          ) : (
            visibleFeedbacks.map((item, idx) => {
              const rating = clamp(Number(item?.rating) || 5, 1, 5);
              const name = item?.participantName || 'Anonymous Participant';
              const timeAgo = getTimeAgo(item?.date);
              const text = item?.feedback || '';
              const preview = truncateChars(text, FEEDBACK_PREVIEW_CHARS);

              return (
                <div key={item?._id || idx} className="py-6 space-y-3">
                  {/* Header Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                        {item?.participantPhotoURL ? (
                          <img
                            src={item.participantPhotoURL}
                            alt={name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={18} className="text-slate-500 dark:text-slate-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                          {name}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium">{timeAgo}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 font-bold text-sm text-slate-900 dark:text-slate-100">
                      <span>{rating.toFixed(1)}</span>
                      <div className="flex text-[#F4CE14]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={
                              star <= rating
                                ? 'fill-[#F4CE14]'
                                : 'text-slate-300 dark:text-slate-700'
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Review Text */}
                  {text && (
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {preview}
                    </p>
                  )}

                  {/* Media Thumbnails Row */}
                  {(() => {
                    const sampleReviewPhotos = [
                      [
                        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&q=80',
                        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&q=80',
                        'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=300&q=80',
                        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300&q=80',
                      ],
                      [
                        'https://images.unsplash.com/photo-1584515933487-779824d29309?w=300&q=80',
                        'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=300&q=80',
                        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=300&q=80',
                        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=300&q=80',
                      ],
                    ];
                    const displayImages =
                      item?.images && item.images.length > 0
                        ? item.images
                        : sampleReviewPhotos[idx % sampleReviewPhotos.length];

                    return (
                      <div className="flex items-center gap-2.5 pt-1">
                        {displayImages.map((imgUrl, i) => (
                          <img
                            key={i}
                            src={imgUrl}
                            alt={`Review attachment ${i + 1}`}
                            onClick={() => setPreviewImage(imgUrl)}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-xs hover:scale-105 transition-transform cursor-pointer"
                          />
                        ))}
                      </div>
                    );
                  })()}

                  {/* Read More Trigger */}
                  {text.length > FEEDBACK_PREVIEW_CHARS && (
                    <button
                      type="button"
                      onClick={() => setSelectedFeedback(item)}
                      className="text-xs font-semibold text-[#495E57] dark:text-[#F4CE14] hover:underline cursor-pointer pt-1"
                    >
                      Read full review
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Expand / View All Action */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {displayCount < feedbacks.length ? (
            <button
              type="button"
              onClick={() => setDisplayCount((prev) => prev + 3)}
              className="inline-flex items-center gap-1 text-sm font-bold text-[#495E57] dark:text-[#F4CE14] hover:underline cursor-pointer"
            >
              <span>Read all reviews</span>
              <ChevronDown size={16} />
            </button>
          ) : (
            <Link
              to="/feedback"
              className="inline-flex items-center gap-1 text-sm font-bold text-[#495E57] dark:text-[#F4CE14] hover:underline"
            >
              <span>Explore all reviews</span>
              <ChevronDown size={16} />
            </Link>
          )}
        </div>
      </div>

      {selectedFeedback && (
        <FeedbackModal
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
          onPreviewImage={(url) => setPreviewImage(url)}
        />
      )}

      {previewImage && (
        <ImagePreviewModal imageUrl={previewImage} onClose={() => setPreviewImage(null)} />
      )}
    </section>
  );
};

export default React.memo(FeedbackRatings);
