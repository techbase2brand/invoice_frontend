import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../../context/AppContext";
import InvoiceNavbarLoading from "../Loading/InvoiceNavbarLoading";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar() {
  const { toggleNavbar, showNavbar } = useAppContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const classes = useMemo(() => {
    const defaultClasses =
      "bg-white flex items-center pr-3 z-12 fixed w-full z-10 border-b border-slate-50 transition-all";

    if (!showNavbar) {
      return defaultClasses + " pl-3 ";
    }
    return defaultClasses + " pl-72 ";
  }, [showNavbar]);

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    localStorage.removeItem("token");
    navigate("/login")
    toast.success("Logout Successfully", {
      position: "bottom-center",
      autoClose: 2000,
    });
  }

  if (pathname === "/login" || pathname === "/sign-up") {
    return null;
  } else {
    return (
      <header className={classes}>
        <motion.button
          className="p-2 focus:outline-none rounded-md"
          onClick={toggleNavbar}
          initial={{
            translateX: 0,
          }}
          animate={{
            color: showNavbar ? "#777" : "#0066FF",
            rotate: showNavbar ? "360deg" : "180deg",
          }}
          transition={{
            type: "spring",
            damping: 25,
          }}
        >
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={showNavbar ? "M15 19l-7-7 7-7" : "M4 6h16M4 12h16M4 18h7"}
            />
          </svg> */}
          <svg xmlns="http://www.w3.org/2000/svg"  className="h-6 w-6 text-red-500" viewBox="0 0 16 16" fill="none">
          <g fill="#ff0000">
          <path d="M11.726 5.263a.7.7 0 10-.952-1.026l-3.5 3.25a.7.7 0 000 1.026l3.5 3.25a.7.7 0 00.952-1.026L8.78 8l2.947-2.737z"/>
          <path fill-rule="evenodd" d="M1 3.25A2.25 2.25 0 013.25 1h9.5A2.25 2.25 0 0115 3.25v9.5A2.25 2.25 0 0112.75 15h-9.5A2.25 2.25 0 011 12.75v-9.5zm2.25-.75a.75.75 0 00-.75.75v9.5c0 .414.336.75.75.75h1.3v-11h-1.3zm9.5 11h-6.8v-11h6.8a.75.75 0 01.75.75v9.5a.75.75 0 01-.75.75z" clip-rule="evenodd"/>
          </g>
        </svg>
        </motion.button>

        <div
          className="block flex-1 text-2xl sm:text-3xl font-bold p-4 relative justify-center items-center"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
        >
          <div style={{ float: 'right' }} onClick={handleLogout}>
            <svg class="h-8 w-8 text-red-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />  <path d="M7 12h14l-3 -3m0 6l3 -3" /></svg>
          </div>
        </div>
      </header>
    )
  }
}

export default Navbar;
