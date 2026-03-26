import React from "react";
import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import api from "../../../api";
import {
  CalendarDays,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Bookmark,
  MessageSquare,
} from "lucide-react";
import Loader from "../../../components/Shared/Loader";

/**
 * BlogDetails - A premium dynamic page to display the full context of a blog post.
 */
const BlogDetails = () => {
  const { _id } = useParams();

  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["post", _id],
    queryFn: async () => {
      const res = await api.get(`/blogs/${_id}`);
      return res.data.data;
    },
    enabled: !!_id,
  });

  if (isLoading) {
    return <Loader fullHeight message="Loading blog details..." />;
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-[#F5F7F8] flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-[#495E57]/10 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Post Not Found</h2>
          <p className="text-[#45474B]/70 mb-6">
            {error?.message || "The blog post you're looking for doesn't exist."}
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center text-[#495E57] font-medium hover:underline"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7F8] pb-20">
      {/* Hero Header */}
      <div className="relative h-[40vh] min-h-[400px] w-full overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
          <div className="container mx-auto">
            <Link
              to="/blogs"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-6 group"
            >
              <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-[#F4CE14] text-[#45474B] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {post.category}
              </span>
              <div className="flex items-center text-white/90 text-[11px] font-medium">
                <Clock className="w-3.5 h-3.5 mr-1 text-[#F4CE14]" />
                {post.readingTime}
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white max-w-4xl leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 -mt-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-[#495E57]/5">
            {/* Meta Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b border-[#495E57]/10 bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#495E57]/10 flex items-center justify-center overflow-hidden border-2 border-[#495E57]/20">
                  {post.authorPhoto ? (
                    <img src={post.authorPhoto} alt={post.author} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-[#495E57]" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-[#45474B]">{post.author}</p>
                  <div className="flex items-center text-sm text-[#45474B]/60 italic">
                    <CalendarDays className="w-3.5 h-3.5 mr-1" />
                    {post.date}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2.5 rounded-full hover:bg-[#495E57]/5 text-[#45474B]/60 hover:text-[#495E57] transition-all border border-transparent hover:border-[#495E57]/10">
                  <Share2 className="w-5 h-5 transition-transform hover:scale-110 active:scale-95" />
                </button>
                <button className="p-2.5 rounded-full hover:bg-[#495E57]/5 text-[#45474B]/60 hover:text-[#495E57] transition-all border border-transparent hover:border-[#495E57]/10">
                  <Bookmark className="w-5 h-5 transition-transform hover:scale-110 active:scale-95" />
                </button>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-8 sm:p-12">
              {/* Summary/Intro */}
              <p className="text-xl text-[#45474B]/80 font-medium leading-relaxed mb-10 border-l-4 border-[#F4CE14] pl-6 py-1 italic">
                {post.summary}
              </p>

              {/* Main Text Content */}
              <div className="prose prose-lg max-w-none text-[#45474B] leading-extra-relaxed space-y-6">
                {post.content ? (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                ) : (
                  <p className="text-gray-400 italic font-light">No content available for this post.</p>
                )}
              </div>

              {/* Keywords/Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-[#495E57]/10 flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-[#495E57]/5 text-[#495E57] rounded-full text-xs font-medium hover:bg-[#F4CE14] hover:text-[#45474B] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Footer / Interaction */}
            <div className="bg-[#495E57]/5 p-6 sm:p-8 border-t border-[#495E57]/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden`}>
                      <User size={16} className="text-slate-400" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-[#45474B]/70 whitespace-nowrap">
                  Join the conversation with <span className="font-bold">12 others</span>
                </p>
              </div>

              <button className="flex items-center gap-2 bg-[#495E57] hover:bg-[#3a4d45] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95">
                <MessageSquare className="w-5 h-5 shadow-sm" />
                Leave a Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BlogDetails);
