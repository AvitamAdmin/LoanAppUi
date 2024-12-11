import { api } from "@/envfile/api";
import { Autocomplete, TextField } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import axios from "axios";

const MultiSelectTestLocatorGroup = ({
  setSelectedTestLocatorGroup,
  selectedTestLocatorGroup = [], // Default to empty array for multi-selection
  initialload = false, // Add initialload prop
  dropdownName = "Select Test Groups", // Adjusted for plural use
}) => {
  const [locatorGroups, setLocatorGroups] = useState([]); // List of locator groups
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch locator group data from the API
  const getTestLocatorGroupData = async (token) => {
    try {
      setLoading(true); // Show loading
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(api + "/admin/locatorGroup/get", { headers });
      setLocatorGroups(response.data.testLocatorGroups || []); // Store fetched groups
      console.log("Fetched Locator Groups:", response.data.testLocatorGroups);
    } catch (error) {
      console.error("Error fetching locator groups:", error);
    } finally {
      setLoading(false); // Hide loading
    }
  };

  // Fetch data on mount if `initialload` is true
  useEffect(() => {
    if (initialload) {
      const token = getCookie("jwtToken");
      if (token) getTestLocatorGroupData(token);
    }
  }, [initialload]);

  // Handle dropdown open to fetch data lazily
  const handleDropdownOpen = () => {
    if (!initialload && locatorGroups.length === 0) {
      const token = getCookie("jwtToken");
      if (token) getTestLocatorGroupData(token);
    }
  };

  // Handle changes when multiple groups are selected
  const handleTestLocatorGroupChange = (event, newValue) => {
    const selectedIds = newValue.map((group) => group.recordId); // Map selected items to their IDs
    setSelectedTestLocatorGroup(selectedIds); // Update selected state
    console.log("Selected Test Locator Groups:", selectedIds);
  };

  return (
    <div>
      <Autocomplete
        multiple // Enable multi-selection
        className="text-xs w-full"
        style={{ marginTop: "2.5vh" }}
        options={locatorGroups} // List of locator groups
        getOptionLabel={(option) => option?.identifier || ""} // Display identifier
        value={locatorGroups.filter((group) =>
          selectedTestLocatorGroup.includes(group.recordId) // Filter selected groups
        )}
        onChange={handleTestLocatorGroupChange} // Handle selection changes
        onOpen={handleDropdownOpen} // Fetch data when dropdown opens
        loading={loading} // Show loading state
        isOptionEqualToValue={(option, value) => option.recordId === value.recordId} // Ensure proper matching
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={dropdownName} // Use dynamic placeholder
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

export default MultiSelectTestLocatorGroup;
