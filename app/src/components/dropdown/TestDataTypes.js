// import { api } from "@/envfile/api";
// import { Autocomplete, TextField } from "@mui/material";
// import { getCookie } from "cookies-next";
// import React, { useEffect, useState } from "react";
// import axios from 'axios';

// const TestDataTypesDropDown = ({ selectedTestDataTypes, setSelectedTestDataTypes }) => {
//   const [testDataTypes, setTestDataTypes] = useState([]);

//   useEffect(() => {
//     const token = getCookie("jwtToken");
//     if (token) {
//       getTestDataTypesData(token);
//     }
//   }, []);

//   const getTestDataTypesData = async (token) => {
//     try {
//       const headers = { Authorization: "Bearer " + token };
//       const response = await axios.get(api + "/admin/testdatatype/get", { headers });
//       setTestDataTypes(response.data.testDataTypes);
//     } catch (error) {
//       console.log(error, "Error fetching testDataTypes");
//     }
//   };

//   const handleNodeChange = (newValue) => {
//     if (newValue) {
//       setSelectedTestDataTypes(newValue.recordId); // Update with the selected recordId
//       console.log("Selected TestDataType:", newValue); // Log the selected object for verification
//     } else {
//       setSelectedTestDataTypes(""); // Clear selection if no value
//     }
//   };

//   return (
//     <div>
//       <Autocomplete
//         className="text-xs w-full"
//         style={{ marginTop: "2.5vh" }}
//         options={testDataTypes} // The array of options (testDataTypes)
//         getOptionLabel={(option) => option.identifier || ''} // Show identifier in dropdown
//         value={testDataTypes.find((option) => option.recordId === selectedTestDataTypes) || null} // Match based on recordId
//         onChange={(event, newValue) => handleNodeChange(newValue)} // Handle value change
//         isOptionEqualToValue={(option, value) => option.recordId === value?.recordId} // Match by recordId
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             variant="standard"
//             label="Select TestDataTypes"
//           />
//         )}
//       />
//     </div>
//   );
// };

// export default TestDataTypesDropDown;




import { api } from "@/envfile/api";
import { Autocomplete, TextField } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import axios from "axios";

const TestDataTypesDropDown = ({
  selectedTestDataTypes, // Value from the parent
  setSelectedTestDataTypes, // Function to update the selected value in the parent
  dropdownName = "Select TestDataTypes",
  initialload = false,
}) => {
  const [testDataTypes, setTestDataTypes] = useState([]); // Test Data Types array
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch the test data types
  const getTestDataTypesData = async (token) => {
    try {
      setLoading(true);
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(`${api}/admin/testdatatype/get`, { headers });
      setTestDataTypes(response.data.testDataTypes || []);
    } catch (error) {
      console.log("Error fetching testDataTypes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to load data on initial load or dropdown open
  useEffect(() => {
    if (initialload) {
      const token = getCookie("jwtToken");
      if (token) getTestDataTypesData(token);
    }
  }, [initialload]);

  // Handle dropdown open (lazy loading)
  const handleDropdownOpen = () => {
    const token = getCookie("jwtToken");
    if (token && testDataTypes.length === 0) {
      getTestDataTypesData(token);
    }
  };

  // Handle the selection change
  const handleNodeChange = (event, newValue) => {
    // Update the parent with the selected value or null if none is selected
    setSelectedTestDataTypes(newValue ? newValue.recordId : null);
  };

  return (
    <Autocomplete
      className="text-xs w-full"
      style={{ marginTop: "2.5vh" }}
      options={testDataTypes}
      getOptionLabel={(option) => option.identifier || ""}
      value={
        testDataTypes.find(option => option.recordId === selectedTestDataTypes) || null
      } // Match the value with the correct option
      onChange={handleNodeChange}
      onOpen={handleDropdownOpen}
      loading={loading}
      isOptionEqualToValue={(option, value) => option.recordId === value?.recordId} // Correct comparison
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          placeholder={dropdownName}
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

export default TestDataTypesDropDown;











