import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, Search, ChevronLeft, ChevronRight, Activity } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageRegistrations = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // GET registrations
  const { data: registrationsData = {}, isLoading } = useQuery({
    queryKey: ["registrations", currentPage, searchTerm],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/registrations?page=${currentPage}&limit=10&search=${searchTerm}`
      );
      return res.data;
    },
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
      queryClient.invalidateQueries(["registrations"]);
    },
    onError: () => {
      toast.error("Failed to cancel registration.");
    },
  });

  // Handle Delete
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

  // Pagination buttons
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < pagination.totalPages) setCurrentPage(currentPage + 1);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="animate-spin h-8 w-8 text-[#ff1e00]" />
        <p className="text-gray-500 mt-3">Loading registrations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e8f9fd] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Search Bar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff1e00] transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
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
                  const isPaidAndConfirmed = reg.paymentStatus === "Paid" && reg.confirmationStatus === "Confirmed";
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
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${reg.paymentStatus === "Paid"
                          ? "bg-[#59ce8f]/10 text-[#59ce8f]"
                          : "bg-[#ff1e00]/10 text-[#ff1e00]"
                          }`}>
                          {reg.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm hidden lg:table-cell">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${reg.confirmationStatus === "Confirmed"
                          ? "bg-[#59ce8f]/10 text-[#59ce8f]"
                          : "bg-gray-100 text-gray-600"
                          }`}>
                          {reg.confirmationStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isPaidAndConfirmed
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
              <p className="text-gray-500">Try adjusting your search or check back later</p>
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