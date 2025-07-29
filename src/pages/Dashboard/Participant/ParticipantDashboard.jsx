import React from "react";
import {
  CalendarCheck,
  ClipboardList,
  HeartPulse,
  Stethoscope,
} from "lucide-react";
import { useNavigate } from "react-router";

const ParticipantDashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Available Camps",
      description: "Browse and register for upcoming medical camps",
      icon: <Stethoscope className="text-blue-600" size={24} />,
      action: () => navigate("/available-camps"),
      color: "from-blue-100 to-blue-50",
    },
    {
      title: "My Registrations",
      description: "View your registered camps and appointments",
      icon: <CalendarCheck className="text-purple-600" size={24} />,
      action: () => navigate("/dashboard/registered-camps"),
      color: "from-purple-100 to-purple-50",
    },
    {
      title: "Medical History",
      description: "Access your medical records and history",
      icon: <HeartPulse className="text-teal-600" size={24} />,
      action: () => navigate("/dashboard/medical-history"),
      color: "from-teal-100 to-teal-50",
    },
    {
      title: "Feedback",
      description: "Share your experience with our services",
      icon: <ClipboardList className="text-indigo-600" size={24} />,
      action: () => navigate("/dashboard/feedback"),
      color: "from-indigo-100 to-indigo-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 font-medium mb-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
            Participant Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Welcome to Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Health Dashboard
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access all your medical camp information and health services in one
            place
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <div
              key={index}
              onClick={action.action}
              className={`bg-gradient-to-br ${action.color} border border-gray-200 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-xl bg-white shadow-sm mr-4">
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {action.title}
                </h3>
              </div>
              <p className="text-gray-600">{action.description}</p>
            </div>
          ))}
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-8">
          <div className="bg-gradient-to-r from-[#1e3a8a] to-[#0f766e] p-6 text-white">
            <h2 className="text-xl font-bold flex items-center">
              <CalendarCheck className="mr-3" size={24} />
              Upcoming Medical Camps
            </h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8 text-gray-500">
              <p>You don't have any upcoming camp registrations</p>
              <button
                onClick={() => navigate("/dashboard/available-camps")}
                className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Browse Available Camps
              </button>
            </div>
          </div>
        </div>

        {/* Health Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <HeartPulse className="text-red-500 mr-3" size={20} />
              Health Summary
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>Last checkup: Not available</p>
              <p>Blood type: Not specified</p>
              <p>Allergies: None recorded</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <ClipboardList className="text-green-500 mr-3" size={20} />
              Recent Activities
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>No recent activities</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Stethoscope className="text-blue-500 mr-3" size={20} />
              Quick Links
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate("/dashboard/medical-history")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Full Medical History
              </button>
              <button
                onClick={() => navigate("/dashboard/feedback")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Provide Feedback
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Update Profile Information
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;
