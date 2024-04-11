import React from "react";
import { useSelector } from "react-redux";
import { useAppContext } from "../../context/AppContext";
import { getIsOpenClientSelector } from "../../store/clientSlice";
import { getIsOpenProductSelector } from "../../store/productSlice";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Navbar/Sidebar";
import { useLocation } from "react-router-dom";

const defaultContainerClasses =
  "z-0 transform duration-200 lg:flex-grow";

function Container({ children }) {
  const { showNavbar, escapeOverflow } = useAppContext();
  const isOpenClientSelector = useSelector(getIsOpenClientSelector);
  const isOpenProductSelector = useSelector(getIsOpenProductSelector);
  const { pathname } = useLocation();

  return (
    <>
      {pathname === "/login" || pathname === "/sign-up" ? (
        <div
          className={
            "relative min-h-screen lg:flex " +
            (escapeOverflow ? "" : "  app-wraper ") +
            (isOpenClientSelector || isOpenProductSelector
              ? " fixed-body-scroll"
              : "")
          }
          style={{ padding: "inherit !important" }} // Apply inherit padding when on the login page
        >
          <Navbar />
          <Sidebar />
          <div
            className={
              showNavbar
                ? defaultContainerClasses + " ease-in"
                : defaultContainerClasses
            }
          >
            <div
              className={
                "container mx-auto " +
                (showNavbar
                  ? "scale-50 origin-top ease-in sm:origin-center sm:scale-100"
                  : "")
              }
            >
              {children}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={
            "relative min-h-screen lg:flex " +
            (escapeOverflow ? "" : "  app-wraper ") +
            (isOpenClientSelector || isOpenProductSelector
              ? " fixed-body-scroll"
              : "")
          }
        >
          <Navbar />
          <Sidebar />
          <div
            className={
              showNavbar
                ? defaultContainerClasses + " pl-72 ease-in pt-20"
                : defaultContainerClasses + " pt-20"
            }
          >
            <div
              className={
                "container mx-auto " +
                (showNavbar
                  ? "scale-50 origin-top ease-in sm:origin-center sm:scale-100"
                  : "")
              }
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Container;
