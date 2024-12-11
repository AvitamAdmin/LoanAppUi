// import { api } from "@/envfile/api";
// import { Autocomplete, TextField } from "@mui/material";
// import { getCookie } from "cookies-next";
// import React, { useEffect, useState } from "react";
// import axios from 'axios';

// const TestDataSubTypeDropDown = ({ testDataSubtypes, setTestDataSubtypes }) => {
//   const [testDataSubtypesList, setTestDataSubtypesList] = useState([]);

//   useEffect(() => {
//     const token = getCookie("jwtToken");
//     if (token) {
//       getTestDataSubTypesData(token); // Fetch test data types once token is available
//     }
//   }, []);

//   const getTestDataSubTypesData = async (token) => {
//     try {
//       const headers = { Authorization: "Bearer " + token };
//       const response = await axios.get(api + "/admin/testdatasubtype/get", { headers });
//       setTestDataSubtypesList(response.data.testDataSubtypes); // Update the local test data types list
//     } catch (error) {
//       console.log(error, "Error fetching testDataSubtypesList");
//     }
//   };

//   // Log the updated testDataTypes after it changes
//   useEffect(() => {
//     console.log(testDataSubtypesList, "Fetched from backend testDataSubtypes");
//   }, [testDataSubtypesList]);

//   const handleNodeChange = (newValue) => {
//     if (newValue) {
//       setTestDataSubtypes(newValue.recordId); // Capture selected test data subtype by recordId
//       console.log("Selected TestData Subtype:", newValue);
//     } else {
//       setTestDataSubtypes(""); // Handle case when no value is selected
//     }
//   };

//   return (
//     <div>
//       <Autocomplete
//         className="text-xs w-full"
//         style={{ marginTop: "2.5vh" }}
//         options={testDataSubtypesList} // The array of testDataSubtypes
//         getOptionLabel={(option) => option.identifier || ''} // Display the identifier in the dropdown
//         value={testDataSubtypesList.find(option => option.recordId === testDataSubtypes) || null} // Set current value
//         onChange={(event, newValue) => handleNodeChange(newValue)} // Handle value change
//         isOptionEqualToValue={(option, value) => option.recordId === value?.recordId} // Match by recordId
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             label="Select TestData Subtypes"
//             variant="standard"
//           />
//         )}
//       />
//     </div>
//   );
// };

// export default TestDataSubTypeDropDown;





import { api } from "@/envfile/api";
import { Autocomplete, TextField } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import axios from "axios";

const TestDataSubTypeDropDown = ({
  testDataSubtypes, // This should be the recordId from the parent
  setTestDataSubtypes, // Function to update selected value in the parent
  dropdownName = "Select Test Data Subtypes",
  initialload = false,
}) => {
  const [testDataSubtypesList, setTestDataSubtypesList] = useState([]); // List of available options
  const [loading, setLoading] = useState(false); // Loading state

  const getTestDataSubTypesData = async (token) => {
    try {
      setLoading(true);
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(`${api}/admin/testdatasubtype/get`, { headers });
      console.log("API Response:", response.data); // Log the response
      setTestDataSubtypesList(response.data.testDataSubtypes || []);
    } catch (error) {
      console.log("Error fetching testDataSubtypesList:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialload) {
      const token = getCookie("jwtToken");
      if (token) getTestDataSubTypesData(token);
    }
  }, [initialload]);

  const handleDropdownOpen = () => {
    const token = getCookie("jwtToken");
    if (token && testDataSubtypesList.length === 0) {
      getTestDataSubTypesData(token);
    }
  };

  const handleNodeChange = (event, newValue) => {
    if (newValue) {
      setTestDataSubtypes(newValue.recordId); // Update parent with selected recordId
    } else {
      setTestDataSubtypes(null); // Clear selection in parent
    }
  };

  // Ensure selected value is correctly displayed
  const selectedValue = testDataSubtypesList.find(
    (option) => option.recordId === testDataSubtypes
  ) || null;

  console.log("testDataSubtypes Prop:", testDataSubtypes); // Log prop value
  console.log("Loaded Test Data Subtypes List:", testDataSubtypesList); // Log loaded options
  console.log("Computed Selected Value:", selectedValue); // Log selected value

  return (
    <Autocomplete
      className="text-xs w-full"
      style={{ marginTop: "2.5vh" }}
      options={testDataSubtypesList} // List of test data subtypes
      getOptionLabel={(option) => option.identifier || ""} // Display identifier
      value={selectedValue || null} // Set current value based on parent state
      onChange={handleNodeChange} // Handle value change
      onOpen={handleDropdownOpen} // Lazy-load data when dropdown opens
      loading={loading} // Show loading state
      isOptionEqualToValue={(option, value) => option.recordId === value} // Match by recordId
      renderInput={(params) => (
        <TextField
          {...params}
          label={dropdownName} // Use dropdownName as the label
          variant="standard"
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
  );
};

export default TestDataSubTypeDropDown;





