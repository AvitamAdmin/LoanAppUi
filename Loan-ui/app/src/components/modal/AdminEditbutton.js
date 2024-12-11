import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, TextField, Select, MenuItem } from '@mui/material';

const AdminEditButton = ({ data = [], EditModal, handleCloseEdit, token, api }) => {
  const [formData, setFormData] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (data && data.length > 0) {
      const selectedData = data[selectedIndex];
      if (selectedData) {
        setFormData(selectedData);
      }
    }
  }, [data, selectedIndex]);

  const handleSelectChange = (e) => {
    setSelectedIndex(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooleanChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value === "true" }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${api}/`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      handleCloseEdit();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const renderInputField = (key, value) => {
    if (key === 'creator' || key === 'creationTime' || key === 'lastModified') {
      
      const displayValue =
        key === 'creationTime' || key === 'lastModified'
          ? formatDate(value)
          : value;

      return (
        <TextField
          label={key}
          variant="standard"
          name={key}
          value={displayValue || ''}
          onChange={handleChange}
          className="text-xs"
          InputProps={{ readOnly: true }} 
          
        />
      );
    }

    if (typeof value === 'boolean') {
      return (
        <Select
          value={value ? 'true' : 'false'}
          onChange={(e) => handleBooleanChange(key, e.target.value)}
          variant="outlined"
          className="border-none "

        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      );
    }

    if (typeof value === 'object' && value !== null) {
      return (
        <TextField
          label={key}
          variant="standard"
          name={key}
          value={JSON.stringify(value, null, 2)}
          onChange={handleChange}
          className="text-xs"
          multiline
        />
      );
    }

    return (
      <TextField
        label={key}
        variant="standard"
        name={key}
        value={value || ''}
        onChange={handleChange}
        className="text-xs"
      />
    );
  };

  return (
    <Modal open={EditModal} onClose={handleCloseEdit}>
      <div className="ml-[13%] mr-[1%] flex flex-col animate__animated animate__fadeInDownBig">
        <div className="flex w-full justify-between items-center bg-black text-white p-4 rounded-t-lg">
          <h2 id="modal-title" className="text-lg font-bold">Edit Details</h2>
          <div onClick={handleCloseEdit} className="text-xl font-bold">x</div>
        </div>
        <div className="bg-white w-[100%] rounded-b-lg overflow-hidden shadow-lg p-5">
          
          <div className="grid grid-cols-3 gap-6 w-full">
            {['creator', 'creationTime', 'lastModified'].map((key) => (
              formData[key] && (
                <div key={key} className="col-span-1">
                  {renderInputField(key, formData[key])}
                </div>
              )
            ))}
          </div>

          
          <div className="grid grid-cols-3 gap-6 w-full mt-4">
            {Object.entries(formData)
              .filter(([key]) => key !== 'creator' && key !== 'creationTime' && key !== 'lastModified' && key !== 'id' && key !== 'recordId')
              .map(([key, value]) => (
                <div key={key} className="col-span-1">
                  {renderInputField(key, value)}
                </div>
              ))}
          </div>

          <div className="flex gap-4 items-center w-full flex-row justify-end p-4">
            <div
              onClick={handleCloseEdit}
              className="border p-2 rounded-md text-xs w-[70px] bg-[#2b2b2b] text-white text-center"
            >
              Cancel
            </div>
            <div
              onClick={handleSave}
              className="border p-2 rounded-md text-xs w-[70px] text-white bg-[#cc0001] text-center"
            >
              Save
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AdminEditButton;
