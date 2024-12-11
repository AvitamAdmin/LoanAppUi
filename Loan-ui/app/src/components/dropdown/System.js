import React, { useEffect, useState } from "react";
import { api } from "@/envfile/api";
import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { getCookie } from "cookies-next";

function System({ selectedSystem, setSelectedSystem }) {
    const [systems, setSystems] = useState([]);

    useEffect(() => {
    const token = getCookie("jwtToken");
    if (token) {
        getAllSystem(token);
    }
    }, []);

    const getAllSystem = async (token) => {
        try {
            const headers = { Authorization: "Bearer " + token };
            const response = await axios.get(api + '/admin/system/get', {
                headers,
              });
            setSystems(response.data.systems);
        } catch (error) {
            console.log(error, 'error fetching system');
        }
    };

    return (
        <div className='w-full' style={{ marginTop: '3vh' }}>
            <Autocomplete
                size="small"
                options={systems}
                getOptionLabel={(option) => option.identifier || ""}
                value={selectedSystem}
                onChange={(event, newValue) => {
                    setSelectedSystem(newValue ? newValue.recordId : null);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select System"
                        variant="standard"
                    />
                )}
            />
        </div>
    );
}

export default System;
