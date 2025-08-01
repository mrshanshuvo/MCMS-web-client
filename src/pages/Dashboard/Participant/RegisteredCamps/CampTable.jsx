import React from "react";
import { format } from "date-fns";
import StatusBadge from "./StatusBadge";

const CampTable = ({ camps, onPay, onCancel, onFeedback }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse table-auto text-sm">
          <thead className="bg-gradient-to-r from-[#1e3a8a] to-[#0f766e] text-white">
            <tr>
              <th className="px-4 py-3 text-left">Camp Info</th>
              <th className="px-4 py-3 text-center">Fees</th>
              <th className="px-4 py-3 text-left">Participant</th>
              <th className="px-4 py-3 text-center">Payment</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {camps.map((camp) => {
              const participant = camp.participants[0];
              return (
                <tr key={camp._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-left">
                    <div className="mb-2">
                      <p className="font-semibold text-gray-800">{camp.name}</p>
                    </div>
                    <div className="text-xs text-gray-600">
                      {format(new Date(camp.dateTime), "MMM d, yyyy h:mm a")} •{" "}
                      {camp.location}
                    </div>
                  </td>

                  <td className="px-4 py-3 font-medium text-center">
                    ${camp.fees}
                  </td>

                  <td className="px-4 py-3 text-left">
                    <p>{participant?.participantName || "N/A"}</p>
                    <p className="text-gray-600 text-xs">
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
                    {participant?.confirmationStatus || "Pending"}
                  </td>

                  <td className="px-4 py-3 text-center whitespace-nowrap space-x-2">
                    {participant?.paymentStatus !== "Paid" ? (
                      <>
                        <button
                          onClick={() => onPay(camp)}
                          className="px-3 py-1 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          Pay Now
                        </button>
                        <button
                          onClick={() => onCancel(camp._id)}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
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
                        className={`px-3 py-1 text-sm rounded text-white ${
                          camp.hasFeedback
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
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
