import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';
import { api } from '@/envfile/api';

function MultiSelectSubsidiary({ 
    selectedSubsidiary, 
  setSelectedSubsidiary, 
  initialload = false, // Default to true
  dropdownName = "Select Subsidiaries" // Default dropdown label
}) {
  const [subsidiary, setSubsidiary] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialload) {
      getAllSubsidiaries(); // Fetch data only if initialload is true
    }
  }, [initialload]);

  const getAllSubsidiaries = async () => {
    setLoading(true); // Show loading indicator
    try {
      const response = await axios.get(api + "/admin/subsidiary/get");
      setSubsidiary(response.data.subsidiaries || []);
      console.log(response.data.subsidiaries, "subsidiaries fetched");
    } catch (error) {
      console.error("Error fetching subsidiaries:", error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div className="w-full">
      <Autocomplete
        multiple
        size="small"
        options={subsidiary} // List of all subsidiaries fetched from the backend
        getOptionLabel={(option) => option.identifier || ''} // Display the 'identifier' field
        value={subsidiary.filter((sub) => 
          selectedSubsidiary ? selectedSubsidiary.includes(sub.recordId) : ''
        ) || []} // Ensure selected values are correctly mapped
        onChange={(event, newValue) => {
          setSelectedSubsidiary(newValue.map((item) => item.recordId));
        }}
        onOpen={() => {
          if (!initialload && subsidiary.length === 0) {
            getAllSubsidiaries(); // Lazy-load data when dropdown opens
          }
        }}
        loading={loading} // Optional: Show loading state
        renderInput={(params) => (
          <TextField
            {...params}
            label={dropdownName} // Use dynamic label
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
}

export default MultiSelectSubsidiary;
