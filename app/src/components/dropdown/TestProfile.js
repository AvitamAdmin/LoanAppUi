import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { getCookie } from "cookies-next";
import { api } from "@/envfile/api";

function TestProfileDropdown({ selectedTestProfile, setSelectedTestProfile }) {
  const [testProfile, setTestProfile] = useState([]);


  useEffect(() => {
    const token = getCookie("jwtToken");
    if (token) {
        getAllTestProfile(token); // Fetch node data once token is available
    }
  }, []);
  const getAllTestProfile = async (token) => {
    try {
        const headers = { Authorization: "Bearer " + token };
        console.log(token,"token from testProfile");
      const response = await axios.get(api + "/admin/profile/get", {
        headers,
      });
      setTestProfile(response.data.testProfiles);
      console.log(response.data.testProfiles, "environments fetched");
    } catch (error) {
      console.log("Error fetching environments", error);
    }
  };

  return (
    <div className="w-full" style={{ marginTop: "0.7vh" }}>
      <Autocomplete
        multiple
        size="small"
        options={testProfile} 
        getOptionLabel={(option) => option.identifier} 
        value={
            testProfile.filter((sub) =>
                selectedTestProfile.some((sel) => sel.recordId === sub.recordId)
          ) || []
        } 
        onChange={(event, newValue) => {
          setSelectedTestProfile(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Select testProfile" variant="standard" />
        )}
      />
    </div>
  );
}

export default TestProfileDropdown;
