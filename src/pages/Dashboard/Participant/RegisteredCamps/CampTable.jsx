import React from "react";
import { Link } from "react-router";
import { format } from "date-fns";
import { Calendar, MapPin, User, ArrowRight, CreditCard } from "lucide-react";
import StatusBadge from "./StatusBadge";

const CampTable = ({ camps, onPay, onCancel, onFeedback, isCancelling, searchTerm, statusFilter }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-[#e8f9fd]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Camp Info
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fees
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Participant
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {camps.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-[#e8f9fd] rounded-full flex items-center justify-center mb-4">
                    <CreditCard className="h-8 w-8 text-[#ff1e00]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    No registered camps found
                  </h3>
                  <p className="text-gray-500 max-w-xs mx-auto mb-6 text-sm">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your filters to find what you're looking for."
                      : "Your registered medical camps will appear here once you sign up."}
                  </p>
                  {(!searchTerm && statusFilter === "all") && (
                    <Link
                      to="/available-camps"
                      className="inline-flex items-center px-4 py-2 bg-[#ff1e00] text-white rounded-lg font-medium hover:bg-[#ff1e00]/90 transition-all cursor-pointer text-sm"
                    >
                      Browse Available Camps
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  )}
                </div>
              </td>
            </tr>
          ) : (
            <>
              {camps.map((camp) => {
                const participant = camp.participants[0];
                return (
                  <tr key={camp._id} className="hover:bg-[#e8f9fd]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/camp-details/${camp._id}`}
                        className="flex items-center space-x-3 group"
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 shadow-sm bg-white group-hover:border-[#ff1e00] transition-colors">
                          <img
                            src={camp.imageURL || "/default-camp.png"}
                            alt={camp.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "/default-camp.png";
                            }}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 group-hover:text-[#ff1e00] transition-colors">{camp.name}</h4>
                          <div className="flex items-center text-xs text-gray-500 mt-0.5">
                            <MapPin size={12} className="mr-1" />
                            {camp.location}
                          </div>
                        </div>
                      </Link>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-[#ff1e00]">
                        ${camp.fees}
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider">Fixed Fee</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User size={14} className="text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {participant?.participantName || "N/A"}
                          </div>
                          <div className="text-[10px] text-gray-500 flex items-center">
                            <Calendar size={10} className="mr-1" />
                            {participant?.registrationDate ? format(new Date(participant.registrationDate), "MMM d, yyyy") : "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <StatusBadge status={participant?.paymentStatus} />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${participant?.confirmationStatus === "Confirmed"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-amber-50 text-amber-600"
                        }`}>
                        {participant?.confirmationStatus || "Pending"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      {participant?.paymentStatus !== "Paid" ? (
                        <>
                          <button
                            onClick={() => onPay(camp)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold bg-[#ff1e00] text-white rounded-lg hover:bg-[#ff1e00]/90 transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-95"
                          >
                            Pay Now
                          </button>
                          <button
                            onClick={() => onCancel(camp._id)}
                            disabled={isCancelling}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#ff1e00] hover:border-[#ff1e00]/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => onFeedback(camp)}
                          disabled={camp.hasFeedback}
                          className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-sm ${camp.hasFeedback
                            ? "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100"
                            : "bg-[#59ce8f] text-white hover:bg-[#59ce8f]/90 cursor-pointer hover:shadow-md active:scale-95"
                            }`}
                        >
                          {camp.hasFeedback ? "Feedback Shared" : "Give Feedback"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {/* Empty rows to maintain min-height */}
              {camps.length < 4 && [...Array(4 - camps.length)].map((_, index) => (
                <tr key={`empty-${index}`} className="h-[73px]">
                  <td colSpan="6" className="px-6 py-4"></td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CampTable;