// import { api } from "@/envfile/api";
// import { Autocomplete, TextField } from "@mui/material";
// import { getCookie } from "cookies-next";
// import React, { useEffect, useState } from "react";
// import axios from 'axios';

// const TestPlan = ({ setTestPlan, testPlan, existingTestPlan }) => {
//   const [testPlanList, setTestPlanList] = useState([]); 
//   const [selectedTestPlan, setSelectedTestPlan] = useState(existingTestPlan || ""); // Set initial value from props

//   useEffect(() => {
//     const token = getCookie("jwtToken");
//     if (token) {
//       getTestPlanData(token); // Fetch test plan data once token is available
//     }
//   }, []);

//   const getTestPlanData = async (token) => {
//     try {
//       const headers = { Authorization: "Bearer " + token };
//       const response = await axios.get(api + "/admin/qa/get", { headers });
//       setTestPlanList(response.data.testPlans); // Update the local test plan list state
//       console.log(response.data.testPlans);
//     } catch (error) {
//       console.log(error, "Error fetching test plans");
//     }
//   };

//   const handleTestPlanChange = (value) => {
//     setSelectedTestPlan(value); // Capture selected test plan
//     setTestPlan(value); // Pass selected test plan to parent via setTestPlan
//   };

//   // Update selectedTestPlan when existingTestPlan changes
//   useEffect(() => {
//     setSelectedTestPlan(existingTestPlan);
//   }, [existingTestPlan]);

//   return (
//     <div>
//      <Autocomplete
//   options={testPlanList} // Array of test plan objects
//   getOptionLabel={(option) => option.identifier} // Define how to display each option
//   value={testPlanList.find((plan) => plan.recordId === selectedTestPlan) || null} // Set the current value based on the selectedTestPlan
//   onChange={(event, newValue) => {
//     if (newValue) {
//       handleTestPlanChange(newValue.recordId); // Update the selected test plan based on user selection
//     } else {
//       handleTestPlanChange(""); // Handle clearing of the selection
//     }
//   }}
//   renderInput={(params) => (
//     <TextField
//       {...params}
//       label="Select TestPlan"
//       variant="standard"
//       className="text-xs w-full"
//       style={{ marginTop: "2.5vh" }}
//     />
//   )}
// />
//     </div>
//   );
// };

// export default TestPlan;







import { api } from "@/envfile/api";
import { Autocomplete, TextField } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import axios from 'axios';

const TestPlan = ({ 
  setTestPlan, 
  testPlan, 
  existingTestPlan, 
  dropdownName = "Select TestPlan",  // Default dropdown name
  initialLoad = false  // Control if data should load on mount
}) => {
  const [testPlanList, setTestPlanList] = useState([]); 
  const [selectedTestPlan, setSelectedTestPlan] = useState(existingTestPlan || ""); 
  const [isFetched, setIsFetched] = useState(false); // Track if data is fetched

  // Conditionally fetch data on initial load
  useEffect(() => {
    if (initialLoad) {
      const token = getCookie("jwtToken");
      if (token) getTestPlanData(token);
    }
  }, [initialLoad]);

  // Function to fetch test plans
  const getTestPlanData = async (token) => {
    try {
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(api + "/admin/qa/get", { headers });
      setTestPlanList(response.data.testPlans); 
      console.log(response.data.testPlans);
    } catch (error) {
      console.error("Error fetching test plans:", error);
    }
  };

  // Handle test plan change
  const handleTestPlanChange = (value) => {
    setSelectedTestPlan(value); 
    setTestPlan(value); 
  };

  // Handle onOpen to avoid redundant API calls
  const handleDropdownOpen = () => {
    if (!isFetched) {
      const token = getCookie("jwtToken");
      if (token) {
        getTestPlanData(token);
        setIsFetched(true); // Mark as fetched
      }
    }
  };

  // Sync with parent prop whenever existingTestPlan changes
  useEffect(() => {
    setSelectedTestPlan(existingTestPlan);
  }, [existingTestPlan]);

  return (
    <div>
      <Autocomplete
        options={testPlanList}
        getOptionLabel={(option) => option.identifier || ""}
        value={
          testPlanList.find((plan) => plan.recordId === selectedTestPlan) || null
        }
        onChange={(event, newValue) => {
          if (newValue) {
            handleTestPlanChange(newValue.recordId);
          } else {
            handleTestPlanChange("");
          }
        }}
        onOpen={handleDropdownOpen} // Fetch data when the dropdown opens
        renderInput={(params) => (
          <TextField
            {...params}
            label={dropdownName} // Use dropdownName prop for label
            variant="standard"
            className="text-xs w-full"
            style={{ marginTop: "2.5vh" }}
          />
        )}
      />
    </div>
  );
};

export default TestPlan;
