import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
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
      toast.success("Registration deleted!");
      queryClient.invalidateQueries(["registrations"]);
    },
    onError: () => {
      toast.error("Failed to delete registration.");
    },
  });

  // Handle Delete
  const handleCancel = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel this registration?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
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
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Registrations</h2>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input input-bordered w-full max-w-xs mb-4"
      />

      <div className="overflow-x-auto">
        <table className="table table-zebra min-w-[600px] text-sm sm:text-base">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th className="hidden sm:table-cell">Camp</th>
              <th className="hidden md:table-cell">Fees</th>
              <th className="hidden lg:table-cell">Payment</th>
              <th className="hidden lg:table-cell">Confirmation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => (
              <tr key={reg._id}>
                <td>{reg.participantName}</td>
                <td>{reg.participantEmail}</td>
                <td className="hidden sm:table-cell">{reg.campName}</td>
                <td className="hidden md:table-cell">
                  {reg.campFees === 0 ? "Free" : `$${reg.campFees}`}
                </td>
                <td className="hidden lg:table-cell">{reg.paymentStatus}</td>
                <td className="hidden lg:table-cell">
                  {reg.confirmationStatus}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-error px-2 sm:px-3"
                    onClick={() => handleCancel(reg._id)}
                    disabled={
                      reg.paymentStatus === "Paid" &&
                      reg.confirmationStatus === "Confirmed"
                    }
                    title={
                      reg.paymentStatus === "Paid" &&
                      reg.confirmationStatus === "Confirmed"
                        ? "Cannot cancel a paid and confirmed registration"
                        : ""
                    }
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline ml-1">Cancel</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <p>
          Showing {registrations.length} of {pagination.totalCount || 0}{" "}
          registrations
        </p>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-sm"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {pagination.totalPages || 1}
          </span>
          <button
            className="btn btn-sm"
            onClick={handleNext}
            disabled={currentPage === pagination.totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageRegistrations;
