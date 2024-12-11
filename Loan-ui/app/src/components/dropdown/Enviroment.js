import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { getCookie } from "cookies-next";
import { api } from "@/envfile/api";

function EnviromentDropdown({ selectedEnvironments, setSelectedEnviroment }) {
  const [enviroment, setEnviroment] = useState([]);


  useEffect(() => {
    const token = getCookie("jwtToken");
    if (token) {
        getAllSEnviroments(token); // Fetch node data once token is available
    }
  }, []);
  const getAllSEnviroments = async (token) => {
    try {
        const headers = { Authorization: "Bearer " + token };
        console.log(token,"token from enviroment");
      const response = await axios.get(api + "/admin/environment/get", {
        headers,
      });
      setEnviroment(response.data.environments);
      console.log(response.data.environments, "environments fetched");
    } catch (error) {
      console.log("Error fetching environments", error);
    }
  };

  return (
    <div className="w-full" style={{ marginTop: "0.7vh" }}>
      <Autocomplete
        multiple
        size="small"
        options={enviroment} 
        getOptionLabel={(option) => option.identifier} 
        value={
            enviroment.filter((sub) =>
                selectedEnvironments.some((sel) => sel.recordId === sub.recordId)
          ) || []
        } 
        onChange={(event, newValue) => {
          setSelectedEnviroment(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Select Enviroment" variant="standard" />
        )}
      />
    </div>
  );
}

export default EnviromentDropdown;
