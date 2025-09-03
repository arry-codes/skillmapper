import { Outlet } from "react-router-dom";
import React from 'react'
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <>
    <div className="min-h-screen">
    <Navbar/>
    <Outlet/>
    <Footer/>
    </div>
    </>
  )
}

export default Layout