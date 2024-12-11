// import { api } from "@/envfile/api";
// import { TextField } from "@mui/material";
// import { getCookie } from "cookies-next";
// import React, { useEffect, useState } from "react";
// import axios from 'axios';

// const DashboardProfile = ({ selectedDashboardProfile, setSelectedDashboardProfile }) => {
//   const [dashboardProfileList, setDashboardProfileList] = useState([]); // Local state to manage node data
//   const [dashboardProfile, setDashboardProfile] = useState(""); // For capturing selected node

//   useEffect(() => {
//     const token = getCookie("jwtToken");
//     if (token) {
//       getDashboardProfileData(token); // Fetch node data once token is available
//     }
//   }, []);

//   const getDashboardProfileData = async (token) => {
//     try {
//       const headers = { Authorization: "Bearer " + token };
//       const response = await axios.get(api + "/admin/dashboardProfile/get", {
//         headers,
//       });
//       setDashboardProfileList(response.data.dashboardProfiles); // Update the local node list state
//     } catch (error) {
//       console.log(error, "Error fetching DashboardProfile");
//     }
//   };

//   const handleDashboardProfileChange = (value) => {
//     setSelectedDashboardProfile(value); // Capture selected node
//     setDashboardProfile(value); // Pass selected node to parent via setNodes
//   };

//   return (
//     <div>
//       <TextField
//         className="text-xs w-full"
//         style={{ marginTop: "2.5vh" }}
//         select
//         value={selectedDashboardProfile}
//         SelectProps={{
//           native: true,
//         }}
//         variant="standard"
//         onChange={(e) => handleDashboardProfileChange(e.target.value)}
//       >
//         <option value="">Select DashboardProfile</option>
//         {dashboardProfileList.map((option) => (
//           <option key={option.recordId} value={option.recordId}>
//             {option.identifier}
//           </option>
//         ))}
//       </TextField>
//     </div>
//   );
// };

// export default DashboardProfile;



import { api } from "@/envfile/api";
import { Autocomplete, TextField } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import axios from "axios";

const DashboardProfile = ({
  selectedDashboardProfile,
  setSelectedDashboardProfile,
  dropdownName = "Select Dashboard Profile", // Default label for dropdown
  initialLoad = false, // Whether data should load on mount
}) => {
  const [dashboardProfileList, setDashboardProfileList] = useState([]); // Manage dashboard profiles
  const [isFetched, setIsFetched] = useState(false); // Track if data is fetched

  // Conditionally fetch data on mount based on initialLoad
  useEffect(() => {
    if (initialLoad) {
      const token = getCookie("jwtToken");
      if (token) getDashboardProfileData(token);
    }
  }, [initialLoad]);

  // Fetch dashboard profiles from the API
  const getDashboardProfileData = async (token) => {
    try {
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(api + "/admin/dashboardProfile/get", {
        headers,
      });
      setDashboardProfileList(response.data.dashboardProfiles); 
      setIsFetched(true); // Mark data as fetched
    } catch (error) {
      console.error("Error fetching DashboardProfile:", error);
    }
  };

  // Handle dropdown opening (fetch data only if not fetched yet)
  const handleDropdownOpen = () => {
    if (!isFetched) {
      const token = getCookie("jwtToken");
      if (token) getDashboardProfileData(token);
    }
  };

  // Handle dashboard profile change
  const handleDashboardProfileChange = (event, newValue) => {
    setSelectedDashboardProfile(newValue?.recordId || ""); // Set recordId or clear
  };

  return (
    <div>
      <Autocomplete
        size="small"
        openOnFocus
        options={dashboardProfileList}
        getOptionLabel={(option) => option.identifier || ""} // Safely handle missing identifiers
        value={
          dashboardProfileList.find(
            (profile) => profile.recordId === selectedDashboardProfile
          ) || null
        } // Set the current value
        onChange={handleDashboardProfileChange} // Handle selection changes
        onOpen={handleDropdownOpen} // Trigger data fetch when dropdown opens
        renderInput={(params) => (
          <TextField
            {...params}
            label={dropdownName} // Use dynamic label
            variant="standard"
            className="text-xs w-full"
            style={{ marginTop: "2.5vh" }}
          />
        )}
      />
    </div>
  );
};

export default DashboardProfile;
