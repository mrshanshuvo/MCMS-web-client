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
    // Use a more reliable placeholder service
    const placeholderUrl = `https://placehold.co/400x300/cccccc/969696/png?text=${encodeURIComponent(
      campName
    )}`;

    // Alternative options (comment out the one you prefer)
    // const placeholderUrl = `https://dummyimage.com/400x300/cccccc/969696.png&text=${encodeURIComponent(campName)}`;
    // const placeholderUrl = `/placeholder.jpg`; // Local fallback

    return placeholderUrl;
  };

  if (isError) {
    return (
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
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
    <section className="bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Popular
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Medical Camps
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of healthcare professionals in these upcoming medical
            camps
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="border rounded-xl overflow-hidden shadow-sm"
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
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={camp.imageURL || getFallbackImage(camp.name)}
                      alt={camp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = getFallbackImage(camp.name);
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-xl font-bold text-white">
                        {camp.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <MapPin className="mr-2 text-blue-500" size={16} />
                        <span>{camp.location}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Calendar className="mr-2 text-blue-500" size={16} />
                        <span>
                          {new Date(camp.dateTime).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <DollarSign className="mr-2 text-blue-500" size={16} />
                        <span>${camp.fees.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <User className="mr-2 text-blue-500" size={16} />
                        <span>{camp.healthcareProfessional}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Users className="mr-2 text-blue-500" size={16} />
                        <span>{camp.participantCount} participants</span>
                      </div>
                    </div>
                    <Link
                      to={`/camps/${camp._id}`}
                      className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      View Details <ArrowRight className="ml-1" size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/available-camps"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Explore All Camps
                <ArrowRight
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  size={18}
                />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default React.memo(PopularCampsSection);
