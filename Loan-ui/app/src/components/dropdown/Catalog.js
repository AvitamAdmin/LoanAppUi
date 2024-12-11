import React, { useEffect, useState } from 'react';
import { api } from '@/envfile/api';
import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';
import { getCookie } from "cookies-next";

function SelectCatalog({ selectedCatalog, setSelectedCatalog }) {
    const [catalogs, setCatalogs] = useState([]);

    useEffect(() => {
        const jwtToken = getCookie("jwtToken");
        getAllCatalogs(jwtToken);
    }, []);

    const getAllCatalogs = async (jwtToken) => {
        try {
            const headers = { Authorization: `Bearer ${jwtToken}` };
            const response = await axios.get(api + '/admin/catalog/get',{headers});
            setCatalogs(response.data.catalogs);
            console.log("test" + response.data.catalogs);

        } catch (error) {
            console.log(error, 'error fetching catalogs');
        }
    };

    return (
        <div className='w-full' style={{ marginTop: '3vh' }}>
            <Autocomplete
                size="small"
                options={catalogs}
                getOptionLabel={(option) => option.identifier}
                value={selectedCatalog}
                onChange={(event, newValue) => {
                    setSelectedCatalog(newValue.recordId);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select Catalog"
                        variant="standard"
                    />
                )}
            />
        </div>
    );
}

export default SelectCatalog;
