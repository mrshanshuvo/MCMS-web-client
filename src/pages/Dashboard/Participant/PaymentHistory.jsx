import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Search,
  Filter,
  Download,
} from "lucide-react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const statusStyles = {
  completed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-blue-100 text-blue-800",
};

const CampInfo = ({ campId }) => {
  const { data: camp, isLoading } = useQuery({
    queryKey: ["camp", campId],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/camps/${campId}`);
      return res.data.camp.camp;
    },
    enabled: !!campId,
  });

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
      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
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
        <h4 className="font-medium text-gray-900">{camp.name}</h4>
        <p className="text-sm text-gray-500">{camp.location}</p>
      </div>
    </div>
  );
};

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const limit = 5;

  const { data, isLoading, error } = useQuery({
    queryKey: ["payments", user?.email, page, searchTerm, statusFilter],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/payments?page=${page}&limit=${limit}&search=${searchTerm}&status=${statusFilter}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const payments = data?.data || [];
  const pagination = data?.pagination || {};

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };

  const getStatusBadge = (status) => {
    const statusKey = status?.toLowerCase() || "unknown";
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusStyles[statusKey] || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusKey === "completed" && <CheckCircle className="mr-1 h-3 w-3" />}
        {statusKey === "pending" && <Clock className="mr-1 h-3 w-3" />}
        {statusKey === "failed" && <AlertCircle className="mr-1 h-3 w-3" />}
        {status}
      </span>
    );
  };

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
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-600 hover:underline"
            >
              Refresh page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center my-8">
        <CreditCard className="mx-auto h-12 w-12 text-blue-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No payment history found
        </h3>
        <p className="text-gray-500 mb-4">
          Your payment records will appear here once you register for a medical
          camp
        </p>
        <a
          href="/available-camps"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
        >
          Browse Available Camps
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#0f766e] p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold flex items-center mb-4 sm:mb-0">
            <CreditCard className="mr-3" size={24} />
            Payment History
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Camp
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Payment Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Method
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Transaction ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <CampInfo campId={payment.campId} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {payment.paymentDate ? (
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                      <div>
                        <div>
                          {format(new Date(payment.paymentDate), "MMM d, yyyy")}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(payment.paymentDate), "h:mm a")}
                        </div>
                      </div>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  ${(payment.amount || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="capitalize">
                    {payment.paymentMethod || "stripe"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {payment.transactionId?.slice(0, 6)}...
                  {payment.transactionId?.slice(-4)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(payment.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination and Actions */}
      <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200">
        <div className="flex items-center mb-4 sm:mb-0">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed mr-2"
          >
            First
          </button>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>
          <span className="mx-4 text-sm text-gray-700">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() =>
              setPage((p) => Math.min(p + 1, pagination.totalPages))
            }
            disabled={page === pagination.totalPages}
            className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
          <button
            onClick={() => setPage(pagination.totalPages)}
            disabled={page === pagination.totalPages}
            className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ml-2"
          >
            Last
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">
            {pagination.totalItems} transactions total
          </span>
          <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
