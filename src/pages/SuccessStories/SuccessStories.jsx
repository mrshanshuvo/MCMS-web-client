import React, { useState } from "react";
import {
  Users,
  CheckCircle,
  Activity,
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const iconMap = {
  Users: <Users className="text-blue-500" size={18} />,
  CheckCircle: <CheckCircle className="text-green-500" size={18} />,
  Activity: <Activity className="text-purple-500" size={18} />,
  Star: <Star className="text-yellow-400 fill-yellow-400" size={18} />,
  Heart: <Heart className="text-red-500 fill-red-500" size={18} />,
};

const STORIES_PER_PAGE = 6;

const SuccessStories = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const axiosSecure = useAxiosSecure();

  // fetching from the backend using tanstack query
  const { data: storiesData = { data: [] } } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/successStories");
      return res.data;
    },
  });

  const stories = storiesData.data || []; // actual array of stories

  const totalPages = Math.ceil(stories.length / STORIES_PER_PAGE);

  const paginatedStories = stories.slice(
    (currentPage - 1) * STORIES_PER_PAGE,
    currentPage * STORIES_PER_PAGE
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Success Stories
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real impact. Real results. See how MCMS is transforming healthcare
            delivery.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {paginatedStories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {story.name}
                    </h3>
                    <p className="text-blue-600 font-medium">{story.role}</p>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`${
                          i < story.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        } ml-1`}
                        size={16}
                      />
                    ))}
                  </div>
                </div>

                <blockquote className="text-gray-700 mb-4 italic relative pl-4 border-l-2 border-blue-200">
                  "{story.quote}"
                </blockquote>

                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-2">
                    <CheckCircle className="mr-1 text-blue-600" size={14} />
                    Key Achievement
                  </span>
                  <p className="font-semibold text-gray-800">
                    {story.achievement}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {story.stats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-3 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center justify-center mb-1">
                        {iconMap[stat.icon]}
                      </div>
                      <p className="font-bold text-gray-900 text-center">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 text-center">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-12 gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex cursor-pointer items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-10 cursor-pointer h-10 rounded-full flex items-center justify-center ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && <span className="mx-1">...</span>}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center cursor-pointer gap-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(SuccessStories);
