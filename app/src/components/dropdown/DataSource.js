import { api } from "@/envfile/api";
import { TextField } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import axios from 'axios';

const DataSource = ({ setDataSource, dataSource }) => {
  const [dataSourceList, setDataSourceList] = useState([]); // Local state to manage node data
  const [selectedDataSource, setSelectedDataSource] = useState(""); // For capturing selected node

  useEffect(() => {
    const token = getCookie("jwtToken");
    if (token) {
      getDataSourceData(token); // Fetch node data once token is available
    }
  }, []);

  const getDataSourceData = async (token) => {
    try {
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(api + "/admin/datasource/get", {
        headers,
      });
      setDataSourceList(response.data.dataSources); // Update the local node list state
      console.log(response.data.dataSources);
    } catch (error) {
      console.log(error, "Error fetching nodes");
    }
  };

  const handleNodeChange = (value) => {
    setSelectedDataSource(value); // Capture selected node
    setDataSource(value); // Pass selected node to parent via setNodes
  };

  return (
    <div>
      <TextField
        className="text-xs w-full"
        style={{ marginTop: "2.5vh" }}
        select
        value={selectedDataSource}
        SelectProps={{
          native: true,
        }}
        variant="standard"
        onChange={(e) => handleNodeChange(e.target.value)}
      >
        <option value="">Select DataSource</option>
        {dataSourceList.map((option) => (
          <option key={option.recordId} value={option.recordId}>
            {option.identifier}
          </option>
        ))}
      </TextField>
    </div>
  );
};

export default DataSource;
