import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import TopBar from './TopBar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-wrapper">
      <TopBar />
      <Header />

      <main className="main-content-area">{children}</main>

      <Footer />
    </div>
  );
};

export default Layout;
