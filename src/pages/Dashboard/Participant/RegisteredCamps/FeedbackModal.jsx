import React, { useState } from "react";
import { Star, X } from "lucide-react";

const FeedbackModal = ({ campId, onClose, onSubmit, isSubmitting }) => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({ campId, rating, feedback });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-xl w-full max-w-md shadow-xl border border-gray-100">
        <div className="bg-[#ff1e00] p-6 text-white rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Submit Feedback</h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none cursor-pointer transition-transform hover:scale-110"
                >
                  {star <= rating ? (
                    <Star className="fill-[#ff1e00] text-[#ff1e00]" size={28} />
                  ) : (
                    <Star className="text-gray-300" size={28} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#ff1e00] transition-all"
              placeholder="Share your experience..."
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-[#e8f9fd] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#ff1e00] text-white rounded-lg hover:bg-[#ff1e00]/90 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;