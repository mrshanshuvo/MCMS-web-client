import React, { useState } from "react";
import { Link } from "react-router";
import { format } from "date-fns";
import { MoreHorizontal, ChevronDown, ChevronUp, MapPin, DollarSign, User, ExternalLink, CreditCard } from "lucide-react";
import StatusBadge from "./StatusBadge";

const CampCard = ({ camp, onPay, onCancel, onFeedback, isCancelling, feedbackDisabled }) => {
  const [expanded, setExpanded] = useState(false);
  const participant = camp.participants[0];

  return (
    <div className="bg-white p-4">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <Link
            to={`/camp-details/${camp._id}`}
            className="group inline-flex items-center gap-2 max-w-full"
          >
            <h3 className="font-bold text-gray-900 truncate group-hover:text-[#ff1e00] transition-colors">
              {camp.name}
            </h3>
            <ExternalLink size={14} className="text-gray-300 group-hover:text-[#ff1e00] transition-colors flex-shrink-0" />
          </Link>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <span className="font-semibold text-[#ff1e00] mr-2">${camp.fees}</span>
            <span className="mx-2 text-gray-300">|</span>
            {format(new Date(camp.dateTime), "MMM d, yyyy")}
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex-shrink-0 p-2 rounded-lg transition-all ${expanded ? "bg-[#ff1e00]/10 text-[#ff1e00]" : "bg-gray-50 text-gray-400 hover:text-gray-600"}`}
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-4 pt-4 border-t border-gray-100 animate-[slideDown_0.2s_ease-out]">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1">
                <MapPin size={10} /> Location
              </span>
              <p className="text-sm font-medium text-gray-900 truncate">{camp.location}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1">
                <User size={10} /> Participant
              </span>
              <p className="text-sm font-medium text-gray-900 truncate">{participant?.participantName || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Payment</div>
              <StatusBadge status={participant?.paymentStatus} />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Status</div>
              <span className={`text-xs font-bold ${participant?.confirmationStatus === "Confirmed" ? "text-blue-600" : "text-amber-600"}`}>
                {participant?.confirmationStatus || "Pending"}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        {participant?.paymentStatus !== "Paid" ? (
          <>
            <button
              onClick={() => onPay(camp)}
              className="flex-[2] py-2.5 bg-[#ff1e00] text-white rounded-xl text-xs font-bold hover:bg-[#ff1e00]/90 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
            >
              <CreditCard size={14} /> Pay Now
            </button>
            <button
              onClick={() => onCancel(camp._id)}
              disabled={isCancelling}
              className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 hover:text-[#ff1e00] hover:border-[#ff1e00]/20 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => onFeedback(camp)}
            disabled={feedbackDisabled}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${feedbackDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-100"
              : "bg-[#59ce8f] text-white hover:bg-[#59ce8f]/90 active:scale-95"
              }`}
          >
            {feedbackDisabled ? "Feedback Shared" : "Share Feedback Now"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CampCard;
