// import { api } from "@/envfile/api";
// import { Autocomplete, TextField } from "@mui/material";
// import { getCookie } from "cookies-next";
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Category = ({
//   setCategory,
//   selectedCategory,
//   dropdownname,
//   isMultiple = false,
// }) => {
//   const [categoryList, setCategoryList] = useState([]);

//   useEffect(() => {
//     const token = getCookie("jwtToken");
//     if (token) {
//       fetchCategoryData(token);
//     }
//   }, []);

//   const fetchCategoryData = async (token) => {
//     try {
//       const headers = { Authorization: `Bearer ${token}` };
//       const response = await axios.get(`${api}/admin/category/get`, {
//         headers,
//       });
//       setCategoryList(response.data.categories);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const handleCategoryChange = (event, newValue) => {
//     const value = isMultiple
//       ? newValue.map((val) => val.recordId)
//       : newValue?.recordId || "";

//     setCategory(value);
//   };

//   return (
//     <div style={{ marginTop: "2.5vh" }}>
//       <Autocomplete
//         multiple={isMultiple}
//         options={categoryList}
//         getOptionLabel={(option) => option.identifier || ""}
//         value={
//           isMultiple
//             ? categoryList.filter((cat) =>
//                 selectedCategory.includes(cat.recordId)
//               )
//             : categoryList.find((cat) => cat.recordId === selectedCategory) ||
//               null
//         }
//         onChange={handleCategoryChange}
//         renderInput={(params) => (
//           <TextField {...params} variant="standard" label={dropdownname} />
//         )}
//         isOptionEqualToValue={(option, value) =>
//           option.recordId === value?.recordId
//         }
//       />
//     </div>
//   );
// };

// export default Category;


import { api } from "@/envfile/api";
import { Autocomplete, TextField } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Category = ({
  setCategory,
  selectedCategory,
  dropdownname = "Select Category", // Default label
  isMultiple = false,
  initialload = false, // Control initial data load
}) => {
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false); // Track loading state

  useEffect(() => {
    if (initialload) {
      const token = getCookie("jwtToken");
      if (token) fetchCategoryData(token); // Fetch data on initial load if enabled
    }
  }, [initialload]);

  const fetchCategoryData = async (token) => {
    setLoading(true); // Set loading state
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${api}/admin/category/get`, {
        headers,
      });
      setCategoryList(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleCategoryChange = (event, newValue) => {
    const value = isMultiple
      ? newValue.map((val) => val.recordId)
      : newValue?.recordId || "";
    setCategory(value);
  };

  return (
    <div style={{ marginTop: "2.5vh" }}>
      <Autocomplete
        multiple={isMultiple}
        options={categoryList}
        getOptionLabel={(option) => option.identifier || ""}
        value={
          isMultiple
            ? categoryList.filter((cat) =>
                selectedCategory.includes(cat.recordId)
              )
            : categoryList.find((cat) => cat.recordId === selectedCategory) ||
              null
        }
        onChange={handleCategoryChange}
        onOpen={() => {
          if (!initialload && categoryList.length === 0) {
            const token = getCookie("jwtToken");
            if (token) fetchCategoryData(token); // Fetch data when dropdown opens
          }
        }}
        loading={loading}
        isOptionEqualToValue={(option, value) =>
          option.recordId === value?.recordId
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={dropdownname} // Customizable label
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

export default Category;
