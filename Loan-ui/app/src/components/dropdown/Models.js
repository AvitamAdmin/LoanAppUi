// import { api } from "@/envfile/api";
// import { TextField } from "@mui/material";
// import { getCookie } from "cookies-next";
// import React, { useEffect, useState } from "react";
// import axios from 'axios';

// const Models = ({ setModel, Model }) => {
//   const [modelList, setModelList] = useState([]); // Local state to manage node data
//   const [selectedModel, setSelectedModel] = useState(""); // For capturing selected node

//   useEffect(() => {
//     const token = getCookie("jwtToken");
//     if (token) {
//       getModelData(token); // Fetch node data once token is available
//     }
//   }, []);

//   const getModelData = async (token) => {
//     try {
//       const headers = { Authorization: "Bearer " + token };
//       console.log(token, "token fetching models");

//       const response = await axios.get(api + "/admin/model/get", {
//         headers,
//       });
//       setModelList(response.data.models); // Update the local node list state
//     } catch (error) {
//       console.log(error, "Error fetching nodes");
//     }
//   };

//   const handleModelChange = (value) => {
//     setSelectedModel(value); // Capture selected node
//     setModel(value);
//     console.log(value); // Pass selected node to parent via setNodes
//   };

//   return (
//     <div>
//       <TextField
//         className="text-xs w-full"
//         style={{ marginTop: "2.5vh" }}
//         select
//         value={selectedModel}
//         SelectProps={{
//           native: true,
//         }}
//         variant="standard"
//         onChange={(e) => handleModelChange(e.target.value)}
//       >
//         <option value="">Select Model</option>
//         {modelList.map((option) => (
//           <option key={option.recordId} value={option.recordId}>
//             {option.identifier}
//           </option>
//         ))}
//       </TextField>
//     </div>
//   );
// };

// export default Models;

// import { api } from "@/envfile/api";
// import { TextField } from "@mui/material";
// import { getCookie } from "cookies-next";
// import React, { useEffect, useState } from "react";
// import axios from 'axios';

// const Models = ({ setModel, Model }) => {
//   const [modelList, setModelList] = useState([]); // Local state to manage node data
//   const [selectedModel, setSelectedModel] = useState(""); // For capturing selected node

//   useEffect(() => {
//     const token = getCookie("jwtToken");
//     if (token) {
//       getModelData(token); // Fetch node data once token is available
//     }
//   }, []);

//   const getModelData = async (token) => {
//     try {
//       const headers = { Authorization: "Bearer " + token };
//       console.log(token, "token fetching models");

//       const response = await axios.get(api + "/admin/model/get", {
//         headers,
//       });
//       setModelList(response.data.models); // Update the local node list state
//     } catch (error) {
//       console.log(error, "Error fetching nodes");
//     }
//   };

//   const handleModelChange = (value) => {
//     setSelectedModel(value); // Capture selected node
//     setModel(value);
//     console.log(value); // Pass selected node to parent via setNodes
//   };

//   return (
//     <div>
//       <TextField
//         className="text-xs w-full"
//         style={{ marginTop: "2.5vh" }}
//         select
//         value={selectedModel}
//         SelectProps={{
//           native: true,
//         }}
//         variant="standard"
//         onChange={(e) => handleModelChange(e.target.value)}
//       >
//         <option value="">Select Model</option>
//         {modelList.map((option) => (
//           <option key={option.recordId} value={option.recordId}>
//             {option.identifier}
//           </option>
//         ))}
//       </TextField>
//     </div>
//   );
// };

// export default Models;


import { api } from "@/envfile/api";
import { Autocomplete, TextField } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import axios from 'axios';

const Models = ({ setModel, Model }) => {
  const [modelList, setModelList] = useState([]); // Local state to manage node data
  const [selectedModel, setSelectedModel] = useState(""); // For capturing selected node

  useEffect(() => {
    const token = getCookie("jwtToken");
    if (token) {
      getModelData(token); // Fetch node data once token is available
    }
  }, []);

  useEffect(() => {
    // Set selected model when the Model prop changes
    if (Model) {
      setSelectedModel(Model);
    }
  }, [Model]);

  const getModelData = async (token) => {
    try {
      const headers = { Authorization: "Bearer " + token };
      console.log(token, "token fetching models");

      const response = await axios.get(api + "/admin/model/get", {
        headers,
      });
      setModelList(response.data.models); // Update the local node list state
    } catch (error) {
      console.log(error, "Error fetching nodes");
    }
  };

  const handleModelChange = (value) => {
    setSelectedModel(value); // Capture selected node
    setModel(value);
    console.log(value); // Pass selected node to parent via setModel
  };

  return (
    <div>
      <Autocomplete
  className="text-xs w-full"
  style={{ marginTop: "2.5vh" }}
  options={modelList}
  getOptionLabel={(option) => option.identifier || ""}
  onChange={(e, newValue) => handleModelChange(newValue?.recordId || "")}
  value={modelList.find((option) => option.recordId === selectedModel) || null}
  renderInput={(params) => (
    <TextField
      {...params}
      variant="standard"
      placeholder="Select Model"
    />
  )}
/>
    </div>
  );
};

export default Models;

