import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  BarChart2,
  MessageSquare,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import { FaBangladeshiTakaSign } from "react-icons/fa6";
const stats = [
  {
    name: "Upcoming Camps",
    value: "12",
    icon: CalendarCheck,
    change: "+2 from last month",
  },
  {
    name: "Total Participants",
    value: "1,240",
    icon: Users,
    change: "↑ 18% from last month",
  },
  {
    name: "Revenue",
    value: "$24,800",
    icon: FaBangladeshiTakaSign,
    change: "↑ 12% from last month",
  },
  {
    name: "Feedback Received",
    value: "86",
    icon: MessageSquare,
    change: "↓ 5% from last month",
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
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 font-medium mb-4">
            <LayoutDashboard className="mr-2" size={20} />
            Organizer Overview
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CareCamp
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Organizer Dashboard
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your medical camps and track participant engagement
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, statIdx) => (
            <div
              key={statIdx}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-semibold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Camps */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-12">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <CalendarCheck className="mr-3 h-5 w-5 text-blue-600" />
              Recent Medical Camps
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentCamps.map((camp) => (
              <div
                key={camp.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{camp.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(camp.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-900">
                      {camp.participants} participants
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        camp.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {camp.status === "active" ? "Active" : "Completed"}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-gray-50 text-right">
            <a
              href="/organizer/camps"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View all camps
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="mr-3 h-5 w-5 text-purple-600" />
              Participant Management
            </h2>
            <p className="text-gray-600 mb-4">
              View and manage participants for your upcoming camps
            </p>
            <a
              href="/organizer/participants"
              className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors"
            >
              Manage Participants
            </a>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart2 className="mr-3 h-5 w-5 text-teal-600" />
              Camp Analytics
            </h2>
            <p className="text-gray-600 mb-4">
              View detailed analytics and reports for your camps
            </p>
            <a
              href="/organizer/analytics"
              className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-700 rounded-lg font-medium hover:bg-teal-200 transition-colors"
            >
              View Analytics
            </a>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="mr-3 h-5 w-5 text-amber-600" />
              Need Help?
            </h2>
            <p className="text-gray-600 mb-4">
              Get support or learn how to use the organizer dashboard
            </p>
            <a
              href="/organizer/support"
              className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-700 rounded-lg font-medium hover:bg-amber-200 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
