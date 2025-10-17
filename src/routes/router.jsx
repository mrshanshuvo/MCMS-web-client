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
import OrganizerRoute from "./OrganizerRoute";
import PrivateRoute from "./PrivateRoute";
import ParticipantRoute from "./ParticipantRoute";
import DashboardRouter from "./DashboardRouter";
import Analytics from "../pages/Dashboard/Participant/Analytics";
import ParticipantProfile from "../pages/Dashboard/Participant/ParticipantProfile";
import PaymentHistory from "../pages/Dashboard/Participant/PaymentHistory";
import OrganizerProfile from "../pages/Dashboard/Organizer/OrganizerProfile";
import SuccessStories from "../pages/SuccessStories/SuccessStories";
import AboutUs from "../pages/AboutUs/AboutUs";
import Blog from "../pages/Blog/Blog";
import FAQs from "../pages/FAQs/FAQs";
import Docs from "../pages/Docs/Docs";
import PPolicy from "../pages/PPolicy/PPolicy";
import TermsOfService from "../pages/TermsOfService/TermsOfService";
import ContactUs from "../pages/ContactUs/ContactUs";
import RegisteredCamps from "../pages/Dashboard/Participant/RegisteredCamps/RegisteredCamps";
import FeedbackPage from "../pages/FeedbackPage/FeedbackPage";

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
      { path: "success-stories", Component: SuccessStories },
      { path: "about", Component: AboutUs },
      { path: "blog", Component: Blog },
      { path: "faqs", Component: FAQs },
      { path: "docs", Component: Docs },
      { path: "pPolicy", Component: PPolicy },
      { path: "terms", Component: TermsOfService },
      { path: "contact", Component: ContactUs },
      { path: "camp-details/:campId", Component: CampDetails },
      { path: "feedback", Component: FeedbackPage },
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
