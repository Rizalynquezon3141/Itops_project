import { useState } from "react"; 
import { motion } from "framer-motion"; 
import { IoIosArrowDown } from "react-icons/io"; 
import { NavLink, useLocation } from "react-router-dom"; 

// SubMenu component which renders a list with nested sub-menu items
const SubMenu = ({ data }) => {
  const { pathname } = useLocation(); // Get the current path location to apply active link styles
  const [subMenuOpen, setSubMenuOpen] = useState(false); // State to toggle sub-menu visibility

  return (
    <>
      {/* Parent menu item that toggles the sub-menu open/close */}
      <li
        className={`link ${pathname.includes(data.name) && "text-white"}`} // Highlight the parent menu if it's part of the current route
        onClick={() => setSubMenuOpen(!subMenuOpen)} // Toggle sub-menu visibility on click
      >
        {/* Display icon of the parent menu */}
        <data.icon size={23} className="min-w-max" />
        {/* Display the parent menu name */}
        <p className="flex-1 capitalize">{data.name}</p>
        {/* Down arrow icon to indicate the sub-menu state, rotates when the sub-menu is open */}
        <IoIosArrowDown
          className={` ${subMenuOpen && "rotate-180"} duration-200 `} // Rotate the arrow icon when sub-menu is open
        />
      </li>

      {/* Sub-menu items (child menu) which slide open/close based on the subMenuOpen state */}
      <motion.ul
        animate={
          subMenuOpen
            ? {
                height: "fit-content", // If the sub-menu is open, it adjusts to fit its content
              }
            : {
                height: 0, // If the sub-menu is closed, set height to 0 (hides it)
              }
        }
        className="flex h-0 flex-col pl-14 text-[0.8rem] font-normal overflow-hidden" // Overflow hidden ensures the sliding animation
      >
        {/* Map through the child menu items and create links */}
        {data.menus?.map((menu) => (
          <li key={menu}>
            {/* Each sub-menu item links to a nested route under the parent menu */}
            <NavLink
              to={`/${data.name}/${menu}`} // Dynamic path for each sub-menu item
              className="link !bg-transparent capitalize" // Style for sub-menu links
            >
              {menu} {/* Display sub-menu name */}
            </NavLink>
          </li>
        ))}
      </motion.ul>
    </>
  );
};

export default SubMenu;
