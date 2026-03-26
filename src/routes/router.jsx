import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/LandingPages/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/AuthenticationPages/Login/Login";
import Register from "../pages/AuthenticationPages/Register/Register";
import AvailableCamps from "../pages/LandingPages/Camps/AvailableCamps";
import CampDetails from "../pages/LandingPages/Camps/CampDetails";
import NotFound from "../pages/Shared/NotFound/NotFound";
import DashboardLayout from "../layouts/DashboardLayout";
import AddCamp from "../pages/DashboardPages/Organizer/AddCamp";
import ManageCamps from "../pages/DashboardPages/Organizer/ManageCamps";
import ManageRegistrations from "../pages/DashboardPages/Organizer/ManageRegistrations";
import OrganizerRoute from "./OrganizerRoute";
import PrivateRoute from "./PrivateRoute";
import ParticipantRoute from "./ParticipantRoute";
import DashboardRouter from "./DashboardRouter";
import Analytics from "../pages/DashboardPages/Participant/Analytics";
import ParticipantProfile from "../pages/DashboardPages/Participant/ParticipantProfile";
import PaymentHistory from "../pages/DashboardPages/Participant/PaymentHistory";
import OrganizerProfile from "../pages/DashboardPages/Organizer/OrganizerProfile";
import SuccessStories from "../pages/LandingPages/SuccessStories/SuccessStories";
import AboutUs from "../pages/LandingPages/AboutUs/AboutUs";
import BlogDetails from "../pages/LandingPages/Blogs/BlogDetails";
import FAQs from "../pages/LandingPages/FAQs/FAQs";
import Docs from "../pages/LandingPages/Docs/Docs";
import PPolicy from "../pages/LandingPages/PPolicy/PPolicy";
import TermsOfService from "../pages/LandingPages/TermsOfService/TermsOfService";
import ContactUs from "../pages/LandingPages/ContactUs/ContactUs";
import RegisteredCamps from "../pages/DashboardPages/Participant/RegisteredCamps/RegisteredCamps";
import FeedbackPage from "../pages/LandingPages/FeedbackPage/FeedbackPage";
import PublicOnly from "./PublicOnly";
import Blogs from "../pages/LandingPages/Blogs/Blogs";

export const router = createBrowserRouter([
  // Public routes
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
      { path: "success-stories", Component: SuccessStories },
      { path: "about", Component: AboutUs },
      { path: "blogs", Component: Blogs },
      { path: "blogs/:_id", Component: BlogDetails },
      { path: "faqs", Component: FAQs },
      { path: "docs", Component: Docs },
      { path: "pPolicy", Component: PPolicy },
      { path: "terms", Component: TermsOfService },
      { path: "contact", Component: ContactUs },
      { path: "camp-details/:campId", Component: CampDetails },
      { path: "feedback", Component: FeedbackPage },
    ],
  },

  // Authentication routes
  {
    path: "/",
    element: (
      <PublicOnly>
        <AuthLayout />
      </PublicOnly>
    ),
    errorElement: <NotFound />,
    children: [
      { path: "login", Component: Login },
      { path: "register", Component: Register },
    ],
  },

  // Dashboard routes
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
        path: "organizer-profile",
        element: (
          <OrganizerRoute>
            <OrganizerProfile />
          </OrganizerRoute>
        ),
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
        path: "analytics",
        element: (
          <ParticipantRoute>
            <Analytics />
          </ParticipantRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ParticipantRoute>
            <ParticipantProfile />
          </ParticipantRoute>
        ),
      },
      {
        path: "registered-camps",
        element: (
          <ParticipantRoute>
            <RegisteredCamps />
          </ParticipantRoute>
        ),
      },
      {
        path: "payment-history",
        element: (
          <ParticipantRoute>
            <PaymentHistory />
          </ParticipantRoute>
        ),
      },
    ],
  },
]);
