import React from "react";
import { Link } from "react-router-dom";

function TopArea() {
  return (
    <div>
      <div className="flex items-center justify-between text-neutral-400">
        <p className="focus:outline-none text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal">
          Oracle Cloud Infrastructure
        </p>
        <div class="py-3 px-4 flex items-center text-sm font-medium leading-none">
          <p>
            <span className="cursor-pointer">
              {" "}
              <Link to="/dashboard">DBAdministration</Link>
            </span>{" "}
            &gt; <span className="text-neutral-500">Databases</span> &gt;{" "}
            <span className="text-neutral-600">Oracle MySQL</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default TopArea;
