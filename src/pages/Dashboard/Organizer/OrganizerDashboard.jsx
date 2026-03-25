import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  BarChart2,
  MessageSquare,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import { FaBangladeshiTakaSign } from "react-icons/fa6";

const stats = [
  {
    name: "Upcoming Camps",
    value: "12",
    icon: CalendarCheck,
    change: "+2 from last month",
    trend: "up",
  },
  {
    name: "Total Participants",
    value: "1,240",
    icon: Users,
    change: "+18% from last month",
    trend: "up",
  },
  {
    name: "Revenue",
    value: "$24,800",
    icon: FaBangladeshiTakaSign,
    change: "+12% from last month",
    trend: "up",
  },
  {
    name: "Feedback Received",
    value: "86",
    icon: MessageSquare,
    change: "-5% from last month",
    trend: "down",
  },
];

const recentCamps = [
  {
    id: 1,
    name: "Cardiology Screening",
    date: "2023-11-15",
    participants: 120,
    status: "active",
  },
  {
    id: 2,
    name: "Pediatric Checkup",
    date: "2023-11-20",
    participants: 85,
    status: "active",
  },
  {
    id: 3,
    name: "Diabetes Awareness",
    date: "2023-11-05",
    participants: 150,
    status: "completed",
  },
];

const OrganizerDashboard = () => {
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
                  <p className="text-sm font-medium text-gray-500">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-3">
                    {stat.trend === "up" ? (
                      <TrendingUp size={14} className="text-[#59ce8f]" />
                    ) : (
                      <TrendingDown size={14} className="text-[#ff1e00]" />
                    )}
                    <p className={`text-xs ${stat.trend === "up" ? "text-[#59ce8f]" : "text-[#ff1e00]"
                      }`}>
                      {stat.change}
                    </p>
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
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-[#ff1e00]" />
              Recent Medical Camps
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentCamps.map((camp) => (
              <div
                key={camp.id}
                className="px-6 py-4 hover:bg-[#e8f9fd]/30 transition-colors"
              >
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{camp.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(camp.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {camp.participants} participants
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${camp.status === "active"
                        ? "bg-[#59ce8f]/10 text-[#59ce8f]"
                        : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {camp.status === "active" ? "Active" : "Completed"}
                    </span>
                    <button className="text-[#ff1e00] hover:text-[#ff1e00]/80 transition-colors">
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-[#e8f9fd]/30 text-right border-t border-gray-100">
            <a
              href="/organizer/camps"
              className="inline-flex items-center text-sm font-medium text-[#ff1e00] hover:text-[#ff1e00]/80 transition-colors"
            >
              View all camps
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-[#ff1e00]" />
              <h2 className="text-lg font-semibold text-gray-900">
                Participant Management
              </h2>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              View and manage participants for your upcoming camps
            </p>
            <a
              href="/organizer/participants"
              className="inline-flex items-center px-4 py-2 bg-[#e8f9fd] text-[#ff1e00] rounded-lg font-medium hover:bg-[#ff1e00] hover:text-white transition-all"
            >
              Manage Participants
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 className="h-5 w-5 text-[#ff1e00]" />
              <h2 className="text-lg font-semibold text-gray-900">
                Camp Analytics
              </h2>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              View detailed analytics and reports for your camps
            </p>
            <a
              href="/organizer/analytics"
              className="inline-flex items-center px-4 py-2 bg-[#e8f9fd] text-[#ff1e00] rounded-lg font-medium hover:bg-[#ff1e00] hover:text-white transition-all"
            >
              View Analytics
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-[#ff1e00]" />
              <h2 className="text-lg font-semibold text-gray-900">
                Need Help?
              </h2>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Get support or learn how to use the organizer dashboard
            </p>
            <a
              href="/organizer/support"
              className="inline-flex items-center px-4 py-2 bg-[#e8f9fd] text-[#ff1e00] rounded-lg font-medium hover:bg-[#ff1e00] hover:text-white transition-all"
            >
              Contact Support
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;