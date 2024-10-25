import { useState } from "react";

import {
  Header,
  Table,
  TopArea,
  databases,
} from "../MiniComponent/MysqlComponents";
function Mysql() {
  return (
    <>
      <div className="sm:px-3 w-full">
        <div className="mb-4">
          <TopArea />
        </div>
        <div className="min-h-screen  text-white p-4 ">
          <Header />
          <Table data={databases} />
        </div>
      </div>
    </>
  );
}

export default Mysql;
