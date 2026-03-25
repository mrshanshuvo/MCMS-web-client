import React from "react";
import { format } from "date-fns";
import StatusBadge from "./StatusBadge";

const CampTable = ({ camps, onPay, onCancel, onFeedback, isCancelling }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse table-auto text-sm">
          <thead className="bg-[#ff1e00] text-white">
            <tr>
              <th className="px-4 py-3 text-left">Camp Info</th>
              <th className="px-4 py-3 text-center">Fees</th>
              <th className="px-4 py-3 text-left">Participant</th>
              <th className="px-4 py-3 text-center">Payment</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {camps.map((camp) => {
              const participant = camp.participants[0];
              return (
                <tr key={camp._id} className="hover:bg-[#e8f9fd]/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900 mb-1">{camp.name}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(camp.dateTime), "MMM d, yyyy h:mm a")} •{" "}
                      {camp.location}
                    </p>
                  </td>

                  <td className="px-4 py-3 font-medium text-center text-[#ff1e00]">
                    ${camp.fees}
                  </td>

                  <td className="px-4 py-3">
                    <p className="text-gray-900">{participant?.participantName || "N/A"}</p>
                    <p className="text-gray-500 text-xs">
                      Registered:{" "}
                      {format(
                        new Date(participant?.registrationDate),
                        "MMM d, yyyy"
                      )}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={participant?.paymentStatus} />
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span className="text-gray-600 text-sm">
                      {participant?.confirmationStatus || "Pending"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center whitespace-nowrap space-x-2">
                    {participant?.paymentStatus !== "Paid" ? (
                      <>
                        <button
                          onClick={() => onPay(camp)}
                          className="px-3 py-1 text-sm bg-[#ff1e00] text-white rounded-lg hover:bg-[#ff1e00]/90 transition-all cursor-pointer"
                        >
                          Pay Now
                        </button>
                        <button
                          onClick={() => onCancel(camp._id)}
                          disabled={isCancelling}
                          className="px-3 py-1 text-sm bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-[#e8f9fd] hover:text-[#ff1e00] transition-all cursor-pointer disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          if (!camp.hasFeedback) {
                            onFeedback(camp);
                          }
                        }}
                        disabled={camp.hasFeedback}
                        className={`px-3 py-1 text-sm rounded-lg transition-all ${camp.hasFeedback
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-[#ff1e00] text-white hover:bg-[#ff1e00]/90 cursor-pointer"
                          }`}
                        title={
                          camp.hasFeedback
                            ? "Feedback already submitted"
                            : "Give feedback"
                        }
                      >
                        {camp.hasFeedback ? "Feedback Submitted" : "Feedback"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampTable;