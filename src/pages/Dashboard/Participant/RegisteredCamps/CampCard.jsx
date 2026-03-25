import React, { useState } from "react";
import { format } from "date-fns";
import { MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import StatusBadge from "./StatusBadge";

const CampCard = ({ camp, onPay, onCancel, onFeedback, isCancelling, feedbackDisabled }) => {
  const [expanded, setExpanded] = useState(false);
  const participant = camp.participants[0];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{camp.name}</h3>
            <p className="text-xs text-gray-500">
              {format(new Date(camp.dateTime), "MMM d, yyyy h:mm a")}
            </p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-[#ff1e00] transition-colors cursor-pointer p-1"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {expanded && (
          <div className="mt-4 space-y-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Location:</span>
              <span className="text-sm font-medium text-gray-900">{camp.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Fees:</span>
              <span className="text-sm font-bold text-[#ff1e00]">${camp.fees}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Participant:</span>
              <span className="text-sm font-medium text-gray-900">
                {participant?.participantName || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Payment:</span>
              <StatusBadge status={participant?.paymentStatus} />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 px-4 py-3 bg-[#e8f9fd]/30 flex gap-2">
        {participant?.paymentStatus !== "Paid" ? (
          <>
            <button
              onClick={() => onPay(camp)}
              className="flex-1 px-3 py-2 text-sm bg-[#ff1e00] text-white rounded-lg hover:bg-[#ff1e00]/90 transition-all cursor-pointer font-medium"
            >
              Pay Now
            </button>
            <button
              onClick={() => onCancel(camp._id)}
              disabled={isCancelling}
              className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-[#e8f9fd] hover:text-[#ff1e00] transition-all cursor-pointer font-medium disabled:opacity-50"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onFeedback(camp)}
              disabled={feedbackDisabled}
              className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all font-medium ${feedbackDisabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#ff1e00] text-white hover:bg-[#ff1e00]/90 cursor-pointer"
                }`}
            >
              {feedbackDisabled ? "Feedback Submitted" : "Give Feedback"}
            </button>
            <button
              disabled
              className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed font-medium"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CampCard;