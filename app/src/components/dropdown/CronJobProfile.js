// import { api } from "@/envfile/api";
// import { Autocomplete, TextField } from "@mui/material";
// import { getCookie } from "cookies-next";
// import React, { useEffect, useState } from "react";
// import axios from 'axios';

// const CronJobProfile = ({ setSelectedCronJobProfile, selectedCronJobProfile}) => {
//   const [cronJobProfileList, setCronJobProfileList] = useState([]); // Local state to manage node data
  

//   useEffect(() => {
//     const token = getCookie("jwtToken");
//     if (token) {
//       getCronJobProfileData(token); // Fetch node data once token is available
//     }
//   }, []);

//   const getCronJobProfileData = async (token) => {
//     try {
//       const headers = { Authorization: "Bearer " + token };
//       const response = await axios.get(api + "/admin/cronjobProfile/get", {
//         headers,
//       });
//       setCronJobProfileList(response.data.cronJobProfiles); // Update the local node list state
//       console.log(response.data.cronJobProfiles);
//     } catch (error) {
//       console.log(error, "Error fetching nodes");
//     }
//   };

//   const handleCronJobProfileChange = (value) => {
//     setSelectedCronJobProfile(value); // Capture selected node
    
//   };

//   return (
//     <div>
//       <Autocomplete
//   size="small"
//   options={cronJobProfileList} // Use the cronJobProfileList as the options
//   getOptionLabel={(option) => option?.identifier || ''} // Safely access the 'identifier' field
//   value={cronJobProfileList.find((profile) => profile.recordId === selectedCronJobProfile) || null} // Use find for single selection
//   onChange={(event, newValue) => {
//     if (newValue) {
//       handleCronJobProfileChange(newValue.recordId); // Update the selected profile by its recordId
//     } else {
//       handleCronJobProfileChange(null); // Clear selection if no value is selected
//     }
//   }}
//   renderInput={(params) => (
//     <TextField
//       {...params}
//       label="Select CronJob Profile"
//       variant="standard"
//     />
//   )}
// />

//     </div>
//   );
// };

// export default CronJobProfile;



import { api } from "@/envfile/api";
import { Autocomplete, TextField } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import axios from 'axios';

const CronJobProfile = ({
  setSelectedCronJobProfile, 
  selectedCronJobProfile, 
  initialLoad = false, // Optional prop for initial load
  dropdownName = "Select CronJob Profile" // Optional dropdown name customization
}) => {
  const [cronJobProfileList, setCronJobProfileList] = useState([]); // Manage cron job profiles
  const [loading, setLoading] = useState(false); // Track loading state
  const [isFetched, setIsFetched] = useState(false); // Avoid redundant API calls

  useEffect(() => {
    if (initialLoad) fetchCronJobProfileData(); // Fetch data if initialLoad is true
  }, [initialLoad]);

  useEffect(() => {
    if (!cronJobProfileList.length && selectedCronJobProfile) {
      fetchCronJobProfileData(); // Ensure data is fetched when a profile is selected
    }
  }, [selectedCronJobProfile]);

  const fetchCronJobProfileData = async () => {
    const token = getCookie("jwtToken");
    if (!token) return;

    setLoading(true); // Start loading indicator
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${api}/admin/cronjobProfile/get`, {
        headers,
      });
      setCronJobProfileList(response.data.cronJobProfiles); // Update state
      setIsFetched(true); // Mark data as fetched
      console.log(response.data.cronJobProfiles, "Fetched Profiles");
    } catch (error) {
      console.error("Error fetching profiles", error);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  const handleDropdownOpen = () => {
    if (!isFetched) fetchCronJobProfileData(); // Fetch data only if not already fetched
  };

  // const handleCronJobProfileChange = (value) => {
  //   setSelectedCronJobProfile(value ? value.recordId : null); // Update selected profile by ID
  // };

  const handleCronJobProfileChange = (newProfile) => {
    setSelectedCronJobProfile(newProfile); // Pass the entire profile object to the parent
  };

  return (
    <div>
      <Autocomplete
        size="small"
        options={cronJobProfileList} // List of profiles
        loading={loading} // Manage loading state
        onOpen={handleDropdownOpen} // Trigger fetching when opened
        getOptionLabel={(option) => option?.identifier || ""} // Display 'identifier'
        value={
          cronJobProfileList.length
            ? cronJobProfileList.find(
                (profile) => profile.recordId === selectedCronJobProfile
              ) || null
            : null
        } // Match based on recordId
        onChange={(event, newValue) => {
          handleCronJobProfileChange(newValue ? newValue.recordId : null); // Update or clear selection
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={dropdownName} // Use dropdownName as label
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

export default CronJobProfile;

