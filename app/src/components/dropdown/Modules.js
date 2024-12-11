import React, { useEffect, useState } from 'react';
import { api } from '@/envfile/api';
import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';
import { getCookie } from "cookies-next";

function SelectModule({ selectedModule, setSelectedModule }) {
    const [modules, setModules] = useState([]);

    useEffect(() => {
        const jwtToken = getCookie("jwtToken");
        getAllModules(jwtToken);
    }, []);

    const getAllModules = async (jwtToken) => {
        try {
            const headers = { Authorization: `Bearer ${jwtToken}` };
            const response = await axios.get(api + '/admin/module/get',{headers});
            setModules(response.data.modules);
            console.log("test" + response.data.modules);

        } catch (error) {
            console.log(error, 'error fetching modules');
        }
    };

    return (
        <div className='w-full' style={{ marginTop: '3vh' }}>
            <Autocomplete
                size="small"
                options={modules}
                getOptionLabel={(option) => option.identifier || ""}
                value={selectedModule}
                onChange={(event, newValue) => {
                    setSelectedModule(newValue ? newValue.recordId : null);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select Module"
                        variant="standard"
                    />
                )}
            />
        </div>
    );
}

export default SelectModule;
