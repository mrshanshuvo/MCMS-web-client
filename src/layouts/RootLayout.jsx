import React from "react";
import Navbar from "../pages/Shared/Navbar/Navbar";
import { Outlet } from "react-router";
import Footer from "../pages/Shared/Footer/Footer";

const RootLayout = () => {
  return (
    <div>
      <header>
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
