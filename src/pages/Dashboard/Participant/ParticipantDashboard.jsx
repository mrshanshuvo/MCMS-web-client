import React from "react";
import {
  CalendarCheck,
  ClipboardList,
  HeartPulse,
  Stethoscope,
  Activity,
  ArrowRight,
  TrendingUp,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router";

const ParticipantDashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Available Camps",
      description: "Browse and register for upcoming medical camps",
      icon: <Stethoscope size={24} />,
      action: () => navigate("/available-camps"),
      price: "Free",
    },
    {
      title: "My Registrations",
      description: "View your registered camps and appointments",
      icon: <CalendarCheck size={24} />,
      action: () => navigate("/dashboard/registered-camps"),
      stats: "3 Active",
    },
    {
      title: "Medical History",
      description: "Access your medical records and history",
      icon: <HeartPulse size={24} />,
      action: () => navigate("/dashboard/medical-history"),
      stats: "Complete",
    },
    {
      title: "Feedback",
      description: "Share your experience with our services",
      icon: <ClipboardList size={24} />,
      action: () => navigate("/dashboard/feedback"),
      rating: "4.8 ★",
    },
  ];

  const featuredCamps = [
    {
      name: "Free Health Camp",
      location: "Community Center",
      date: "March 28, 2026",
      price: "Free",
    },
    {
      name: "Dental Checkup",
      location: "City Hospital",
      date: "April 5, 2026",
      price: "$25.00",
    },
  ];

  return (
    <div className="min-h-screen bg-[#e8f9fd] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Clean and minimal */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Your
            <br />
            <span className="text-[#ff1e00]">Health Dashboard</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Access all your medical camp information and health services in one place
          </p>
        </div>

        {/* Stats Section - Clean cards with subtle styling */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold text-gray-900">20K+</span>
              <TrendingUp size={20} className="text-[#59ce8f]" />
            </div>
            <p className="text-gray-600">Happy Participants</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold text-gray-900">6K</span>
              <Star size={20} className="text-[#ff1e00]" />
            </div>
            <p className="text-gray-600">Positive Reviews</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold text-gray-900">50+</span>
              <Activity size={20} className="text-[#59ce8f]" />
            </div>
            <p className="text-gray-600">Active Camps</p>
          </div>
        </div>

        {/* Quick Actions Section - Inspired by the product cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <div
              key={index}
              onClick={action.action}
              className="bg-white rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 group border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-[#e8f9fd] text-[#ff1e00] group-hover:bg-[#ff1e00] group-hover:text-white transition-all duration-300">
                  {action.icon}
                </div>
                {action.price && (
                  <span className="text-xl font-bold text-[#ff1e00]">{action.price}</span>
                )}
                {action.stats && (
                  <span className="text-sm font-medium text-[#59ce8f]">{action.stats}</span>
                )}
                {action.rating && (
                  <span className="text-sm font-medium text-[#ff1e00]">{action.rating}</span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {action.title}
              </h3>
              <p className="text-gray-500 text-sm mb-4">{action.description}</p>
              <div className="flex items-center text-[#ff1e00] text-sm font-medium group-hover:gap-2 transition-all">
                Get Started <ArrowRight size={16} className="ml-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Featured Camps Section - Similar to product listing style */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Camps</h2>
            <div className="space-y-6">
              {featuredCamps.map((camp, idx) => (
                <div key={idx} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{camp.name}</h3>
                    <p className="text-sm text-gray-500">{camp.location} • {camp.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-[#ff1e00]">{camp.price}</span>
                    <button className="px-4 py-2 bg-[#ff1e00] text-white rounded-lg text-sm font-medium hover:bg-[#ff1e00]/90 transition-colors">
                      Register
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/available-camps")}
              className="mt-6 text-[#ff1e00] font-medium flex items-center gap-1 hover:gap-2 transition-all"
            >
              Browse all accessories →
            </button>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/dashboard/medical-history")}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#e8f9fd] transition-colors flex items-center justify-between group"
              >
                <span className="text-gray-700 group-hover:text-[#ff1e00]">Medical History</span>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-[#ff1e00]" />
              </button>
              <button
                onClick={() => navigate("/dashboard/registered-camps")}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#e8f9fd] transition-colors flex items-center justify-between group"
              >
                <span className="text-gray-700 group-hover:text-[#59ce8f]">My Registrations</span>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-[#59ce8f]" />
              </button>
              <button
                onClick={() => navigate("/dashboard/feedback")}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#e8f9fd] transition-colors flex items-center justify-between group"
              >
                <span className="text-gray-700 group-hover:text-[#ff1e00]">Write a Review</span>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-[#ff1e00]" />
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#e8f9fd] transition-colors flex items-center justify-between group"
              >
                <span className="text-gray-700 group-hover:text-[#ff1e00]">Update Profile</span>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-[#ff1e00]" />
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="bg-[#e8f9fd] rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-2">Need assistance?</p>
                <p className="text-[#ff1e00] font-semibold">Contact Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;