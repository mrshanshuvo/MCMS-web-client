import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { Trash2, Search, ChevronLeft, ChevronRight, Activity, X, Users, ChevronDown, ChevronUp } from "lucide-react";
import Loader from "../../../components/Shared/Loader";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useActionMenu from "../../../hooks/useActionMenu";

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "Paid", label: "Paid" },
  { value: "Unpaid", label: "Unpaid" },
];

const ManageRegistrations = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

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
      setCurrentPage(1);
    },
  });

  // GET registrations
  const { data: registrationsData = {}, isLoading } = useQuery({
    queryKey: ["registrations", currentPage, searchTerm, statusFilter],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/registrations?page=${currentPage}&limit=10&search=${searchTerm}&status=${statusFilter}`
      );
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  const registrations = registrationsData.data || [];
  const pagination = registrationsData.pagination || {};

  // DELETE mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/registrations/${id}`);
    },
    onSuccess: () => {
      toast.success("Registration cancelled successfully!");
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
    onError: () => {
      toast.error("Failed to cancel registration.");
    },
  });

  const handleCancel = (id, isPaidAndConfirmed) => {
    if (isPaidAndConfirmed) {
      toast.error("Cannot cancel a paid and confirmed registration");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel this registration?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      confirmButtonColor: "#ff1e00",
      cancelButtonColor: "#6b7280",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < pagination.totalPages) setCurrentPage(currentPage + 1);
  };

  if (isLoading) {
    return (
      <Loader
        fullHeight={false}
        className="py-16"
        message="Loading registrations..."
      />
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Main Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header with filters */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-[#ff1e00]" />
                <h2 className="text-lg font-semibold text-gray-900">Manage Registrations</h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#ff1e00] transition-colors pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-10 pr-10 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff1e00] focus:border-transparent text-gray-900 w-full sm:w-60"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput("");
                        setSearchTerm("");
                        setCurrentPage(1);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ff1e00] hover:bg-[#ff1e00]/10 p-1 rounded-md transition-colors cursor-pointer flex items-center justify-center"
                      title="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Status Filter */}
                <div className="relative" ref={containerRef}>
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-3 bg-white cursor-pointer hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ff1e00] focus:border-transparent min-w-[160px]"
                  >
                    <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
                      Payment:
                    </span>
                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                      {selectedOption.label}
                    </span>
                    {isOpen ? (
                      <ChevronUp size={16} className="text-gray-400 ml-auto" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400 ml-auto" />
                    )}
                  </button>
                  {isOpen && (
                    <ul className="absolute right-0 mt-2 p-2 shadow-xl bg-white border border-gray-100 rounded-xl w-44 z-50 animate-[slideDown_0.2s_ease-out]">
                      {statusOptions.map((option) => (
                        <li key={option.value}>
                          <button
                            onClick={() => handleSelect(option.value)}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                              statusFilter === option.value
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
                  <style>{`
                    @keyframes slideDown {
                      from { opacity: 0; transform: translateY(-8px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                  `}</style>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-[#ff1e00]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white hidden sm:table-cell">Camp</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white hidden md:table-cell">Fees</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white hidden lg:table-cell">Payment</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white hidden lg:table-cell">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {registrations.map((reg, index) => {
                  const isPaidAndConfirmed =
                    reg.paymentStatus === "Paid" && reg.confirmationStatus === "Confirmed";
                  return (
                    <tr key={index} className="hover:bg-[#e8f9fd]/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{reg.participantName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{reg.participantEmail}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{reg.campName}</td>
                      <td className="px-4 py-3 text-sm font-medium hidden md:table-cell">
                        {reg.campFees === 0 ? (
                          <span className="text-[#59ce8f]">Free</span>
                        ) : (
                          <span className="text-[#ff1e00]">${reg.campFees}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm hidden lg:table-cell">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            reg.paymentStatus === "Paid"
                              ? "bg-[#59ce8f]/10 text-[#59ce8f]"
                              : "bg-[#ff1e00]/10 text-[#ff1e00]"
                          }`}
                        >
                          {reg.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm hidden lg:table-cell">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            reg.confirmationStatus === "Confirmed"
                              ? "bg-[#59ce8f]/10 text-[#59ce8f]"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {reg.confirmationStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            isPaidAndConfirmed
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white border border-gray-200 text-gray-600 hover:bg-[#ff1e00] hover:text-white hover:border-[#ff1e00] cursor-pointer"
                          }`}
                          onClick={() => handleCancel(reg._id, isPaidAndConfirmed)}
                          disabled={isPaidAndConfirmed}
                          title={
                            isPaidAndConfirmed
                              ? "Cannot cancel a paid and confirmed registration"
                              : "Cancel registration"
                          }
                        >
                          <Trash2 size={14} />
                          <span>Cancel</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {registrations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-3">
                <Activity size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No registrations found</h3>
              <p className="text-gray-500">Try adjusting your search or filter</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {pagination.totalCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <p className="text-sm text-gray-500">
              Showing {registrations.length} of {pagination.totalCount || 0} registrations
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-[#e8f9fd] hover:text-[#ff1e00] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page <span className="font-semibold text-[#ff1e00]">{currentPage}</span> of {pagination.totalPages || 1}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === pagination.totalPages}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-[#e8f9fd] hover:text-[#ff1e00] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRegistrations;