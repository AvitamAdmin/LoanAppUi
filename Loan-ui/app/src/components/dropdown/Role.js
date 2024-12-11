import React, { useEffect, useState } from 'react';
import { api } from '@/envfile/api';
import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';

function SelectRole({ selectedRole, setSelectedRole }) {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    getAllRoles();
  }, []);

  const getAllRoles = async () => {
    try {
      const response = await axios.get(api + '/admin/role/get');
      setRoles(response.data.roles);
      // console.log(response.data.roles, 'roles fetched');
    } catch (error) {
      console.log(error, 'error fetching roles');
    }
  };

  return (
    <div className='w-full' style={{marginTop:'3vh'}}>
      <Autocomplete
        size="small"
        options={roles}
        getOptionLabel={(option) => option.identifier || ""}
        value={roles.find(role => role.recordId === selectedRole) || null} 
      onChange={(event, newValue) => {
        setSelectedRole(newValue?.recordId); 
      }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Role"
            variant="standard"
          />
        )}
      />
    </div>
  );
}

export default SelectRole;
