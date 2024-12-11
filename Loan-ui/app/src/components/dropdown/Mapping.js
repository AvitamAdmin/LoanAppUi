import { api } from "@/envfile/api";
import { Autocomplete, TextField } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import axios from "axios";

const MappingDropdown = ({
  setMapping,
  mapping,
  initialload = false, // Default to false
  dropdownName = "Select Mapping", // Customizable label
}) => {
  const [mappingList, setMappingList] = useState([]);
  const [loading, setLoading] = useState(false); // Manage loading state
  const [selectedMapping, setSelectedMapping] = useState(null); // Initial value set to null

  useEffect(() => {
    if (initialload) {
      const token = getCookie("jwtToken");
      if (token) getMappingData(token); // Fetch data initially if required
    }
  }, [initialload]);

  useEffect(() => {
    if (mapping && mappingList.length > 0) {
      const existingMapping = mappingList.find((item) => item.recordId === mapping);
      if (existingMapping) {
        setSelectedMapping(existingMapping); // Set the value when mappingList is populated
      }
    }
  }, [mapping, mappingList]); // Trigger this effect when either mapping or mappingList changes

  const getMappingData = async (token) => {
    setLoading(true); // Show loading indicator while fetching
    try {
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(api + "/admin/mapping/get", { headers });
      setMappingList(response.data.sourceTargetMappings || []);
    } catch (error) {
      console.log(error, "Error fetching mapping");
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  const handleMappingChange = (event, newValue) => {
    setSelectedMapping(newValue); // Update selected value
    setMapping(newValue ? newValue.recordId : ""); // Pass selected mapping to parent
  };

  return (
    <div className="w-full">
      <Autocomplete
        className="w-full"
        options={mappingList}
        getOptionLabel={(option) => option.identifier || ""}
        value={selectedMapping}
        onChange={handleMappingChange}
        onOpen={() => {
          if (!initialload && mappingList.length === 0) {
            const token = getCookie("jwtToken");
            if (token) getMappingData(token); // Fetch data on dropdown open
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

export default MappingDropdown;
