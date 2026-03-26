import { useQuery } from "@tanstack/react-query";
import {
  CalendarCheck,
  Activity,
  ArrowRight,
  TrendingUp,
  Star,
  DollarSign,
  Stethoscope,
} from "lucide-react";
import { useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import api from "../../../api";
import Loader from "../../../components/Shared/Loader";

const ParticipantDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch participant analytics (camps attended, fees paid)
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ["analytics", user?.uid],
    enabled: !!user?.uid,
    queryFn: async () => {
      const res = await axiosSecure.get(`/analytics/${user.uid}`);
      return res.data.data || [];
    },
  });

  // Fetch popular camps for the featured section
  const { data: campsData, isLoading: campsLoading } = useQuery({
    queryKey: ["popularCampsDashboard"],
    queryFn: async () => {
      const res = await api.get("/camps?limit=3&sort=participantCount");
      return res.data.camps || [];
    },
  });

  const isLoading = analyticsLoading || campsLoading;

  if (isLoading) return <Loader fullHeight={false} className="h-64" message="Loading your dashboard..." />;

  const analytics = analyticsData || [];
  const totalCampsAttended = analytics.length;
  const totalSpent = analytics.reduce((sum, c) => sum + (c.fees || 0), 0);
  const confirmedCamps = analytics.filter((c) => c.status === "Confirmed").length;
  const featuredCamps = campsData || [];

  const quickActions = [
    {
      title: "Available Camps",
      description: "Browse and register for upcoming medical camps",
      icon: <Stethoscope size={24} />,
      action: () => navigate("/available-camps"),
      badge: "Explore",
    },
    {
      title: "My Registrations",
      description: "View your registered camps and appointments",
      icon: <CalendarCheck size={24} />,
      action: () => navigate("/dashboard/registered-camps"),
      badge: `${totalCampsAttended} Camps`,
    },
    {
      title: "Payment History",
      description: "View your transaction and payment records",
      icon: <DollarSign size={24} />,
      action: () => navigate("/dashboard/payment-history"),
      badge: `$${totalSpent.toFixed(0)} Spent`,
    },
    {
      title: "Analytics",
      description: "View your medical camp participation analytics",
      icon: <Activity size={24} />,
      action: () => navigate("/dashboard/analytics"),
      badge: `${confirmedCamps} Confirmed`,
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold text-gray-900">{totalCampsAttended}</span>
              <TrendingUp size={20} className="text-[#59ce8f]" />
            </div>
            <p className="text-gray-600">Camps Attended</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold text-gray-900">${totalSpent.toFixed(2)}</span>
              <Star size={20} className="text-[#ff1e00]" />
            </div>
            <p className="text-gray-600">Total Invested</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold text-gray-900">{confirmedCamps}</span>
              <Activity size={20} className="text-[#59ce8f]" />
            </div>
            <p className="text-gray-600">Confirmed Camps</p>
          </div>
        </div>

        {/* Quick Actions */}
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
                <span className="text-xs font-semibold text-[#ff1e00] bg-[#ff1e00]/10 px-2 py-1 rounded-full whitespace-nowrap">
                  {action.badge}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-500 text-sm mb-4">{action.description}</p>
              <div className="flex items-center text-[#ff1e00] text-sm font-medium group-hover:gap-2 transition-all">
                Get Started <ArrowRight size={16} className="ml-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Popular Camps + Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Camps</h2>
            {featuredCamps.length > 0 ? (
              <div className="space-y-4">
                {featuredCamps.map((camp, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{camp.name}</h3>
                      <p className="text-sm text-gray-500">
                        {camp.location} •{" "}
                        {new Date(camp.dateTime).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-[#ff1e00]">
                        ${camp.fees?.toFixed(2)}
                      </span>
                      <button
                        onClick={() => navigate(`/camp-details/${camp._id}`)}
                        className="px-3 py-1.5 bg-[#ff1e00] text-white rounded-lg text-sm font-medium hover:bg-[#ff1e00]/90 transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Activity size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No camps available right now</p>
              </div>
            )}
            <button
              onClick={() => navigate("/available-camps")}
              className="mt-6 text-[#ff1e00] font-medium flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
            >
              Browse all Camps →
            </button>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/dashboard/registered-camps")}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#e8f9fd] transition-colors flex items-center justify-between group"
              >
                <span className="text-gray-700 group-hover:text-[#59ce8f]">My Registrations</span>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-[#59ce8f]" />
              </button>
              <button
                onClick={() => navigate("/dashboard/payment-history")}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#e8f9fd] transition-colors flex items-center justify-between group"
              >
                <span className="text-gray-700 group-hover:text-[#ff1e00]">Payment History</span>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-[#ff1e00]" />
              </button>
              <button
                onClick={() => navigate("/dashboard/analytics")}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#e8f9fd] transition-colors flex items-center justify-between group"
              >
                <span className="text-gray-700 group-hover:text-[#ff1e00]">Analytics</span>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-[#ff1e00]" />
              </button>
              <button
                onClick={() => navigate("/dashboard/profile")}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#e8f9fd] transition-colors flex items-center justify-between group"
              >
                <span className="text-gray-700 group-hover:text-[#ff1e00]">Update Profile</span>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-[#ff1e00]" />
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="bg-[#e8f9fd] rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-2">Need assistance?</p>
                <button
                  onClick={() => navigate("/contact")}
                  className="text-[#ff1e00] font-semibold hover:underline cursor-pointer"
                >
                  Contact Support →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;