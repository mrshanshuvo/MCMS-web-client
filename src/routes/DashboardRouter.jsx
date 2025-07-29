import OrganizerDashboard from "../pages/Dashboard/Organizer/OrganizerDashboard";
import ParticipantDashboard from "../pages/Dashboard/Participant/ParticipantDashboard";
import useUserRole from "../hooks/useUserRole";

const DashboardRouter = () => {
  const { role, loading } = useUserRole();

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
