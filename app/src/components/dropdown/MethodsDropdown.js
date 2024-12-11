import { api } from "@/envfile/api";
import { Autocomplete, TextField } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import axios from 'axios';

const MethodsDropdown = ({ methods ,setMethods}) => {
  const [methodsList, setMethodsList] = useState([]); // Local state to manage node data

  useEffect(() => {
    const token = getCookie("jwtToken");
    if (token) {
      getMethods(token); // Fetch test data types once token is available
    }
  }, []);

  const getMethods = async (token) => {
    try {
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(api + "/admin/locator/add", {
        headers,
      });        
      setMethodsList(response.data.methods); // Update the local test data types list
      console.log(response.data.methods, "Fetched testDataTypes");
    } catch (error) {
      console.log(error, "Error fetching methodsList");
    }
  };

  // Log the updated testDataTypes after it changes
  useEffect(() => {
    console.log(methodsList, "Updated methodsList");
  }, [methodsList]);

  const handleNodeChange = (value) => {
    setMethods(value); // Capture selected test data type
  };

  return (
    <div className="w-full">
      <Autocomplete
  value={methods}  // Ensure selected method is correctly set
  onChange={(event, newValue) => handleNodeChange(newValue)}  // Handle the change
  options={methodsList}  // Options to show
  getOptionLabel={(option) => option}  // Since your methodsList is an array of strings, use the option as label
  renderInput={(params) => (
    <TextField
      {...params}
      variant="standard"
      className="text-xs w-full"
      style={{ marginTop: "2.5vh" }}
      placeholder="Select Methods"
    />
  )}
  fullWidth
/>
    </div>
  );
};

export default MethodsDropdown;



// import { api } from "@/envfile/api";
// import { Autocomplete, TextField } from "@mui/material";
// import { getCookie } from "cookies-next";
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const MethodsDropdown = ({ methods, setMethods, initialload = true, dropdownName = "Select Methods" }) => {
//   const [methodsList, setMethodsList] = useState([]); // Local state to manage methods data
//   const [loading, setLoading] = useState(false); // Local loading state

//   // Function to fetch methods data
//   const getMethods = async (token) => {
//     try {
//       setLoading(true); // Set loading to true before fetching
//       const headers = { Authorization: "Bearer " + token };
//       const response = await axios.get(`${api}/admin/locator/add`, {
//         headers,
//       });
//       setMethodsList(response.data.methods || []); // Update the local methods list
//       console.log(response.data.methods, "Fetched methodsList");
//     } catch (error) {
//       console.log(error, "Error fetching methodsList");
//     } finally {
//       setLoading(false); // Set loading to false after fetching is complete
//     }
//   };

//   // Function to handle dropdown open event
//   const handleDropdownOpen = () => {
//     if (!initialload && methodsList.length === 0) {
//       const token = getCookie("jwtToken");
//       if (token) {
//         getMethods(token); // Lazy-load data when dropdown opens
//       }
//     }
//   };

//   // Log the updated methodsList after it changes
//   useEffect(() => {
//     console.log(methodsList, "Updated methodsList");
//   }, [methodsList]);

//   const handleNodeChange = (value) => {
//     setMethods(value); // Capture selected method
//   };

//   return (
//     <div className="w-full">
//       <Autocomplete
//         value={methods} // Ensure selected method is correctly set
//         onChange={(event, newValue) => handleNodeChange(newValue)} // Handle the change
//         options={methodsList} // Options to show
//         getOptionLabel={(option) => option} // Use the option as label
//         onOpen={handleDropdownOpen} // Lazy-load data when dropdown opens
//         loading={loading} // Show loading state
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             label={dropdownName} // Use dynamic label
//             variant="standard"
//             InputProps={{
//               ...params.InputProps,
//               endAdornment: (
//                 <>
//                   {loading ? <span>Loading...</span> : null} 
//                   {params.InputProps.endAdornment}
//                 </>
//               ),
//             }}
//           />
//         )}
//         fullWidth
//       />
//     </div>
//   );
// };

// export default MethodsDropdown;
