import React, { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Pencil, Trash2, Activity, ChevronLeft, ChevronRight, Search, X, Tent } from "lucide-react";
import Loader from "../../../components/Shared/Loader";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import CampFormModal from "./CampFormModal";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageCamps = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [editingCamp, setEditingCamp] = useState(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 5;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["myCamps", user?.email, page, searchTerm],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/organizer/camps?page=${page}&limit=${limit}&search=${searchTerm}`
      );
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  const camps = data?.camps || [];
  const totalPages = data?.totalPages || 1;

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This camp will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff1e00",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/delete-camp/${id}`);
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

  const handlePrevious = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (isLoading) {
    return (
      <Loader
        fullHeight={false}
        className="h-64"
        message="Loading camps..."
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
                <Tent size={20} className="text-[#ff1e00]" />
                <h2 className="text-lg font-semibold text-gray-900">Manage Camps</h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#ff1e00] transition-colors pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search camps by name, location..."
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
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-[#ff1e00] text-white text-sm sm:text-base">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left">#</th>
                  <th className="px-3 sm:px-6 py-3 text-left">Camp Name</th>
                  <th className="px-3 sm:px-6 py-3 text-left">Date & Time</th>
                  <th className="px-3 sm:px-6 py-3 text-left hidden sm:table-cell">
                    Location
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left hidden md:table-cell">
                    Fees
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left hidden lg:table-cell">
                    Participants
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm sm:text-base">
                {camps.length > 0 ? (
                  camps.map((camp, idx) => (
                    <tr
                      key={camp._id}
                      className="hover:bg-[#e8f9fd]/30 transition-colors"
                    >
                      <td className="px-3 sm:px-6 py-3 text-gray-500">
                        {(page - 1) * limit + idx + 1}
                      </td>
                      <td className="px-3 sm:px-6 py-3 font-semibold text-gray-900">
                        {camp.name}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-gray-600">
                        {new Date(camp.dateTime).toLocaleString()}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-gray-600 hidden sm:table-cell">
                        {camp.location}
                      </td>
                      <td className="px-3 sm:px-6 py-3 font-medium hidden md:table-cell">
                        <span className="text-[#ff1e00]">${camp.fees.toFixed(2)}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-gray-600 hidden lg:table-cell">
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-[#e8f9fd] text-[#ff1e00] text-xs font-medium">
                          {camp.participantCount || 0}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3">
                        <div className="flex gap-2 sm:gap-3">
                          <button
                            onClick={() => handleEdit(camp)}
                            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-[#ff1e00] hover:text-white hover:border-[#ff1e00] transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(camp._id)}
                            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-[#ff1e00] hover:text-white hover:border-[#ff1e00] transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <Activity size={48} className="text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No camps found</h3>
                        <p className="text-gray-500">Create your first medical camp to get started</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        {camps.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={handlePrevious}
              disabled={page === 1}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-[#e8f9fd] hover:text-[#ff1e00] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <span className="text-gray-600 text-sm">
              Page <span className="font-semibold text-[#ff1e00]">{page}</span> of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-[#e8f9fd] hover:text-[#ff1e00] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
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