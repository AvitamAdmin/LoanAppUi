import { api } from '@/envfile/api';
import { TextField, MenuItem } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Fileformat({ selectedFormat, setSelectedFormat }) {
  const [fileFormats, setFileFormats] = useState([
    {
      value: 'Excel',
      label: 'Excel',
    },
    {
      value: 'PDF',
      label: 'PDF',
    },
    {
      value: 'XML',
      label: 'XML',
    },
    {
      value: 'JSON',
      label: 'JSON',
    },
    {
      value: 'CSV',
      label: 'CSV',
    },
    {
      value: 'UI',
      label: 'UI',
    },
  ]);


  return (
    <div className="w-full">
      <TextField
        className="text-xs w-full"
        id="standard-select-file-format"
        label="File Format"
        select
        value={selectedFormat}
        onChange={(e) => setSelectedFormat(e.target.value)}
        variant="standard"
      >
        <MenuItem value="" disabled>
          Please Select the File Format
        </MenuItem>
        {fileFormats.length > 0 ? (
          fileFormats.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))
        ) : (
          <MenuItem value="None" disabled>
            No file formats available
          </MenuItem>
        )}
      </TextField>
    </div>
  );
}

export default Fileformat;
