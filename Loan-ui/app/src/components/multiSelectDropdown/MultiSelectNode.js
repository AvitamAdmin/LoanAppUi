// import React, { useEffect, useState } from "react";
// import { api } from "@/envfile/api";
// import { Autocomplete, TextField } from "@mui/material";
// import axios from "axios";
// import { getCookie } from "cookies-next";

// function MultiSelectNode({ selectedNodes, setSelectedNodes }) {
//   console.log(selectedNodes, "selectedNodes from multi Nodedropdown");

//   const [nodes, setNodes] = useState([]);

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
//       setNodes(response.data.nodes); // Fetch all available nodes
//       console.log(response.data.nodes, "Nodes fetched");
//     } catch (error) {
//       console.log(error, "error fetching nodes");
//     }
//   };

//   // Filter nodes by recordId (selectedNodes which is the reportInterfaces array)
//   const filteredSelectedNodes = selectedNodes
//     .map((recordId) => nodes.find((node) => node.recordId === recordId))
//     .filter((node) => node !== undefined); // Only include valid matches

//   return (
//     <div className="w-full">
//       <Autocomplete
//         multiple
//         options={nodes}
//         getOptionLabel={(option) => option.identifier} // Display node identifier
//         value={filteredSelectedNodes} // Filtered nodes matching the recordId
//         onChange={(event, newValue) => {
//           setSelectedNodes(newValue.map((node) => node.recordId)); // Update selected nodes with recordId
//         }}
//         className="w-full"
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             label="Select Multiple Nodes"
//             variant="standard"
//             className="w-full"
//           />
//         )}
//       />
//     </div>
//   );
// }

// export default MultiSelectNode;



import React, { useEffect, useState } from "react";
import { api } from "@/envfile/api";
import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { getCookie } from "cookies-next";

function MultiSelectNode({
  selectedNodes,
  setSelectedNodes,
  dropdownName = "Select Multiple Nodes", // Add dropdown name prop
  initialload = false, // Add initial load flag
}) {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch nodes data based on the provided token
  const getNodesData = async (token) => {
    try {
      setLoading(true); // Show loading indicator
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${api}/admin/interface/get`, { headers });
      setNodes(response.data.nodes || []); // Update the nodes state
      console.log(response.data.nodes, "Nodes fetched");
    } catch (error) {
      console.log(error, "error fetching nodes");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Load nodes initially if `initialload` is true
  useEffect(() => {
    if (initialload) {
      const token = getCookie("jwtToken");
      if (token) getNodesData(token);
    }
  }, [initialload]);

  // Handle dropdown open to fetch nodes if not already loaded
  const handleDropdownOpen = () => {
    if (nodes.length === 0) {
      const token = getCookie("jwtToken");
      if (token) getNodesData(token);
    }
  };

  // Filter nodes to match selected recordIds
  const filteredSelectedNodes = selectedNodes
    .map((recordId) => nodes.find((node) => node.recordId === recordId))
    .filter((node) => node !== undefined); // Only include valid matches

  return (
    <div className="w-full">
      <Autocomplete
        multiple
        options={nodes} // Available nodes list
        getOptionLabel={(option) => option.identifier || ''} // Display identifier
        value={filteredSelectedNodes} // Filtered selected nodes
        onOpen={handleDropdownOpen} // Fetch nodes on open if needed
        loading={loading} // Indicate loading state
        onChange={(event, newValue) => {
          setSelectedNodes(newValue.map((node) => node.recordId)); // Update selected nodes with recordId
        }}
        className="w-full"
        isOptionEqualToValue={(option, value) => option.recordId === value?.recordId} // Match by recordId
        renderInput={(params) => (
          <TextField
            {...params}
            label={dropdownName} // Use dropdownName as label
            variant="standard"
            className="w-full"
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
}

export default MultiSelectNode;
