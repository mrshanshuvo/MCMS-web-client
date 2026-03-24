import Navbar from "../pages/Shared/Navbar/Navbar";
import { Outlet } from "react-router";
import Footer from "../pages/Shared/Footer/Footer";
import ScrollToTop from "../components/ScrollToTop";

const RootLayout = () => {
  return (
    <div>
      <ScrollToTop />
      <header className="sticky top-0 z-50">
        <Navbar></Navbar>
      </header>
      <main>
        <Outlet></Outlet>
      </main>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
};

export default RootLayout;
