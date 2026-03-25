import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../api";
import { Link } from "react-router";
import {
  MapPin,
  Calendar,
  Users,
  User,
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import useActionMenu from "../../hooks/useActionMenu";

const fetchCamps = async ({ queryKey }) => {
  const [_key, { page, search, sort }] = queryKey;
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (search) params.append("search", search);
  if (sort) params.append("sort", sort);

  const res = await api.get(
    `/camps?${params.toString()}`
  );
  return res.data;
};

const AvailableCamps = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("participantCount");

  const { data, isLoading, isError, error, isPreviousData } = useQuery({
    queryKey: ["camps", { page, search, sort }],
    queryFn: fetchCamps,
    keepPreviousData: true,
  });

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const sortOptions = [
    { value: "participantCount", label: "Most Popular" },
    { value: "campFeesAsc", label: "Price: Low to High" },
    { value: "campFeesDesc", label: "Price: High to Low" },
    { value: "alphabetical", label: "A-Z" },
    { value: "dateAsc", label: "Date: Earliest" },
    { value: "dateDesc", label: "Date: Latest" },
  ];

  const {
    selectedOption,
    handleSelect,
    isOpen,
    setIsOpen,
    containerRef,
  } = useActionMenu({
    options: sortOptions,
    initialValue: sort,
    onSelect: (val) => {
      setSort(val);
      setPage(1);
    },
  });

  // Fallback image URL
  const getFallbackImage = (campName) => {
    return `https://placehold.co/400x300/495E57/F4CE14/png?text=${encodeURIComponent(
      campName
    )}`;
  };

  return (
    <div className="bg-gradient-to-b from-[#F5F7F8] to-white min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-40 mb-8">
          {/* Header */}
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#45474B] mb-2">
              Available
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#495E57] to-[#F4CE14]">
                {" "}
                Medical Camps
              </span>
            </h1>
            <p className="text-lg text-[#45474B]/70">
              Find and join medical camps that match your expertise and interests
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full lg:flex-1 lg:justify-end">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#495E57]"
                size={18}
              />
              <input
                type="text"
                placeholder="Search camps by name, location or professional..."
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 h-[44px] border border-[#495E57]/20 rounded-lg focus:outline-none bg-white"
              />
            </div>

            {/* Right Controls */}

            {/* Sort ActionMenu */}
            <div
              className="relative"
              ref={containerRef}
            >
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 h-[44px] border border-[#495E57]/20 rounded-lg flex items-center gap-3 bg-white cursor-pointer hover:bg-[#495E57]/5 transition-all duration-200 focus:outline-none"
              >
                <span className="text-sm font-medium text-[#45474B]/70 whitespace-nowrap">
                  Sort by:
                </span>
                <span className="text-sm font-semibold text-[#45474B] whitespace-nowrap">
                  {selectedOption.label}
                </span>
                {isOpen ? (
                  <ChevronUp size={16} className="text-[#495E57]" />
                ) : (
                  <ChevronDown size={16} className="text-[#495E57]" />
                )}
              </button>
              {isOpen && (
                <ul className="absolute right-0 mt-2 p-2 shadow-2xl bg-white border border-[#495E57]/10 rounded-xl w-56 z-50 animate-[slideDown_0.2s_ease-out]">
                  {sortOptions.map((option) => (
                    <li key={option.value}>
                      <button
                        onClick={() => handleSelect(option.value)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${sort === option.value
                          ? "bg-[#495E57] text-white"
                          : "text-[#45474B] hover:bg-[#F5F7F8]"
                          }`}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {isError ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading camps
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error.message}</p>
                </div>
              </div>
            </div>
          </div>
        ) : isLoading || isPreviousData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white border border-[#495E57]/10 rounded-xl overflow-hidden shadow-sm"
              >
                <Skeleton height={200} className="w-full" />
                <div className="p-6">
                  <Skeleton count={1} height={28} className="mb-4 rounded-lg" />
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center">
                        <Skeleton
                          circle
                          width={32}
                          height={32}
                          className="mr-3"
                        />
                        <Skeleton width={120} height={16} />
                      </div>
                    ))}
                  </div>
                  <Skeleton height={48} className="mt-4 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {data.camps.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#495E57]/10">
                  <Search className="h-6 w-6 text-[#495E57]" />
                </div>
                <h3 className="mt-2 text-lg font-medium text-[#45474B]">
                  No camps found
                </h3>
                <p className="mt-1 text-[#45474B]/70">
                  Try adjusting your search or filter to find what you're
                  looking for.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {data.camps.map((camp, index) => (
                    <div
                      key={index}
                      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-[#495E57]/8 transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden shrink-0">
                        <img
                          src={camp.imageURL || getFallbackImage(camp.name)}
                          alt={camp.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          onError={(e) => { e.target.src = getFallbackImage(camp.name); }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                        {/* Fee pill */}
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-[#45474B] text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                            <FaBangladeshiTakaSign size={10} className="text-[#495E57]" />
                            {camp.fees.toFixed(0)}
                          </span>
                        </div>

                        {/* Title */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h2 className="text-base font-bold text-white leading-snug line-clamp-2">
                            {camp.name}
                          </h2>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-4 flex flex-col gap-3 flex-1">

                        {/* Location + Date */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <MapPin size={13} className="text-[#495E57] shrink-0" />
                            <span className="text-xs text-[#45474B] font-medium truncate">{camp.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Calendar size={13} className="text-[#495E57]" />
                            <span className="text-xs text-[#45474B]">
                              {new Date(camp.dateTime).toLocaleDateString("en-US", {
                                month: "short", day: "numeric", year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Healthcare professional */}
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#495E57]/10 flex items-center justify-center shrink-0">
                            <User size={12} className="text-[#495E57]" />
                          </div>
                          <span className="text-xs text-[#45474B] truncate">{camp.healthcareProfessional}</span>
                        </div>

                        {/* Description */}
                        {camp.description && (
                          <p className="text-xs text-[#45474B]/55 line-clamp-2 leading-relaxed">
                            {camp.description}
                          </p>
                        )}

                        {/* Participants + progress — pinned to bottom */}
                        <div className="mt-auto pt-1">
                          <div className="flex justify-between items-center mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <Users size={13} className="text-[#495E57]" />
                              <span className="text-xs font-semibold text-[#45474B]">
                                {camp.participantCount.toLocaleString()} participants
                              </span>
                            </div>
                            <span className="text-[10px] text-[#495E57]/50 font-medium tabular-nums">
                              {Math.min(Math.round((camp.participantCount / 500) * 100), 100)}%
                            </span>
                          </div>
                          <div className="w-full h-1 bg-[#495E57]/8 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#495E57] to-[#F4CE14] rounded-full transition-all duration-700"
                              style={{ width: `${Math.min((camp.participantCount / 500) * 100, 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* CTA */}
                        <Link
                          to={`/camp-details/${camp._id}`}
                          className="w-full flex items-center justify-center gap-2 bg-[#495E57] hover:bg-[#3a4d47] text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group/btn"
                        >
                          View Details
                          <ArrowRight
                            size={14}
                            className="text-[#F4CE14] group-hover/btn:translate-x-1 transition-transform duration-200"
                          />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-12">
                  <button
                    onClick={() => setPage((old) => Math.max(old - 1, 1))}
                    disabled={page === 1}
                    className="flex items-center gap-2 px-4 py-2 border border-[#495E57]/20 rounded-lg hover:bg-[#495E57]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[#45474B] cursor-pointer focus:outline-none"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from(
                      { length: Math.min(5, data.totalPages) },
                      (_, i) => {
                        let pageNum;
                        if (data.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= data.totalPages - 2) {
                          pageNum = data.totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer focus:outline-none ${page === pageNum
                              ? "bg-[#495E57] text-white"
                              : "text-[#45474B] hover:bg-[#495E57]/10"
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                    {data.totalPages > 5 && (
                      <span className="mx-2 text-[#45474B]">...</span>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      setPage((old) => (old < data.totalPages ? old + 1 : old))
                    }
                    disabled={page === data.totalPages || data.totalPages === 0}
                    className="flex items-center gap-2 px-4 py-2 border border-[#495E57]/20 rounded-lg hover:bg-[#495E57]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[#45474B] cursor-pointer focus:outline-none"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(AvailableCamps);
