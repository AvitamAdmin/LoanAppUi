// import React, { useEffect, useState } from "react";
// import { api } from "@/envfile/api";
// import { Autocomplete, TextField } from "@mui/material";
// import axios from "axios";
// import { getCookie } from "cookies-next";

// const NodeDropdown = ({ setSelectedNode, selectedNode }) => {
//   console.log(selectedNode, "selectedNodes from multi Nodedropdown");

//   const [nodeList, setNodeList] = useState([]);

//   useEffect(() => {
//     const token = getCookie("jwtToken");
//     if (token) {
//       getNodesData(token);
//     }
//   }, []);

//   const getNodesData = async (token) => {
//     try {
//       const headers = { Authorization: "Bearer " + token };
//       const response = await axios.get(api + "/admin/interface/get", {
//         headers,
//       });
//       setNodeList(response.data.nodes || []);
//     } catch (error) {
//       console.log(error, "Error fetching nodes");
//     }
//   };

//   const handleNodeChange = (event, newValue) => {
//     setSelectedNode(newValue?.recordId || "");
//   };

//   // Find the node from the list that matches the selectedNode (if it's a string)
//   const selectedNodeObject =
//     typeof selectedNode === "string"
//       ? nodeList.find((node) => node.recordId === selectedNode) || null
//       : selectedNode;

//   return (
//     <div className="w-full">
//       <Autocomplete
//         options={nodeList}
//         getOptionLabel={(option) => option.identifier}
//         value={selectedNodeObject} // Use the matched object for the value
//         onChange={handleNodeChange}
//         isOptionEqualToValue={(option, value) =>
//           option.recordId === (value?.recordId || value)
//         } // Handle both string and object comparison
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             label="Select Node"
//             variant="standard"
//           />
//         )}
//       />
//     </div>
//   );
// };

// export default NodeDropdown;


import React, { useEffect, useState } from "react";
import { api } from "@/envfile/api";
import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { getCookie } from "cookies-next";

const NodeDropdown = ({ 
  setSelectedNode, 
  selectedNode, 
  initialload = false, // Default to true
  dropdownName = "Select Node" // Default label
}) => {
  console.log(selectedNode, "selectedNodes from multi NodeDropdown");

  const [nodeList, setNodeList] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for fetching

  useEffect(() => {
    if (initialload) {
      const token = getCookie("jwtToken");
      if (token) {
        getNodesData(token); // Fetch nodes on initial load if required
      }
    }
  }, [initialload]);

  const getNodesData = async (token) => {
    setLoading(true); // Show loading indicator
    try {
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(api + "/admin/interface/get", { headers });
      setNodeList(response.data.nodeDtos || []);
    } catch (error) {
      console.log(error, "Error fetching nodes");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const handleNodeChange = (event, newValue) => {
    setSelectedNode(newValue?.recordId || "");
  };

  // Find the node from the list that matches the selectedNode
  const selectedNodeObject =
    typeof selectedNode === "string"
      ? nodeList.find((nodeDtos) => nodeDtos.recordId === selectedNode) || null
      : selectedNode;

  return (
    <div className="w-full">
      <Autocomplete
        options={nodeList}
        getOptionLabel={(option) => option.identifier || ""}
        value={selectedNodeObject} // Use the matched object as value
        onChange={handleNodeChange}
        onOpen={() => {
          if (!initialload && nodeList.length === 0) {
            const token = getCookie("jwtToken");
            if (token) getNodesData(token); // Fetch nodes when dropdown opens
          }
        }}
        isOptionEqualToValue={(option, value) =>
          option.recordId === (value?.recordId || value)
        } // Handle string and object comparison
        loading={loading} // Optional: Show loading state
        renderInput={(params) => (
          <TextField
            {...params}
            label={dropdownName} // Dynamic label
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
    </div>
  );
};

export default NodeDropdown;
