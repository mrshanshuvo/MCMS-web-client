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
  Activity,
} from "lucide-react";
import api from "../../../api";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const statusStyles = {
  completed: "bg-[#59ce8f]/10 text-[#59ce8f]",
  pending: "bg-[#ff1e00]/10 text-[#ff1e00]",
  failed: "bg-gray-100 text-gray-600",
  refunded: "bg-[#e8f9fd] text-[#ff1e00]",
};

const CampInfo = ({ campId }) => {
  const { data: camp, isLoading } = useQuery({
    queryKey: ["camp", campId],
    queryFn: async () => {
      const res = await api.get(`/camps/${campId}`);
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
      <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 shadow-sm bg-white">
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
    setPage(1);
  };

  const getStatusBadge = (status) => {
    const statusKey = status?.toLowerCase() || "unknown";
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[statusKey] || "bg-gray-100 text-gray-800"
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
        <Loader2 className="animate-spin h-12 w-12 text-[#ff1e00] mb-4" />
        <p className="text-gray-500">Loading payment history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#ff1e00]/5 border-l-4 border-[#ff1e00] p-4 rounded-lg my-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-[#ff1e00] mr-3" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Error loading payment history
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {error.message || "Please try again later"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-[#ff1e00] hover:underline cursor-pointer"
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
      <div className="bg-[#e8f9fd] rounded-xl p-8 text-center my-8 border border-gray-100">
        <CreditCard className="mx-auto h-12 w-12 text-[#ff1e00] mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No payment history found
        </h3>
        <p className="text-gray-500 mb-4">
          Your payment records will appear here once you register for a medical camp
        </p>
        <a
          href="/available-camps"
          className="inline-flex items-center px-4 py-2 bg-[#ff1e00] text-white rounded-lg font-medium hover:bg-[#ff1e00]/90 transition-all cursor-pointer"
        >
          Browse Available Camps
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e8f9fd] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Your <span className="text-[#ff1e00]">Transactions</span>
          </h1>
          <p className="text-lg text-gray-600">
            View and manage your payment records
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          {/* Header with filters */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <CreditCard size={20} className="text-[#ff1e00]" />
                <h2 className="text-lg font-semibold text-gray-900">Payment Records</h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff1e00] focus:border-transparent text-gray-900 w-full sm:w-64"
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
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff1e00] focus:border-transparent bg-white text-gray-900"
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
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-[#e8f9fd]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Camp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Date
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
              <tbody className="bg-white divide-y divide-gray-100">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-[#e8f9fd]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CampInfo campId={payment.campId} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.paymentDate ? (
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-900">
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
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-[#ff1e00]">
                      ${(payment.amount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                      {payment.paymentMethod || "stripe"}
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

          {/* Pagination */}
          <div className="bg-white px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="px-3 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-[#e8f9fd] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                First
              </button>
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-[#e8f9fd] disabled:opacity-50 disabled:cursor-not-allowed flex items-center cursor-pointer transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
              <span className="mx-2 text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(p + 1, pagination.totalPages))
                }
                disabled={page === pagination.totalPages}
                className="px-3 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-[#e8f9fd] disabled:opacity-50 disabled:cursor-not-allowed flex items-center cursor-pointer transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
              <button
                onClick={() => setPage(pagination.totalPages)}
                disabled={page === pagination.totalPages}
                className="px-3 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-[#e8f9fd] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Last
              </button>
            </div>

            <div className="text-sm text-gray-500">
              {pagination.totalItems} transactions total
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;