import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import AvailableCamps from "../pages/Camps/AvailableCamps";
import CampDetails from "../pages/Camps/CampDetails";
import NotFound from "../pages/NotFound/NotFound";
import DashboardLayout from "../layouts/DashboardLayout";
import AddCamp from "../pages/Dashboard/Organizer/AddCamp";
import ManageCamps from "../pages/Dashboard/Organizer/ManageCamps";
import ManageRegistrations from "../pages/Dashboard/Organizer/ManageRegistrations";
import FeedbackList from "../pages/Dashboard/Organizer/FeedbackList";
import OrganizerRoute from "./OrganizerRoute";
import PrivateRoute from "./PrivateRoute";
import OrganizerDashboard from "../pages/Dashboard/Organizer/OrganizerDashboard";
import ParticipantRoute from "./ParticipantRoute";
import ParticipantDashboard from "../pages/Dashboard/Participant/ParticipantDashboard";
import DashboardRouter from "./DashboardRouter";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        Component: Home,
      },
      { path: "available-camps", Component: AvailableCamps },
      { path: "camp-details/:campId", Component: CampDetails },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    errorElement: <NotFound />,
    children: [
      { path: "login", Component: Login },
      { path: "register", Component: Register },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <DashboardRouter />,
      },
      {
        path: "add-camp",
        element: (
          <OrganizerRoute>
            <AddCamp />
          </OrganizerRoute>
        ),
      },
      {
        path: "manage-camps",
        element: (
          <OrganizerRoute>
            <ManageCamps />
          </OrganizerRoute>
        ),
      },
      {
        path: "manage-registrations",
        element: (
          <OrganizerRoute>
            <ManageRegistrations />
          </OrganizerRoute>
        ),
      },
      {
        path: "feedbacks",
        element: (
          <OrganizerRoute>
            <FeedbackList />
          </OrganizerRoute>
        ),
      },
    ],
  },
]);
