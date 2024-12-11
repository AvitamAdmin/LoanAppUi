import React, { useEffect, useState } from 'react';
import { api } from '@/envfile/api';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import axios from 'axios';
import { getCookie } from 'cookies-next';

function MultiSelectRole({
  selectedRoles = [], // Array of recordIds
  setSelectedRoles,
  initialload = false,
  dropdownname = "Select Roles",
}) {
  const [roles, setRoles] = useState([]); // All roles fetched from API
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    if (initialload) {
      const jwtToken = getCookie("jwtToken");
      if (jwtToken) {
        getAllRoles(jwtToken);
      } else {
        console.error("JWT token is missing");
      }
    }
  }, [initialload]);

  const getAllRoles = async (jwtToken) => {
    setLoading(true);
    setError(null);
    const ROLE_ENDPOINT = `${api}/admin/role`;

    try {
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = { page: 0, sizePerPage: 50 };

      const response = await axios.post(ROLE_ENDPOINT, body, { headers });
      if (response.data.roleDtoList) {
        setRoles(response.data.roleDtoList);
        console.log("Fetched roles:", response.data.roleDtoList);
      } else {
        setRoles([]);
        console.warn("No roles found in API response.");
      }
    } catch (error) {
      console.error("Error fetching roles:", error.message);
      setError("Failed to fetch roles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Log selectedRoles and roles for debugging
  console.log("selectedRoles:", selectedRoles);
  console.log("roles:", roles);

  // Ensure selectedRoles contains valid recordId and compare safely
  const selectedRoleObjects = roles.filter((role) =>
    selectedRoles.map(String).includes(String(role.recordId))
  );

  console.log("Mapped selected roles (value):", selectedRoleObjects);

  const handleRoleChange = (event, newValue) => {
    const selectedRoleIds = newValue.map((role) => role.recordId);
    setSelectedRoles(selectedRoleIds); // Update parent state
    console.log("Updated selected roles (IDs):", selectedRoleIds);
  };

  return (
    <div className="w-full">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <Autocomplete
        multiple
        options={roles}
        getOptionLabel={(option) => option?.name || ""}
        value={selectedRoleObjects} // Pass filtered roles
        onChange={handleRoleChange}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label={dropdownname}
            variant="standard"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress size={20} color="inherit" /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            className="w-full"
          />
        )}
      />
    </div>
  );
}



export default MultiSelectRole;

