import React, { useState } from 'react';
import { Star, Plus, X, Image as ImageIcon } from 'lucide-react';

const FeedbackModal = ({ campId, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [images, setImages] = useState([]);
  const [imageInput, setImageInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddImage = (e) => {
    e.preventDefault();
    if (!imageInput.trim()) return;
    if (images.length >= 5) return;
    setImages((prev) => [...prev, imageInput.trim()]);
    setImageInput('');
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ campId, rating, feedback, images });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-950 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Submit Review & Photos
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Overall Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none cursor-pointer"
                >
                  <Star
                    size={24}
                    className={
                      star <= rating
                        ? 'fill-[#F4CE14] text-[#F4CE14]'
                        : 'text-slate-300 dark:text-slate-700'
                    }
                  />
                </button>
              ))}
              <span className="ml-2 font-bold text-sm text-slate-800 dark:text-slate-200 font-mono">
                {rating}.0
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Feedback & Comments
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your experience with the healthcare camp..."
              className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#495E57]"
              required
            />
          </div>

          {/* Multiple Image Uploads Section */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Review Photos (Max 5)
            </label>

            <div className="flex gap-2 mb-3">
              <input
                type="url"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="Paste photo URL (e.g. ImgBB / Unsplash)"
                className="flex-1 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#495E57]"
              />
              <button
                type="button"
                onClick={handleAddImage}
                disabled={!imageInput.trim() || images.length >= 5}
                className="px-3 py-2 bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 rounded-xl text-xs font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>

            {/* Thumbnail previews */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {images.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group"
                  >
                    <img
                      src={url}
                      alt={`Review photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-red-600 transition"
                      aria-label="Remove image"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold rounded-xl text-sm hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm transition"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
