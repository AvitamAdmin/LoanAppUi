// import { api } from "@/envfile/api";
// import { Autocomplete, TextField } from "@mui/material";
// import { getCookie } from "cookies-next";
// import React, { useEffect, useState } from "react";
// import axios from 'axios';

// const Dashboard = ({ selectedDashboard, setSelectedDashboard }) => {
//   const [dashboardList, setDashboardList] = useState([]); // Local state to manage node data

//   useEffect(() => {
//     const token = getCookie("jwtToken");
//     if (token) {
//       getDashboardData(token); // Fetch node data once token is available
//     }
//   }, []);

//   const getDashboardData = async (token) => {
//     try {
//       const headers = { Authorization: "Bearer " + token };
//       const response = await axios.get(api + "/admin/dashboard/get", {
//         headers,
//       });
//       setDashboardList(response.data.dashboards); // Update the local node list state
//     } catch (error) {
//       console.log(error, "Error fetching nodes");
//     }
//   };

//   const handleDashboardChange = (value) => {
//     setSelectedDashboard(value); // Capture selected node
//   };

//   return (
//     <div>
//       <Autocomplete
//   size="small"
//   options={dashboardList} // List of all dashboards
//   getOptionLabel={(option) => option?.identifier || ''} // Safely access the 'identifier' field
//   value={dashboardList.find((dashboard) => dashboard.recordId === selectedDashboard) || null} // Use find for single selection
//   onChange={(event, newValue) => {
//     if (newValue) {
//       handleDashboardChange(newValue.recordId); // Update the selected dashboard by its recordId
//     } else {
//       handleDashboardChange(''); // Clear selection if no value is selected
//     }
//   }}
//   renderInput={(params) => (
//     <TextField
//       {...params}
//       label="Select Dashboard"
//       variant="standard"
//     />
//   )}
// />

//     </div>
//   );
// };

// export default Dashboard;



import { api } from "@/envfile/api";
import { Autocomplete, TextField } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import axios from 'axios';

const Dashboard = ({
  selectedDashboard, 
  setSelectedDashboard, 
  initialLoad = false, 
  dropdownName = "Select Dashboard"
}) => {
  const [dashboardList, setDashboardList] = useState([]); // Manage dashboard data
  const [loading, setLoading] = useState(false); // Track loading state
  const [isFetched, setIsFetched] = useState(false); // Ensure data is fetched only once

  useEffect(() => {
    if (initialLoad) {
      fetchDashboardData(); // Fetch data on initial load if required
    }
  }, [initialLoad]);

  const fetchDashboardData = async () => {
    const token = getCookie("jwtToken");
    if (!token) return;

    setLoading(true); // Show loading indicator
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${api}/admin/dashboard/get`, { headers });
      setDashboardList(response.data.dashboards); // Populate dashboard list
      setIsFetched(true); // Mark data as fetched
    } catch (error) {
      console.error("Error fetching dashboards", error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const handleDashboardChange = (value) => {
    setSelectedDashboard(value); // Capture the selected dashboard
  };

  const handleDropdownOpen = () => {
    if (!isFetched) fetchDashboardData(); // Fetch data only if not already fetched
  };

  return (
    <div>
      <Autocomplete
        size="small"
        options={dashboardList} // List of all dashboards
        loading={loading} // Show loading state
        onOpen={handleDropdownOpen} // Trigger fetching on open
        getOptionLabel={(option) => option?.identifier || ""} // Safely access 'identifier'
        value={dashboardList.find((dashboard) => dashboard.recordId === selectedDashboard) || null} // Match by recordId
        onChange={(event, newValue) => {
          handleDashboardChange(newValue ? newValue.recordId : ""); // Update or clear selection
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={dropdownName} // Customize placeholder/label
            variant="standard"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <span>Loading...</span> : null} {/* Loading indicator */}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </div>
  );
};

export default Dashboard;
