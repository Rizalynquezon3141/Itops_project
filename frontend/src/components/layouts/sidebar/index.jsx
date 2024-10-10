import { useEffect, useState } from "react";
import { useRef } from "react";
import SubMenu from "./SubMenu"; // SubMenu component for expandable menus
import { motion } from "framer-motion"; // Framer Motion for animation
import Logout from "../../portal/Logout";
import { useAuth } from "../../../AuthProvider";
import { useNavigate } from "react-router-dom";
import logo from "../../..//images/itopslogoicon.png";
import ConfirmLogoutModal from "../../Modal/ConfirmLogoutModal";

// * React icons
import { IoIosArrowBack } from "react-icons/io"; // Arrow icon for collapsing sidebar
import { SlSettings } from "react-icons/sl"; // Settings icon
import { AiOutlineAppstore } from "react-icons/ai"; // Appstore icon for 'All Apps'
import { MdChecklist } from "react-icons/md";
import { HiOutlineDatabase } from "react-icons/hi"; // Database icon for 'Storage'
import { AiOutlineCalendar } from "react-icons/ai";
import { useMediaQuery } from "react-responsive"; // Media query hook to handle responsiveness
import { MdMenu } from "react-icons/md"; // Hamburger menu icon for small screens
import { NavLink, useLocation } from "react-router-dom"; // Routing for navigation links

const Sidebar = () => {
  // Media query to check if the screen width is less than 768px (tablet mid-size)
  let isTabletMid = useMediaQuery({ query: "(max-width: 768px)" });

  // State to manage whether the sidebar is open or closed
  const [open, setOpen] = useState(isTabletMid ? false : true);
  const [isModalOpen, setModalOpen] = useState(false); // State for controlling the logout modal

  // Ref to reference the sidebar element for DOM manipulation if needed
  const sidebarRef = useRef();

  // Hook to get the current location (pathname) for controlling sidebar visibility
  const { pathname } = useLocation();

  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Logout confirmation modal handlers
  const handleLogoutClick = () => setModalOpen(true); // Show modal when clicked
  const handleConfirmLogout = () => {
    setModalOpen(false); // Close modal after confirmation
    logout(); // Call logout function from context
    navigate("/login"); // Redirect to login page
  };
  const handleCancelLogout = () => setModalOpen(false); // Close modal without logging out

  useEffect(() => {
    const handlePopState = () => {
      if (isAuthenticated) {
        logout();
        navigate("/login"); // Redirect to login page
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isAuthenticated, logout, navigate]);

  // Effect to handle sidebar open/close based on screen size (tablet or larger)
  useEffect(() => {
    if (isTabletMid) {
      setOpen(false); // Close sidebar on small screens
    } else {
      setOpen(true); // Keep sidebar open on larger screens
    }
  }, [isTabletMid]);

  // Effect to close the sidebar when navigating to a different route (only for small screens)
  useEffect(() => {
    isTabletMid && setOpen(false); // Close sidebar on route change for small screens
  }, [pathname]);

  // Animation object to control how the sidebar opens and closes (different for small screens and larger screens)
  const Nav_animation = isTabletMid
    ? {
        open: {
          x: 0, // Sidebar slides in from the left
          width: "20rem",
          transition: {
            damping: 40, // Controls the speed of the animation
          },
        },
        closed: {
          x: -250, // Sidebar slides out to the left
          width: 0,
          transition: {
            damping: 40,
            delay: 0.15, // Adds a small delay before closing
          },
        },
      }
    : {
        open: {
          width: "20rem", // Sidebar is fully expanded
          transition: {
            damping: 40,
          },
        },
        closed: {
          width: "4rem", // Sidebar is minimized (showing only icons)
          transition: {
            damping: 40,
          },
        },
      };

  // List of submenu items with names and icons
  const subMenusList = [
    {
      name: "databases", // 'Databases' section
      icon: HiOutlineDatabase, // Icon for 'Databases'
      menus: ["Mysql", "Microsoft", "Oracle"], // Submenu items
    },
  ];

  return (
    <div>
      {/* Overlay for small screens to close sidebar when clicking outside */}
      <div
        onClick={() => setOpen(false)}
        className={`md:hidden fixed inset-0 max-h-screen z-[998] bg-black/50 ${
          open ? "block" : "hidden"
        } `}
      ></div>

      {/* Sidebar container with motion for animation */}
      <motion.div
        ref={sidebarRef} // Reference to the sidebar element
        variants={Nav_animation} // Animation variants
        initial={{ x: isTabletMid ? -250 : 0 }} // Initial position based on screen size
        animate={open ? "open" : "closed"} // Animation state
        className="bg-[#333333] text-gray shadow-xl z-[999] max-w-[20rem] w-[20rem] 
           overflow-hidden md:relative fixed h-screen"
      >
        {/* Sidebar header with logo and title */}
        <div className="flex items-center font-medium border-b py-3 border-gray-600">
          <img
            src={logo} // Logo image
            width={100}
            alt=""
          />
          <span className="text-xl whitespace-pre font-bold text-white">
            IT Operations
          </span>{" "}
          {/* Sidebar title */}
        </div>

        {/* Sidebar navigation */}
        <div className="flex flex-col  h-full">
          {/* Navigation links */}
          <ul className="whitespace-pre px-2.5 text-[0.9rem] py-5 flex flex-col gap-1  font-medium overflow-x-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-100   md:h-[68%] h-[70%]">
            <li>
              <NavLink
                to={"/"}
                className="link text-neutral-400 hover:text-white"
              >
                {" "}
                {/* Link to All Apps */}
                <AiOutlineAppstore size={23} className="min-w-max " />{" "}
                {/* All Apps icon */}
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/eod"}
                className="link text-neutral-400 hover:text-white"
              >
                {" "}
                {/* Link to Authentication */}
                <AiOutlineCalendar size={23} className="min-w-max" />{" "}
                {/* Authentication icon */}
                End of Day Logs
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/dailychecklist"}
                className="link text-neutral-400 hover:text-white"
              >
                {" "}
                {/* Link to Storage */}
                <MdChecklist size={23} className="min-w-max" />{" "}
                {/* Storage icon */}
                Daily Checklists
              </NavLink>
            </li>

            {/* Submenus for categories (only show when sidebar is open or on small screens) */}
            {(open || isTabletMid) && (
              <div className="border-y py-5 border-gray-600 ">
                <small className="pl-3 text-white inline-block mb-2">
                  Database
                </small>
                {subMenusList?.map((menu) => (
                  <div
                    key={menu.name}
                    className="flex flex-col gap-1 text-neutral-400 cursor-pointer hover:text-white"
                  >
                    <SubMenu data={menu} />{" "}
                    {/* Render SubMenu component with submenu data */}
                  </div>
                ))}
              </div>
            )}
            <li>
              <NavLink
                to={"/settings"}
                className="link text-neutral-400  hover:text-white"
              >
                {" "}
                {/* Link to Settings */}
                <SlSettings size={23} className="min-w-max" />{" "}
                {/* Settings icon */}
                Settings
              </NavLink>
            </li>
          </ul>

          {/* Account information and upgrade option (only shown when sidebar is open) */}
          {open && (
            <div className="flex-1 text-sm z-50  max-h-48 my-auto  whitespace-pre   w-full  font-medium  ">
              <div className="flex border-y border-slate-300 p-4 items-center justify-between">
                <div className="text-white">
                  <p>Rizalyn Quezon</p> {/* Account type */}
                  <small>Database Department</small> {/* Account price */}
                </div>
                <div
                  className="text-white py-1.5 px-3 text-xs bg-[#572929] hover:bg-[#961919] rounded-xl cursor-pointer"
                  onClick={handleLogoutClick} // Click to open modal
                >
                  Logout
                </div>
              </div>
              {/* Logout confirmation modal */}
              <ConfirmLogoutModal
                isOpen={isModalOpen}
                onClose={handleCancelLogout}
                onConfirm={handleConfirmLogout}
              />
            </div>
          )}
        </div>

        {/* Arrow icon to collapse/expand the sidebar */}
        <motion.div
          onClick={() => {
            setOpen(!open); // Toggle sidebar open/closed
          }}
          animate={
            open
              ? {
                  x: 0,
                  y: 0,
                  rotate: 0, // Normal position when open
                }
              : {
                  x: -5,
                  y: -50,
                  rotate: 180, // Rotated and moved when closed
                }
          }
          transition={{ duration: 0 }}
          className="absolute w-fit h-fit md:block z-50 hidden right-1 bottom-5 cursor-pointer"
        >
          <div className=" bg-[#572929] hover:bg-[#961919] rounded-full p-2 text-white">
            <IoIosArrowBack size={25} /> {/* Arrow icon */}
          </div>
        </motion.div>
      </motion.div>

      {/* Hamburger menu icon for small screens (shows when sidebar is closed) */}
      <div
        className="m-3 md:hidden bg-[#572929] hover:bg-[#961919] rounded-full p-2  "
        onClick={() => setOpen(true)}
      >
        <MdMenu size={25} className="text-white cursor-pointer" />{" "}
        {/* Menu icon */}
      </div>
    </div>
  );
};

export default Sidebar;
