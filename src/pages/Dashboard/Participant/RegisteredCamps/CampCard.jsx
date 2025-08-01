import React, { useState } from "react";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import StatusBadge from "./StatusBadge";

const CampCard = ({ camp, onPay, onCancel, onFeedback }) => {
  const [expanded, setExpanded] = useState(false);
  const participant = camp.participants[0];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900">{camp.name}</h3>
            <p className="text-xs text-gray-500">
              {format(new Date(camp.dateTime), "MMM d, yyyy h:mm a")}
            </p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-gray-600"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        {expanded && (
          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Location:</span>
              <span className="text-sm font-medium">{camp.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Fees:</span>
              <span className="text-sm font-medium">${camp.fees}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Participant:</span>
              <span className="text-sm font-medium">
                {participant?.participantName || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Payment:</span>
              <StatusBadge status={participant?.paymentStatus} />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex justify-between space-x-2">
        {participant?.paymentStatus !== "Paid" ? (
          <>
            <button
              onClick={() => onPay(camp)}
              className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Pay Now
            </button>
            <button
              onClick={() => onCancel(camp._id)}
              className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onFeedback(camp._id)}
              className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Feedback
            </button>
            <button
              disabled
              className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-gray-300 text-gray-500 rounded cursor-not-allowed"
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
