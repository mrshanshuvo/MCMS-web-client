import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Shared/Loader";
import {
  CalendarCheck,
  Users,
  BarChart2,
  MessageSquare,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  PlusCircle,
} from "lucide-react";

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch organizer's camps (limit 3 for recent, get totalCount too)
  const { data: campsData, isLoading: campsLoading } = useQuery({
    queryKey: ["organizerCampsSummary", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/organizer/camps?page=1&limit=3");
      return res.data;
    },
  });

  // Fetch all registrations for total participant count
  const { data: regsData, isLoading: regsLoading } = useQuery({
    queryKey: ["allRegistrationsSummary"],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/registrations?page=1&limit=1");
      return res.data;
    },
  });

  // Fetch recent feedback for count
  const { data: feedbackData, isLoading: feedbackLoading } = useQuery({
    queryKey: ["feedbackSummary"],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/feedback?limit=1000");
      return res.data;
    },
  });

  const isLoading = campsLoading || regsLoading || feedbackLoading;

  if (isLoading) return <Loader fullHeight={false} className="h-64" message="Loading dashboard..." />;

  const totalCamps = campsData?.totalCount || 0;
  const recentCamps = campsData?.camps || [];
  const totalParticipants = regsData?.pagination?.totalCount || 0;
  const feedbackCount = Array.isArray(feedbackData) ? feedbackData.length : 0;
  const avgPerCamp = totalCamps > 0 ? Math.round(totalParticipants / totalCamps) : 0;

  const stats = [
    {
      name: "Total Camps",
      value: totalCamps.toLocaleString(),
      icon: CalendarCheck,
      change: "Your published camps",
      trend: "up",
    },
    {
      name: "Total Participants",
      value: totalParticipants.toLocaleString(),
      icon: Users,
      change: "Across all your camps",
      trend: "up",
    },
    {
      name: "Avg. per Camp",
      value: avgPerCamp.toLocaleString(),
      icon: BarChart2,
      change: "Participants per camp",
      trend: "up",
    },
    {
      name: "Feedback Received",
      value: feedbackCount.toLocaleString(),
      icon: MessageSquare,
      change: "From camp participants",
      trend: feedbackCount > 0 ? "up" : "neutral",
    },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, statIdx) => (
            <div
              key={statIdx}
              className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-3">
                    <TrendingUp size={14} className="text-[#59ce8f]" />
                    <p className="text-xs text-[#59ce8f]">{stat.change}</p>
                  </div>
                </div>
                <div className="bg-[#e8f9fd] p-3 rounded-xl">
                  <stat.icon className="h-6 w-6 text-[#ff1e00]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Camps */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-12">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-[#ff1e00]" />
              Recent Medical Camps
            </h2>
            <Link
              to="/dashboard/add-camp"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#ff1e00] hover:text-[#ff1e00]/80 transition-colors"
            >
              <PlusCircle size={16} />
              Add Camp
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recentCamps.length > 0 ? (
              recentCamps.map((camp) => {
                const campDate = new Date(camp.dateTime);
                const now = new Date();
                const isToday = campDate.toDateString() === now.toDateString();
                const isUpcoming = campDate > now && !isToday;
                const statusLabel = isToday ? "Active" : isUpcoming ? "Upcoming" : "Completed";
                const statusStyle = isToday
                  ? "bg-[#59ce8f]/10 text-[#59ce8f]"
                  : isUpcoming
                    ? "bg-blue-50 text-blue-500"
                    : "bg-gray-100 text-gray-500";

                return (
                  <div
                    key={camp._id}
                    className="px-6 py-4 hover:bg-[#e8f9fd]/30 transition-colors"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{camp.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {campDate.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          • {camp.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                          {camp.participantCount || 0} participants
                        </span>
                        <span className="text-sm font-semibold text-[#ff1e00]">
                          ${camp.fees?.toFixed(2)}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle}`}>
                          {statusLabel}
                        </span>
                        <Link
                          to="/dashboard/manage-camps"
                          className="text-[#ff1e00] hover:text-[#ff1e00]/80 transition-colors"
                        >
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-6 py-12 text-center">
                <CalendarCheck size={40} className="mx-auto mb-3 text-gray-200" />
                <h3 className="text-gray-500 font-medium">No camps yet</h3>
                <p className="text-sm text-gray-400 mt-1">Create your first medical camp to get started.</p>
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-[#e8f9fd]/30 text-right border-t border-gray-100">
            <Link
              to="/dashboard/manage-camps"
              className="inline-flex items-center text-sm font-medium text-[#ff1e00] hover:text-[#ff1e00]/80 transition-colors"
            >
              View all camps
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-[#ff1e00]" />
              <h2 className="text-lg font-semibold text-gray-900">Participant Management</h2>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              View and manage participants for your camps
            </p>
            <Link
              to="/dashboard/manage-registrations"
              className="inline-flex items-center px-4 py-2 bg-[#e8f9fd] text-[#ff1e00] rounded-lg font-medium hover:bg-[#ff1e00] hover:text-white transition-all"
            >
              Manage Registrations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 className="h-5 w-5 text-[#ff1e00]" />
              <h2 className="text-lg font-semibold text-gray-900">Add New Camp</h2>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Create a new medical camp for participants
            </p>
            <Link
              to="/dashboard/add-camp"
              className="inline-flex items-center px-4 py-2 bg-[#e8f9fd] text-[#ff1e00] rounded-lg font-medium hover:bg-[#ff1e00] hover:text-white transition-all"
            >
              Create Camp
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-[#ff1e00]" />
              <h2 className="text-lg font-semibold text-gray-900">Manage Camps</h2>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Edit or remove your published medical camps
            </p>
            <Link
              to="/dashboard/manage-camps"
              className="inline-flex items-center px-4 py-2 bg-[#e8f9fd] text-[#ff1e00] rounded-lg font-medium hover:bg-[#ff1e00] hover:text-white transition-all"
            >
              Go to Camps
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;