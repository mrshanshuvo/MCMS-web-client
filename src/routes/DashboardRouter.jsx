import useUserRole from "../hooks/useUserRole";
import OrganizerDashboard from "../pages/DashboardPages/Organizer/OrganizerDashboard";
import ParticipantDashboard from "../pages/DashboardPages/Participant/ParticipantDashboard";

const DashboardRouter = () => {
  const { role, roleLoading: loading } = useUserRole();

  if (loading) {
    return <p>Loading your dashboard...</p>;
  }

  if (role === "organizer") {
    return <OrganizerDashboard />;
  }

  if (role === "participant") {
    return <ParticipantDashboard />;
  }

  // If role is unknown or user unauthorized
  return <p>You do not have access to this dashboard.</p>;
};

export default DashboardRouter;
