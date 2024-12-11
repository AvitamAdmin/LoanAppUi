// import { api } from "@/envfile/api";
// import { Autocomplete, TextField } from "@mui/material";
// import { getCookie } from "cookies-next";
// import React, { useEffect, useState } from "react";
// import axios from 'axios';

// const SitesDropdown = ({ setSites, sites }) => {
//   const [sitesList, setSitesList] = useState([]);
//   const [selectedSites, setSelectedSites] = useState(sites || ""); // Set the initial value from existing data

//   useEffect(() => {
//     const token = getCookie("jwtToken");
//     if (token) {
//       getSitesData(token);
//     }
//   }, []);

//   const getSitesData = async (token) => {
//     try {
//       const headers = { Authorization: "Bearer " + token };
//       const response = await axios.get(api + "/admin/site/get", { headers });
//       setSitesList(response.data.sites);
//     } catch (error) {
//       console.log(error, "Error fetching sites");
//     }
//   };

//   const handleNodeChange = (value) => {
//     setSelectedSites(value);
//     setSites(value);
//   };

//   return (
//     <div>
//      <Autocomplete
//   className="text-xs w-full"
//   options={sitesList} // List of site options
//   getOptionLabel={(option) => option.identifier} // Display the 'identifier' as the label for each option
//   value={sitesList.find((site) => site.recordId === selectedSites) || null} // Set the selected value
//   onChange={(event, newValue) => handleNodeChange(newValue?.recordId || "")} // Handle the change and update the value
//   renderInput={(params) => (
//     <TextField
//       {...params}
//       label="Select Sites" // Label for the input field
//       variant="standard" // Style variant
//       style={{ marginTop: "2.5vh" }} // Keep the same style
//     />
//   )}
//   isOptionEqualToValue={(option, value) => option.recordId === value?.recordId} // Ensure correct option matching
// />
//     </div>
//   );
// };

// export default SitesDropdown;








import { api } from "@/envfile/api";
import { Autocomplete, TextField } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import axios from "axios";

const SitesDropdown = ({
  setSites,
  sites, // Prop containing the current selected site
  initialload = false, // Default to false
  dropdownName = "Select Site", // Customizable label
}) => {
  const [sitesList, setSitesList] = useState([]);
  const [selectedSites, setSelectedSites] = useState(null); // Initially null
  const [loading, setLoading] = useState(false); // Manage loading state

  // Fetch sites data initially or when the dropdown is opened
  useEffect(() => {
    if (initialload) {
      const token = getCookie("jwtToken");
      if (token) getSitesData(token); // Fetch data initially if required
    }
  }, [initialload]);

  // Update selected site after sites list is fetched
  useEffect(() => {
    if (sitesList.length > 0 && sites) {
      const selectedSite = sitesList.find((site) => site.recordId === sites);
      setSelectedSites(selectedSite || null);
    }
  }, [sitesList, sites]); // Run this effect when sitesList or sites prop changes

  const getSitesData = async (token) => {
    setLoading(true); // Show loading indicator
    try {
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(api + "/admin/site/get", { headers });
      setSitesList(response.data.sites || []);
    } catch (error) {
      console.log(error, "Error fetching sites");
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  const handleNodeChange = (value) => {
    setSelectedSites(value); // Update selected value
    setSites(value ? value.recordId : ""); // Pass selected site to parent
  };

  return (
    <div className="w-full">
      <Autocomplete
        className="text-xs w-full"
        options={sitesList}
        getOptionLabel={(option) => option.identifier || ""}
        value={selectedSites} // Set value to selected site
        onChange={(event, newValue) => handleNodeChange(newValue)}
        onOpen={() => {
          if (!initialload && sitesList.length === 0) {
            const token = getCookie("jwtToken");
            if (token) getSitesData(token); // Fetch data on dropdown open
          }
        }}
        loading={loading}
        isOptionEqualToValue={(option, value) =>
          option.recordId === (value?.recordId || value)
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={dropdownName} // Dynamic label
            style={{ marginTop: "2.5vh" }}
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

export default SitesDropdown;

