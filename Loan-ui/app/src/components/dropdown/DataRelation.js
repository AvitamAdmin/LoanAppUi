// import { api } from "@/envfile/api";
// import { Autocomplete, TextField } from "@mui/material";
// import { getCookie } from "cookies-next";
// import React, { useEffect, useState } from "react";
// import axios from 'axios';

// const DataRelation = ({ setSelectedDataRelation, selectedDataRelation }) => {
//   const [dataRelationList, setDataRelationList] = useState([]); 
//   // console.log("Selected selectedDataRelation:", selectedDataRelation);
  

//   useEffect(() => {
//     const token = getCookie("jwtToken");
//     if (token) {
//       getDataRelationeData(token); // Fetch node data once token is available
//     }
//   }, []);
  
//   const getDataRelationeData = async (token) => {
//     try {
//       const headers = { Authorization: "Bearer " + token };
//       const response = await axios.get(api + "/admin/dataRelation/get", {
//         headers,
//       });
//       setDataRelationList(response.data.dataRelations); // Update the local node list state
//       // console.log(response.data.dataRelations);
//     } catch (error) {
//       console.log(error, "Error fetching nodes");
//     }
//   };

//   const handleNodeChange = (value) => {
//     setSelectedDataRelation(value); // Capture selected node
//   };

//   return (
//     <div className="w-full">
//       <Autocomplete
//    className="w-full"
//   style={{ marginTop: "2.5vh" }}
//   options={dataRelationList}  // Array of options for autocomplete
//   getOptionLabel={(option) => option.identifier || ""}  // Display the identifier
//   value={dataRelationList.find((option) => option.recordId === selectedDataRelation) || null}  // Set the selected value
//   onChange={(event, newValue) => {
//     handleNodeChange(newValue ? newValue.recordId : "");  // Update the selected value on change
//   }}
//   renderInput={(params) => (
//     <TextField
//      className="w-full"
//       {...params}
//       variant="standard"
//       label="Select DataRelation"
//     />
//   )}
// />

//     </div>
//   );
// };

// export default DataRelation;


import { api } from "@/envfile/api";
import { Autocomplete, TextField } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import axios from 'axios';

const DataRelation = ({
  setSelectedDataRelation, 
  selectedDataRelation, 
  initialload = false,  // Default to true
  dropdownName = "Please select the DataRelation" // Default label
}) => {
  const [dataRelationList, setDataRelationList] = useState([]);
  const [loading, setLoading] = useState(false); // Manage loading state

  useEffect(() => {
    if (initialload) {
      const token = getCookie("jwtToken");
      if (token) getDataRelationData(token); // Fetch data if `initialload` is true
    }
  }, [initialload]);

  const getDataRelationData = async (token) => {
    setLoading(true); // Set loading state to true during fetch
    try {
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(api + "/admin/dataRelation/get", { headers });
      setDataRelationList(response.data.dataRelations || []); // Update state with fetched data
    } catch (error) {
      console.log(error, "Error fetching data relations");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleNodeChange = (value) => {
    setSelectedDataRelation(value); // Capture selected data relation
  };

  return (
    <div className="w-full">
      <Autocomplete
        className="w-full"
        style={{ marginTop: "2.5vh" }}
        options={dataRelationList}
        getOptionLabel={(option) => option.identifier || ""}
        value={
          dataRelationList.find((option) => option.recordId === selectedDataRelation) || null
        }
        onChange={(event, newValue) => {
          handleNodeChange(newValue ? newValue.recordId : "");
        }}
        onOpen={() => {
          if (!initialload && dataRelationList.length === 0) {
            const token = getCookie("jwtToken");
            if (token) getDataRelationData(token); // Fetch data when dropdown opens
          }
        }}
        isOptionEqualToValue={(option, value) =>
          option.recordId === (value?.recordId || value)
        }
        loading={loading} // Show loading state
        renderInput={(params) => (
          <TextField
            className="w-full"
            {...params}
            variant="standard"
            label={dropdownName} // Use dynamic label
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

export default DataRelation;
