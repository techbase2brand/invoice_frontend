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
            rotate: showNavbar ? "360deg" : "0deg",
          }}
          transition={{
            type: "spring",
            damping: 25,
          }}
        >
          <svg
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
