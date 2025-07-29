import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import CampFormModal from "./CampFormModal";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageCamps = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [editingCamp, setEditingCamp] = useState(null);

  const {
    data: camps = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["myCamps", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/organizer/camps");
      return res.data;
    },
  });

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This camp will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      background: "#1e3a8a",
      color: "#ffffff",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/camps/${id}`);
        if (res.data.deletedCount > 0) {
          toast.success("Camp deleted successfully");
          refetch();
        }
      } catch {
        toast.error("Failed to delete camp");
      }
    }
  };

  const handleEdit = (camp) => {
    setEditingCamp(camp);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-b from-[#f0f9ff] to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 font-medium mb-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
            Organizer Dashboard
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Medical Camps
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            View, edit, and manage all your organized medical camps
          </p>
        </div>

        {/* Camps Table */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#1e3a8a] to-[#0f766e] text-white">
                <tr>
                  <th className="px-6 py-4 text-left">#</th>
                  <th className="px-6 py-4 text-left">Camp Name</th>
                  <th className="px-6 py-4 text-left">Date & Time</th>
                  <th className="px-6 py-4 text-left">Location</th>
                  <th className="px-6 py-4 text-left">Fees</th>
                  <th className="px-6 py-4 text-left">Participants</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {camps.length > 0 ? (
                  camps.map((camp, idx) => (
                    <tr
                      key={camp._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">{idx + 1}</td>
                      <td className="px-6 py-4 font-medium">{camp.name}</td>
                      <td className="px-6 py-4">
                        {new Date(camp.dateTime).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">{camp.location}</td>
                      <td className="px-6 py-4">${camp.fees.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        {camp.participantCount || 0}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(camp)}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(camp._id)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No camps found. Create your first medical camp!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editingCamp && (
        <CampFormModal
          initialData={editingCamp}
          onClose={() => setEditingCamp(null)}
          onUpdated={() => {
            setEditingCamp(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default ManageCamps;
