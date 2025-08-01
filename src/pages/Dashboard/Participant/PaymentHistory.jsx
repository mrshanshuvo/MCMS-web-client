import React from "react";
import { useQuery } from "@tanstack/react-query";
import useCampById from "../../../hooks/useCampById";
import { Tooltip } from "@mui/material";
import { format } from "date-fns";
import {
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";

const CampInfo = ({ campId }) => {
  const { data: camp, isLoading } = useCampById(campId);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!camp) return <span className="text-gray-500">Unknown Camp</span>;

  return (
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
        <img
          src={camp.imageURL || "https://via.placeholder.com/150"}
          alt={camp.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150";
          }}
        />
      </div>
      <div>
        <h4 className="font-medium text-gray-900">{camp.name}</h4>
        <p className="text-sm text-gray-500">{camp.location}</p>
      </div>
    </div>
  );
};

const CampDate = ({ campId }) => {
  const { data: camp, isLoading } = useCampById(campId);

  if (isLoading) {
    return <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>;
  }

  if (!camp?.dateTime) return <span className="text-gray-500">N/A</span>;

  const date = format(new Date(camp.dateTime), "MMM d, yyyy");
  const time = format(new Date(camp.dateTime), "h:mm a");

  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-1">
        <Calendar className="text-gray-400" size={16} />
        <span>{date}</span>
      </div>
      <span className="text-sm text-gray-500 ml-5">{time}</span>
    </div>
  );
};

const PaymentHistory = () => {
  const { user } = useAuth();

  const {
    data: payments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/paymentsByEmail?email=${user?.email}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      return res.data.data || [];
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600 mb-4" />
        <p className="text-gray-600">Loading payment history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg my-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Error loading payment history
            </h3>
            <p className="text-sm text-red-700 mt-1">
              {error.message || "Please try again later"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="bg-blue-50 rounded-xl p-8 text-center my-8">
        <CreditCard className="mx-auto h-12 w-12 text-blue-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No payment history found
        </h3>
        <p className="text-gray-500">
          Your payment records will appear here once you register for a medical
          camp
        </p>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#0f766e] p-6 text-white">
        <h2 className="text-xl font-bold flex items-center">
          <CreditCard className="mr-3" size={24} />
          Payment History
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Camp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Camp Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <CampInfo campId={payment.campId} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {payment.paymentDate ? (
                    <div className="flex flex-col">
                      <span>
                        {format(new Date(payment.paymentDate), "MMM d, yyyy")}
                      </span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(payment.paymentDate), "h:mm a")}
                      </span>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <CampDate campId={payment.campId} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  ${(payment.amount || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {payment.paymentMethod || "Stripe"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-500 text-center">
                  <Tooltip title={payment.transactionId || "N/A"}>
                    <span>{payment.transactionId?.slice(0, 8)}...</span>
                  </Tooltip>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(payment.status)}
                    <span
                      className={`ml-2 ${
                        payment.status?.toLowerCase() === "completed"
                          ? "text-green-600"
                          : payment.status?.toLowerCase() === "pending"
                          ? "text-yellow-600"
                          : "text-gray-600"
                      }`}
                    >
                      {payment.status || "Unknown"}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
