import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { MapPin, Calendar, Users, User, ArrowRight, Star } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { FaBangladeshiTakaSign } from "react-icons/fa6";
import useAxios from "../../../hooks/useAxios";

const PopularCampsSection = () => {
  const axios = useAxios();

  const {
    data: camps = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["camps"],
    queryFn: async () => {
      const res = await axios.get("/camps");
      return res.data?.camps || [];
    },
    staleTime: 60_000,
  });

  // Sort camps by participantCount descending and take top 6
  const popularCamps = [...camps]
    .sort((a, b) => b.participantCount - a.participantCount)
    .slice(0, 6);

  // Fallback image URL
  const getFallbackImage = (campName) => {
    const placeholderUrl = `https://placehold.co/400x300/495E57/F4CE14/png?text=${encodeURIComponent(
      campName,
    )}`;
    return placeholderUrl;
  };

  if (isError) {
    return (
      <section className="bg-gradient-to-b from-[#F5F7F8] to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-2xl mx-auto">
            <h3 className="font-bold text-lg mb-2">Error Loading Camps</h3>
            <p className="break-words">
              {error?.message || "Something went wrong."}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="mt-4 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded transition-colors cursor-pointer"
            >
              {isFetching ? "Retrying..." : "Try Again"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-[#F5F7F8] to-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-[#495E57]/10 text-[#495E57] px-4 py-2 rounded-full text-sm font-medium mb-3">
          <Star size={16} className="text-[#F4CE14]" fill="#F4CE14" />
          Most Popular Camps
        </div>

        <div className="flex items-center justify-between text-left">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#45474B] mb-2">
              Popular
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#495E57] to-[#F4CE14]">
                {" "}
                Medical Camps
              </span>
            </h2>
            <p className="text-lg text-[#45474B]/70 max-w-2xl mx-auto">
              Join thousands of healthcare professionals in these upcoming medical
              camps
            </p>
          </div>

          <Link
            to="/available-camps"
            className="group relative inline-flex items-center bg-[#495E57] hover:bg-[#45474B] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
          >
            <span className="relative z-10 flex items-center">
              Explore All Camps
              <ArrowRight
                className="ml-2 text-[#F4CE14] group-hover:translate-x-1 transition-transform duration-300"
                size={18}
              />
            </span>
            <div className="absolute inset-0 bg-[#45474B] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="border border-[#495E57]/10 rounded-xl overflow-hidden shadow-sm"
              >
                <Skeleton height={200} className="w-full" />
                <div className="p-5">
                  <Skeleton count={1} height={30} className="mb-3" />
                  <Skeleton count={5} height={15} className="mb-2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularCamps.slice(0, 4).map((camp, index) => (
                <div
                  key={camp._id}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 border border-[#495E57]/8 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {/* Image Block */}
                  <div className="relative w-full h-52 overflow-hidden">
                    <img
                      src={camp.imageURL || getFallbackImage(camp.name)}
                      alt={camp.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      onError={(e) => { e.target.src = getFallbackImage(camp.name); }}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 bg-[#F4CE14] text-[#2d2f30] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                        <Star size={10} fill="currentColor" />
                        Popular
                      </span>
                    </div>

                    {/* Fee badge */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-0.5 bg-white/90 backdrop-blur-sm text-[#45474B] text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                        <FaBangladeshiTakaSign size={10} className="text-[#495E57]" />
                        {camp.fees.toFixed(0)}
                      </span>
                    </div>

                    {/* Title on image */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-base font-bold text-white leading-snug line-clamp-1">
                        {camp.name}
                      </h3>
                    </div>
                  </div>

                  {/* Content Block */}
                  <div className="p-4 flex flex-col gap-3">

                    {/* Meta row 1 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[#495E57]">
                        <MapPin size={13} className="shrink-0" />
                        <span className="text-xs font-medium text-[#45474B]">{camp.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#45474B]">
                        <Calendar size={13} className="shrink-0 text-[#495E57]" />
                        <span className="text-xs text-[#45474B]">
                          {new Date(camp.dateTime).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Healthcare professional */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-[#495E57]/10 flex items-center justify-center shrink-0">
                        <User size={12} className="text-[#495E57]" />
                      </div>
                      <span className="text-xs text-[#45474B] truncate">{camp.healthcareProfessional}</span>
                    </div>

                    {/* Participants + progress */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Users size={13} className="text-[#495E57]" />
                          <span className="text-xs font-semibold text-[#45474B]">{camp.participantCount} participants</span>
                        </div>
                        <span className="text-[10px] text-[#495E57]/60 font-medium">
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
                      className="mt-1 w-full flex items-center justify-center gap-2 bg-[#495E57] hover:bg-[#3a4d47] text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 group/btn shadow-sm hover:shadow-md"
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
          </>
        )}
      </div>
    </section>
  );
};

export default React.memo(PopularCampsSection);
