import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  User,
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const fetchCamps = async ({ queryKey }) => {
  const [_key, { page, search, sort }] = queryKey;
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (search) params.append("search", search);
  if (sort) params.append("sort", sort);

  const res = await axios.get(
    `http://localhost:5000/camps?${params.toString()}`
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

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Available
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Medical Camps
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find and join medical camps that match your expertise and interests
          </p>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-2xl">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search camps by name, location or professional..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="sort" className="text-gray-600 whitespace-nowrap">
              Sort by:
            </label>
            <select
              id="sort"
              value={sort}
              onChange={handleSortChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <Skeleton height={200} className="w-full" />
                <div className="p-5">
                  <Skeleton count={1} height={28} className="mb-4" />
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton circle width={16} height={16} />
                        <Skeleton width={100} height={16} />
                      </div>
                    ))}
                  </div>
                  <Skeleton height={40} className="mt-4 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {data.camps.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No camps found
                </h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting your search or filter to find what you're
                  looking for.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {data.camps.map((camp) => (
                    <div
                      key={camp._id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
                    >
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        <img
                          src={
                            camp.imageURL ||
                            `https://placehold.co/600x400?text=${encodeURIComponent(
                              camp.name.substring(0, 20)
                            )}`
                          }
                          alt={camp.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = `https://placehold.co/600x400?text=${encodeURIComponent(
                              camp.name.substring(0, 20)
                            )}`;
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <h2 className="text-xl font-bold text-white">
                            {camp.name}
                          </h2>
                        </div>
                      </div>
                      <div className="p-5 space-y-3">
                        <div className="flex items-center text-gray-700">
                          <MapPin className="mr-2 text-blue-500" size={16} />
                          <span>{camp.location}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Calendar className="mr-2 text-blue-500" size={16} />
                          <span>
                            {new Date(camp.dateTime).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <DollarSign
                            className="mr-2 text-blue-500"
                            size={16}
                          />
                          <span>${camp.fees.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <User className="mr-2 text-blue-500" size={16} />
                          <span className="truncate">
                            {camp.healthcareProfessional}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Users className="mr-2 text-blue-500" size={16} />
                          <span>
                            {camp.participantCount.toLocaleString()}{" "}
                            participants
                          </span>
                        </div>
                        <Link
                          to={`/camp-details/${camp._id}`}
                          className="mt-4 inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-50 to-gray-50 hover:from-blue-100 hover:to-gray-100 text-blue-600 font-medium py-2 px-4 rounded-lg border border-gray-200 transition-colors"
                        >
                          View Details <ArrowRight className="ml-2" size={16} />
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
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              page === pageNum
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                    {data.totalPages > 5 && <span className="mx-2">...</span>}
                  </div>
                  <button
                    onClick={() =>
                      setPage((old) => (old < data.totalPages ? old + 1 : old))
                    }
                    disabled={page === data.totalPages || data.totalPages === 0}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
