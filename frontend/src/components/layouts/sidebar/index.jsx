import { useEffect, useState, useRef } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import SubMenu from "./SubMenu";
import ConfirmLogoutModal from "../../Modal/ConfirmLogoutModal";
import { useAuth } from "../../portal/AuthProvider";
import logo from "../../../images/itopslogoicon.png";
import { motion } from "framer-motion";
import { IoIosArrowBack } from "react-icons/io";
import { SlSettings } from "react-icons/sl";
import { AiOutlineAppstore, AiOutlineCalendar } from "react-icons/ai";
import { MdChecklist, MdMenu } from "react-icons/md";
import { HiOutlineDatabase } from "react-icons/hi";

const Sidebar = () => {
  const isTabletMid = useMediaQuery({
    query: "(min-width: 769px) and (max-width: 1800px)",
  });
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [fullName, setFullName] = useState("");
  const [designation, setDesignation] = useState("");
  const [open, setOpen] = useState(!isMobile);
  const [isModalOpen, setModalOpen] = useState(false);
  const sidebarRef = useRef();
  const { pathname } = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const firstname = localStorage.getItem("firstname");
    const lastname = localStorage.getItem("lastname");
    const storedDesignation = localStorage.getItem("designation");
    setFullName(`${firstname || ""} ${lastname || ""}`);
    setDesignation(storedDesignation || "");
  }, []);

  const handleLogoutClick = () => setModalOpen(true);
  const handleConfirmLogout = () => {
    setModalOpen(false);
    logout();
    navigate("/login");
  };
  const handleCancelLogout = () => setModalOpen(false);

  useEffect(() => {
    const handlePopState = () => {
      if (isAuthenticated) {
        logout();
        navigate("/login");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isAuthenticated, logout, navigate]);

  useEffect(() => {
    setOpen(!isMobile && !isTabletMid);
  }, [isMobile, isTabletMid]);

  useEffect(() => {
    if (isMobile) setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        open &&
        !isModalOpen // Prevent closing when the modal is open
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, isModalOpen]);

  const Nav_animation = isMobile
    ? {
        open: { x: 0, width: "20rem", transition: { damping: 40 } },
        closed: { x: -250, width: 0, transition: { damping: 40, delay: 0.15 } },
      }
    : {
        open: { width: "20rem", transition: { damping: 40 } },
        closed: { width: "4rem", transition: { damping: 40 } },
      };

  const subMenusList = [
    {
      name: "databases",
      icon: HiOutlineDatabase,
      menus: ["Mysql", "Microsoft", "Oracle"],
    },
  ];

  return (
    <div>
      <div
        onClick={() => setOpen(false)}
        className={`md:hidden fixed inset-0 max-h-screen z-[998] bg-black/50 ${
          open ? "block" : "hidden"
        }`}
      ></div>

      <motion.div
        ref={sidebarRef}
        variants={Nav_animation}
        initial={{ x: isMobile ? -250 : 0 }}
        animate={open ? "open" : "closed"}
        className="bg-[#333333] text-gray shadow-xl z-[999] max-w-[16rem] w-[16rem] overflow-hidden md:relative fixed h-screen"
      >
        <div className="flex items-center font-medium border-b py-3 border-gray-600">
          <img src={logo} width={100} alt="IT Operations Logo" />
          <span className="text-lg whitespace-pre font-bold text-white">
            IT Operations
          </span>
        </div>

        <div className="flex flex-col h-full">
          <ul className="whitespace-pre px-2.5 text-[0.9rem] py-5 flex flex-col gap-1 font-medium overflow-x-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-100 md:h-[68%] h-[70%]">
            <li>
              <NavLink
                to="/dashboard"
                className="link text-neutral-400 hover:text-white text-xs"
              >
                <AiOutlineAppstore size={20} className="min-w-max" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/eod"
                className="link text-neutral-400 hover:text-white text-xs"
              >
                <AiOutlineCalendar size={20} className="min-w-max" />
                End of Day Logs
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dailychecklist"
                className="link text-neutral-400 hover:text-white text-xs"
              >
                <MdChecklist size={20} className="min-w-max" />
                Daily Checklists
              </NavLink>
            </li>

            {(open || isMobile) && (
              <div className="border-y py-5 border-gray-600">
                <small className="pl-3 text-white inline-block mb-2 text-xs">
                  Database
                </small>
                {subMenusList.map((menu) => (
                  <div
                    key={menu.name}
                    className="flex flex-col gap-1 text-neutral-400 cursor-pointer hover:text-white text-xs"
                  >
                    <SubMenu data={menu} />
                  </div>
                ))}
              </div>
            )}
            <li>
              <NavLink
                to="/settings"
                className="link text-neutral-400 hover:text-white text-xs"
              >
                <SlSettings size={20} className="min-w-max" />
                Settings
              </NavLink>
            </li>
          </ul>

          {open && (
            <div className="flex-1 text-sm z-50 max-h-48 my-auto whitespace-pre w-full font-medium">
              <div className="flex border-y border-slate-300 p-4 items-center justify-between">
                <div className="text-white">
                  <p>{fullName}</p>
                  <small>{designation}</small>
                </div>
                <div
                  className="text-white py-1.5 px-3 text-xs bg-[#572929] hover:bg-[#961919] rounded-xl cursor-pointer"
                  onClick={handleLogoutClick}
                >
                  Logout
                </div>
              </div>
              <ConfirmLogoutModal
                isOpen={isModalOpen}
                onClose={handleCancelLogout}
                onConfirm={handleConfirmLogout}
              />
            </div>
          )}
        </div>

        <motion.div
          onClick={() => setOpen(!open)}
          animate={
            open ? { x: 0, y: 0, rotate: 0 } : { x: -5, y: -50, rotate: 180 }
          }
          transition={{ duration: 0 }}
          className="absolute w-fit h-fit md:block z-50 hidden right-1 bottom-5 cursor-pointer"
        >
          <div className="bg-[#572929] hover:bg-[#961919] rounded-full p-2 text-white">
            <IoIosArrowBack size={23} />
          </div>
        </motion.div>
      </motion.div>

      <div
        className="m-3 md:hidden bg-[#572929] hover:bg-[#961919] rounded-full p-2"
        onClick={() => setOpen(true)}
      >
        <MdMenu size={23} className="text-white cursor-pointer" />
      </div>
    </div>
  );
};

export default Sidebar;
