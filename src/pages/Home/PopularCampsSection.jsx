import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";
import {
  MapPin,
  Calendar,
  Users,
  User,
  DollarSign,
  ArrowRight,
  Star,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const fetchCamps = async () => {
  const { data } = await axios.get("http://localhost:5000/camps");
  return data.camps;
};

const PopularCampsSection = () => {
  const {
    data: camps = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["camps"],
    queryFn: fetchCamps,
  });

  // Sort camps by participantCount descending and take top 6
  const popularCamps = [...camps]
    .sort((a, b) => b.participantCount - a.participantCount)
    .slice(0, 6);

  // Fallback image URL
  const getFallbackImage = (campName) => {
    const placeholderUrl = `https://placehold.co/400x300/495E57/F4CE14/png?text=${encodeURIComponent(
      campName
    )}`;
    return placeholderUrl;
  };

  if (isError) {
    return (
      <section className="bg-gradient-to-b from-[#F5F7F8] to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-2xl mx-auto">
            <h3 className="font-bold text-lg mb-2">Error Loading Camps</h3>
            <p>{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-[#F5F7F8] to-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#495E57]/10 text-[#495E57] px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star size={16} className="text-[#F4CE14]" fill="#F4CE14" />
            Most Popular Camps
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#45474B] mb-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularCamps.map((camp) => (
                <div
                  key={camp._id}
                  className="bg-white border border-[#495E57]/10 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="relative w-full h-48 bg-gradient-to-br from-[#495E57]/10 to-[#F4CE14]/10 overflow-hidden">
                    <img
                      src={camp.imageURL || getFallbackImage(camp.name)}
                      alt={camp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = getFallbackImage(camp.name);
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <div className="bg-[#F4CE14] text-[#45474B] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Star size={12} fill="currentColor" />
                        Popular
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#45474B] to-transparent p-4">
                      <h3 className="text-xl font-bold text-white">
                        {camp.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
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
                          {new Date(camp.dateTime).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-[#45474B]">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#F4CE14]/20 rounded-lg flex items-center justify-center mr-3">
                          <DollarSign className="text-[#F4CE14]" size={16} />
                        </div>
                        <span className="text-sm font-semibold">
                          ${camp.fees.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center text-[#45474B]">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#495E57]/10 rounded-lg flex items-center justify-center mr-3">
                          <User className="text-[#495E57]" size={16} />
                        </div>
                        <span className="text-sm">
                          {camp.healthcareProfessional}
                        </span>
                      </div>
                      <div className="flex items-center text-[#45474B]">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#495E57]/10 rounded-lg flex items-center justify-center mr-3">
                          <Users className="text-[#495E57]" size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              {camp.participantCount} participants
                            </span>
                          </div>
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
                    </div>
                    <Link
                      to={`/camp-details/${camp._id}`}
                      className="mt-6 w-full bg-gradient-to-r from-[#495E57] to-[#495E57]/90 hover:from-[#45474B] hover:to-[#45474B] text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md group/link"
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

            <div className="text-center mt-12">
              <Link
                to="/available-camps"
                className="group relative inline-flex items-center bg-[#495E57] hover:bg-[#45474B] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
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
          </>
        )}
      </div>
    </section>
  );
};

export default React.memo(PopularCampsSection);
