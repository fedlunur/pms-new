// TodoList.js

import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import useAxios from "../utils/useAxios";
import DataTableActivityList from "./DataTableActivityList";

function ActivityList() {
  return (
    <div className="container-fluid" style={{ paddingTop: 100 }}>
      <DataTableActivityList />
    </div>
  );
}

export default ActivityList;
