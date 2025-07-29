import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";

const ManageRegistrations = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all registrations
  const {
    data: registrations = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["registrations"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/registrations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  // Mutation to confirm registration
  const confirmMutation = useMutation({
    mutationFn: (registrationId) =>
      axios.patch(
        `http://localhost:5000/registrations/${registrationId}/confirm`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["registrations"]);
      Swal.fire("Confirmed!", "Registration has been confirmed.", "success");
    },
    onError: () => {
      Swal.fire("Error!", "Failed to confirm registration.", "error");
    },
  });

  // Mutation to cancel registration
  const cancelMutation = useMutation({
    mutationFn: (registrationId) =>
      axios.delete(`http://localhost:5000/registrations/${registrationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["registrations"]);
      Swal.fire("Cancelled!", "Registration has been cancelled.", "success");
    },
    onError: () => {
      Swal.fire("Error!", "Failed to cancel registration.", "error");
    },
  });

  const handleConfirm = (id) => {
    confirmMutation.mutate(id);
  };

  const handleCancel = (id, paymentStatus, confirmationStatus) => {
    if (paymentStatus === "Paid" && confirmationStatus === "Confirmed") {
      Swal.fire(
        "Cannot Cancel",
        "Cannot cancel a confirmed and paid registration.",
        "warning"
      );
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        cancelMutation.mutate(id);
      }
    });
  };

  if (isLoading) return <div>Loading registrations...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Registered Camps</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Camp Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Camp Fees
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Confirmation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {registrations.map((registration) => (
              <tr key={registration._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {registration.campName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${registration.campFees}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {registration.participantName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      registration.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {registration.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {registration.confirmationStatus === "Pending" ? (
                    <button
                      onClick={() => handleConfirm(registration._id)}
                      className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition"
                    >
                      Pending
                    </button>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                      Confirmed
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() =>
                      handleCancel(
                        registration._id,
                        registration.paymentStatus,
                        registration.confirmationStatus
                      )
                    }
                    disabled={
                      registration.paymentStatus === "Paid" &&
                      registration.confirmationStatus === "Confirmed"
                    }
                    className={`px-3 py-1 rounded ${
                      registration.paymentStatus === "Paid" &&
                      registration.confirmationStatus === "Confirmed"
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600"
                    } transition`}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageRegistrations;
