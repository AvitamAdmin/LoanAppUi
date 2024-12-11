// import { api } from "@/envfile/api";
// import { TextField } from "@mui/material";
// import { getCookie } from "cookies-next";
// import React, { useEffect, useState } from "react";
// import axios from 'axios';

// const TestLocatorGroupDropdown = ({ setSelectedTestLocatorGroup, selectedTestLocatorGroup }) => {
//   console.log(selectedTestLocatorGroup, "selectedTestLocatorGroup from the dropdown");

//   const [LocatorGroups, setLocatorGroups] = useState([]);

//   useEffect(() => {
//     const token = getCookie("jwtToken");
//     if (token) {
//       getTestLocatorGroupData(token); // Fetch node data once token is available
//     }
//   }, []);

//   const getTestLocatorGroupData = async (token) => {
//     try {
//       const headers = { Authorization: "Bearer " + token };
//       const response = await axios.get(api + "/admin/locatorGroup/get", {
//         headers,
//       });
//       setLocatorGroups(response.data.testLocatorGroups); // Update the local node list state
//       console.log("data" + response.data.testLocatorGroups);
//     } catch (error) {
//       console.log(error, "Error fetching nodes");
//     }
//   };

//   const handleTestLocatorGroupChange = (value) => {
//     setSelectedTestLocatorGroup(value); // Capture selected node
//   };

//   return (
//     <div>
//       <TextField
//         className="text-xs w-full"
//         style={{ marginTop: "2.5vh" }}
//         select
//         value={selectedTestLocatorGroup}
//         SelectProps={{
//           native: true,
//         }}
//         variant="standard"
//         onChange={(e) => handleTestLocatorGroupChange(e.target.value)}
//       >
//         <option value="">Select Test Group</option>
//         {LocatorGroups.map((option) => (
//           <option key={option.recordId} value={option.recordId}>
//             {option.identifier}
//           </option>
//         ))}
//       </TextField>
//     </div>
//   );
// };

// export default TestLocatorGroupDropdown;






import { api } from "@/envfile/api";
import { Autocomplete, TextField } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import axios from "axios";

const TestLocatorGroupDropdown = ({
  setSelectedTestLocatorGroup,
  selectedTestLocatorGroup,
  initialload = false, // Add initialload prop
  dropdownName = "Select Test Group", // Add dropdownName prop
}) => {
  console.log("selectedTestLocatorGroup Locator Groups:", selectedTestLocatorGroup);

  const [locatorGroups, setLocatorGroups] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  // Helper function to normalize the selected value
  const getSelectedValue = () => {
    return Array.isArray(selectedTestLocatorGroup) 
      ? selectedTestLocatorGroup[0] 
      : selectedTestLocatorGroup;
  };

  // Fetch locator group data from API
  const getTestLocatorGroupData = async (token) => {
    try {
      setLoading(true); // Set loading before fetching
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(api + "/admin/locatorGroup/get", { headers });
      setLocatorGroups(response.data.testLocatorGroups || []); // Update state with fetched data
      console.log("Fetched Locator Groups:", response.data.testLocatorGroups);
    } catch (error) {
      console.log(error, "Error fetching locator groups");
    } finally {
      setLoading(false); // Stop loading after fetching
    }
  };

  // Fetch data on mount if initialload is true
  useEffect(() => {
    if (initialload) {
      const token = getCookie("jwtToken");
      if (token) getTestLocatorGroupData(token);
    }
  }, [initialload]);

  // Handle dropdown open event to fetch data lazily
  const handleDropdownOpen = () => {
    if (!initialload && locatorGroups.length === 0) {
      const token = getCookie("jwtToken");
      if (token) getTestLocatorGroupData(token); // Fetch only if the dropdown opens and data is empty
    }
  };

  // Handle change event when a group is selected
  const handleTestLocatorGroupChange = (newValue) => {
    setSelectedTestLocatorGroup(newValue ? newValue.recordId : ""); // Update selected value
    console.log("Selected Test Locator Group:", newValue);
  };

  return (
    <div>
      <Autocomplete
        className="text-xs w-full"
        style={{ marginTop: "2.5vh" }}
        options={locatorGroups} // List of locator groups
        getOptionLabel={(option) => option?.identifier || ""} // Display identifier
        value={
          locatorGroups.find(
            (option) => option.recordId === getSelectedValue() // Use normalized value for matching
          ) || null
        } // Match based on recordId from the API
        onChange={(event, newValue) => handleTestLocatorGroupChange(newValue)}
        onOpen={handleDropdownOpen} // Fetch data when opened
        loading={loading} // Show loading state
        isOptionEqualToValue={(option, value) => option.recordId === value?.recordId} // Ensure proper matching
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder={dropdownName} // Use dropdownName as placeholder
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <span>Loading...</span> : null}
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

export default TestLocatorGroupDropdown;
