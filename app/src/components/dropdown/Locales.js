// import { Autocomplete, TextField } from "@mui/material";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { getCookie } from "cookies-next";
// import { api } from "@/envfile/api";

// const LocalesDropdown = ({ setLocales, locales }) => {
//   const [localesList, setLocalesList] = useState([]); // Manage list of locales

//   useEffect(() => {
//     const token = getCookie("jwtToken");
//     if (token) {
//       getLocalesData(token); // Fetch locales data when token is available
//     }
//   }, []);

//   const getLocalesData = async (token) => {
//     try {
//       const headers = { Authorization: `Bearer ${token}` };
//       const response = await axios.get(`${api}/admin/user/add`, { headers });
//       setLocalesList(response.data.locales);
//     } catch (error) {
//       console.log("Error fetching locales:", error);
//     }
//   };

  
//   const handleLocaleChange = (event, newValue) => {
//     setLocales(newValue); // newValue is the array of selected locales
//   };
  

//   return (
//     <div className="flex flex-col w-full">
//       <Autocomplete
//   options={localesList}
//   value={locales || null} // Set value to a single locale or null
//   onChange={handleLocaleChange}
//   renderInput={(params) => (
//     <TextField
//       {...params}
//       className="text-xs w-full"
//       style={{ marginTop: "2.5vh" }}
//       variant="standard"
//       label="Select Locale"
//     />
//   )}
// />
//     </div>
//   );
// };

// export default LocalesDropdown;





import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { api } from "@/envfile/api";

const LocalesDropdown = ({
  setLocales,
  locales,
  initialload = false,
  dropdownName = "Select Locale", // Default label
}) => {
  const [localesList, setLocalesList] = useState([]); // Manage locales list
  const [loading, setLoading] = useState(false); // Track loading state

  useEffect(() => {
    if (initialload) {
      fetchLocalesData(); // Fetch on initial load if enabled
    }
  }, [initialload]);

  const fetchLocalesData = async () => {
    setLoading(true); // Set loading state to true
    const token = getCookie("jwtToken");
    try {
      if (token) {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${api}/admin/user/add`, { headers });

        // Sort locales alphabetically before setting the state
        const sortedLocales = (response.data.locales || []).sort((a, b) =>
          a.localeCompare(b)
        );

        setLocalesList(sortedLocales);
      }
    } catch (error) {
      console.error("Error fetching locales:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleLocaleChange = (event, newValue) => {
    setLocales(newValue || null); // Handle locale selection
  };

  return (
    <div className="w-full">
      <Autocomplete
        size="small"
        options={localesList}
        getOptionLabel={(option) => option || ""} // Assuming options are strings
        value={locales || null} // Selected value
        onChange={handleLocaleChange}
        onOpen={() => {
          if (!initialload && localesList.length === 0) {
            fetchLocalesData(); // Fetch data on dropdown open if not preloaded
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

export default LocalesDropdown;
