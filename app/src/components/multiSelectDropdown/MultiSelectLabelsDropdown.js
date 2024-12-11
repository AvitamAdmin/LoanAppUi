

import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { api } from "@/envfile/api";

const MultiselectLabelsDropdown = ({
  setLabels,
  labels,
  initialload = false,
  dropdownName = "Select Label", // Default label
}) => {
  const [lablesList, setLablesList] = useState([]); // Manage labels list
  const [loading, setLoading] = useState(false); // Track loading state

  useEffect(() => {
    if (initialload) {
      fetchLabelsData(); // Fetch on initial load if enabled
    }
  }, [initialload]);

  const fetchLabelsData = async () => {
    setLoading(true); // Set loading state to true
    const token = getCookie("jwtToken");
    try {
      if (token) {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${api}/admin/impactConfig/add`, { headers });

        // Sort labels alphabetically before setting the state
        const sortedLabels = (response.data.labels || []).sort((a, b) =>
          a.localeCompare(b)
        );

        setLablesList(sortedLabels);
      }
    } catch (error) {
      console.error("Error fetching labels:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleLocaleChange = (event, newValue) => {
    setLabels(newValue || null); // Handle locale selection
  };

  return (
    <div className="w-full">
      <Autocomplete
      multiple
        size="small"
        options={lablesList}
        getOptionLabel={(option) => option || ""} // Assuming options are strings
        value={labels || null} // Selected value
        onChange={handleLocaleChange}
        onOpen={() => {
          if (!initialload && lablesList.length === 0) {
            fetchLabelsData(); // Fetch data on dropdown open if not preloaded
          }
        }}
        loading={loading}
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

export default MultiselectLabelsDropdown;
