import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
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
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useActionMenu from "../../../hooks/useActionMenu";

const statusStyles = {
  completed: "bg-[#59ce8f]/10 text-[#59ce8f]",
  pending: "bg-[#ff1e00]/10 text-[#ff1e00]",
  failed: "bg-gray-100 text-gray-600",
  refunded: "bg-[#e8f9fd] text-[#ff1e00]",
};


const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const limit = 5;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" },
  ];

  const {
    selectedOption,
    handleSelect,
    isOpen,
    setIsOpen,
    containerRef,
  } = useActionMenu({
    options: statusOptions,
    initialValue: statusFilter,
    onSelect: (val) => {
      setStatusFilter(val);
      setPage(1);
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["payments", user?.email, page, searchTerm, statusFilter],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/payments?page=${page}&limit=${limit}&search=${searchTerm}&status=${statusFilter}`
      );
      return res.data;
    },
    enabled: !!user?.email,
    placeholderData: keepPreviousData,
  });

  const payments = data?.data || [];
  const pagination = data?.pagination || {};



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


  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

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
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#ff1e00] transition-colors pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="pl-10 pr-10 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff1e00] focus:border-transparent text-gray-900 w-full sm:w-64"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput("");
                        setSearchTerm("");
                        setPage(1);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ff1e00] hover:bg-[#ff1e00]/10 p-1 rounded-md transition-colors cursor-pointer flex items-center justify-center"
                      title="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Status ActionMenu */}
                <div className="relative" ref={containerRef}>
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-3 bg-white cursor-pointer hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ff1e00] focus:border-transparent min-w-[160px]"
                  >
                    <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
                      Status:
                    </span>
                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                      {selectedOption.label}
                    </span>
                    {isOpen ? (
                      <ChevronUp size={16} className="text-gray-400 group-hover:text-[#ff1e00] transition-colors" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400 group-hover:text-[#ff1e00] transition-colors" />
                    )}
                  </button>
                  {isOpen && (
                    <ul className="absolute right-0 mt-2 p-2 shadow-xl bg-white border border-gray-100 rounded-xl w-48 z-50 animate-[slideDown_0.2s_ease-out]">
                      {statusOptions.map((option) => (
                        <li key={option.value}>
                          <button
                            onClick={() => handleSelect(option.value)}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === option.value
                              ? "bg-[#ff1e00]/10 text-[#ff1e00]"
                              : "text-gray-600 hover:bg-gray-50"
                              }`}
                          >
                            {option.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <style>{`
                  @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
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
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-[#e8f9fd] rounded-full flex items-center justify-center mb-4">
                          <CreditCard className="h-8 w-8 text-[#ff1e00]" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          No payment history found
                        </h3>
                        <p className="text-gray-500 max-w-xs mx-auto mb-6 text-sm">
                          {searchTerm || statusFilter !== "all"
                            ? "Try adjusting your filters to find what you're looking for."
                            : "Your payment records will appear here once you register for a medical camp."}
                        </p>
                        {(!searchTerm && statusFilter === "all") && (
                          <a
                            href="/available-camps"
                            className="inline-flex items-center px-4 py-2 bg-[#ff1e00] text-white rounded-lg font-medium hover:bg-[#ff1e00]/90 transition-all cursor-pointer text-sm"
                          >
                            Browse Available Camps
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {payments.map((payment) => (
                      <tr key={payment._id} className="hover:bg-[#e8f9fd]/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/camp-details/${payment.campId}`}
                            className="flex items-center space-x-3 group hover:opacity-80 transition-opacity"
                          >
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 shadow-sm bg-white group-hover:border-[#ff1e00] transition-colors">
                              <img
                                src={payment.campImage || "/default-camp.png"}
                                alt={payment.campName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = "/default-camp.png";
                                }}
                              />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 group-hover:text-[#ff1e00] transition-colors">{payment.campName || "Unknown Camp"}</h4>
                              <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">{payment.campLocation || "Unknown Location"}</p>
                            </div>
                          </Link>
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
                    {/* Empty rows to maintain min-height */}
                    {payments.length < 4 && [...Array(4 - payments.length)].map((_, index) => (
                      <tr key={`empty-${index}`} className="h-[73px]">
                        <td colSpan="6" className="px-6 py-4"></td>
                      </tr>
                    ))}
                  </>
                )}
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
              {pagination.total} transactions total
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;