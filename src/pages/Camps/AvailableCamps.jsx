import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
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
  Grid,
  List,
  Star,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const fetchCamps = async ({ queryKey }) => {
  const [_key, { page, search, sort }] = queryKey;
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (search) params.append("search", search);
  if (sort) params.append("sort", sort);

  const res = await axios.get(
    `https://mcms-server-red.vercel.app/camps?${params.toString()}`
  );
  return res.data;
};

const AvailableCamps = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("participantCount");
  const [layout, setLayout] = useState("grid-3"); // 'grid-2' or 'grid-3'

  const { data, isLoading, isError, error, isPreviousData } = useQuery({
    queryKey: ["camps", { page, search, sort }],
    queryFn: fetchCamps,
    keepPreviousData: true,
  });

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const toggleLayout = () => {
    setLayout(layout === "grid-3" ? "grid-2" : "grid-3");
  };

  // Fallback image URL
  const getFallbackImage = (campName) => {
    return `https://placehold.co/400x300/495E57/F4CE14/png?text=${encodeURIComponent(
      campName
    )}`;
  };

  return (
    <div className="bg-gradient-to-b from-[#F5F7F8] to-white min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#495E57]/10 text-[#495E57] px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star size={16} className="text-[#F4CE14]" fill="#F4CE14" />
            Available Medical Camps
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#45474B] mb-4">
            Available
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#495E57] to-[#F4CE14]">
              {" "}
              Medical Camps
            </span>
          </h1>
          <p className="text-lg text-[#45474B]/70 max-w-2xl mx-auto">
            Find and join medical camps that match your expertise and interests
          </p>
        </div>

        {/* Search, Sort and Layout Controls */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-2xl">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#495E57]"
              size={18}
            />
            <input
              type="text"
              placeholder="Search camps by name, location or professional..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-[#495E57]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:border-transparent bg-white"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLayout}
                className="p-2 rounded-lg border border-[#495E57]/20 hover:bg-[#495E57]/10 transition-colors"
                aria-label="Toggle layout"
              >
                {layout === "grid-3" ? (
                  <Grid className="text-[#495E57]" size={20} />
                ) : (
                  <List className="text-[#495E57]" size={20} />
                )}
              </button>
            </div>

            <label htmlFor="sort" className="text-[#45474B] whitespace-nowrap">
              Sort by:
            </label>
            <select
              id="sort"
              value={sort}
              onChange={handleSortChange}
              className="px-4 py-2 border border-[#495E57]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:border-transparent bg-white"
            >
              <option value="participantCount">Most Popular</option>
              <option value="campFeesAsc">Price: Low to High</option>
              <option value="campFeesDesc">Price: High to Low</option>
              <option value="alphabetical">A-Z</option>
              <option value="dateAsc">Date: Earliest</option>
              <option value="dateDesc">Date: Latest</option>
            </select>
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
          <div
            className={`grid grid-cols-1 ${
              layout === "grid-3"
                ? "sm:grid-cols-2 lg:grid-cols-3"
                : "sm:grid-cols-2"
            } gap-8`}
          >
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
                <div
                  className={`grid grid-cols-1 ${
                    layout === "grid-3"
                      ? "sm:grid-cols-2 lg:grid-cols-3"
                      : "sm:grid-cols-2"
                  } gap-8`}
                >
                  {data.camps.map((camp) => (
                    <div
                      key={camp._id}
                      className="bg-white border border-[#495E57]/10 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-[#495E57]/10 to-[#F4CE14]/10 overflow-hidden">
                        <img
                          src={camp.imageURL || getFallbackImage(camp.name)}
                          alt={camp.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = getFallbackImage(camp.name);
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#45474B] to-transparent p-4">
                          <h2 className="text-xl font-bold text-white">
                            {camp.name}
                          </h2>
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center text-[#45474B]">
                          <div className="flex-shrink-0 w-8 h-8 bg-[#495E57]/10 rounded-lg flex items-center justify-center mr-3">
                            <MapPin className="text-[#495E57]" size={16} />
                          </div>
                          <span className="text-sm font-medium">
                            {camp.location}
                          </span>
                        </div>
                        <div className="flex items-center text-[#45474B]">
                          <div className="flex-shrink-0 w-8 h-8 bg-[#495E57]/10 rounded-lg flex items-center justify-center mr-3">
                            <Calendar className="text-[#495E57]" size={16} />
                          </div>
                          <span className="text-sm">
                            {new Date(camp.dateTime).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center text-[#45474B]">
                          <div className="flex-shrink-0 w-8 h-8 bg-[#F4CE14]/20 rounded-lg flex items-center justify-center mr-3">
                            <FaBangladeshiTakaSign
                              className="text-[#F4CE14]"
                              size={16}
                            />
                          </div>
                          <span className="text-sm font-semibold">
                            ${camp.fees.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center text-[#45474B]">
                          <div className="flex-shrink-0 w-8 h-8 bg-[#495E57]/10 rounded-lg flex items-center justify-center mr-3">
                            <User className="text-[#495E57]" size={16} />
                          </div>
                          <span className="text-sm truncate">
                            {camp.healthcareProfessional}
                          </span>
                        </div>
                        <div className="flex items-center text-[#45474B]">
                          <div className="flex-shrink-0 w-8 h-8 bg-[#495E57]/10 rounded-lg flex items-center justify-center mr-3">
                            <Users className="text-[#495E57]" size={16} />
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium">
                              {camp.participantCount.toLocaleString()}{" "}
                              participants
                            </span>
                            {/* Progress bar */}
                            <div className="mt-2 w-full bg-[#F5F7F8] rounded-full h-1.5">
                              <div
                                className="bg-[#F4CE14] h-1.5 rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.min(
                                    (camp.participantCount / 500) * 100,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        {camp.description && (
                          <p className="text-[#45474B]/70 text-sm line-clamp-2">
                            {camp.description}
                          </p>
                        )}

                        <Link
                          to={`/camp-details/${camp._id}`}
                          className="mt-4 w-full bg-gradient-to-r from-[#495E57] to-[#495E57]/90 hover:from-[#45474B] hover:to-[#45474B] text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md group/link"
                        >
                          View Details
                          <ArrowRight
                            className="ml-2 text-[#F4CE14] group-hover/link:translate-x-1 transition-transform duration-200"
                            size={16}
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
                    className="flex items-center gap-2 px-4 py-2 border border-[#495E57]/20 rounded-lg hover:bg-[#495E57]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[#45474B]"
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
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                              page === pageNum
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
                    className="flex items-center gap-2 px-4 py-2 border border-[#495E57]/20 rounded-lg hover:bg-[#495E57]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[#45474B]"
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
