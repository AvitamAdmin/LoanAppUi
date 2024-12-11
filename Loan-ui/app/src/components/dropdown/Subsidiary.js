// import React, { useEffect, useState } from "react";
// import { Autocomplete, TextField } from "@mui/material";
// import axios from "axios";
// import { api } from "@/envfile/api";

// function SingleSelectSubsidiary({ selectedSubsidiary, setSelectedSubsidiary }) {
//   const [subsidiary, setSubsidiary] = useState([]);

//   useEffect(() => {
//     getAllSubsidiaries();
//   }, []);

//   const getAllSubsidiaries = async () => {
//     try {
//       const response = await axios.get(api + "/admin/subsidiary/get");
//       setSubsidiary(response.data.subsidiaries || []);
//     } catch (error) {
//       console.log(error, "error fetching subsidiaries");
//     }
//   };

//   return (
//     <div className='w-full'>
//       <Autocomplete
//         size="small"
//         options={subsidiary}
//         getOptionLabel={(option) => option?.identifier || ''}
//         value={subsidiary.find((sub) => sub.recordId === selectedSubsidiary) || null} // Set the value correctly
//         onChange={(event, newValue) => {
//           setSelectedSubsidiary(newValue ? newValue.recordId : null); // Clear selection if no value is selected
//         }}
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             label="Select Subsidiary"
//             variant="standard"
//           />
//         )}
//       />
//     </div>
//   );
// }

// export default SingleSelectSubsidiary;



// // import React, { useState } from "react";
// // import { Autocomplete, TextField } from "@mui/material";
// // import axios from "axios";
// // import { api } from "@/envfile/api";

// // function SingleSelectSubsidiary({ selectedSubsidiary, setSelectedSubsidiary }) {
// //   const [subsidiary, setSubsidiary] = useState([]);
// //   const [loading, setLoading] = useState(false); // To track if data is being loaded

// //   const getAllSubsidiaries = async () => {
// //     try {
// //       setLoading(true); // Start loading
// //       const response = await axios.get(api + "/admin/subsidiary/get");
// //       setSubsidiary(response.data.subsidiaries || []);
// //     } catch (error) {
// //       console.log(error, "error fetching subsidiaries");
// //     } finally {
// //       setLoading(false); // Stop loading after the API call
// //     }
// //   };

// //   return (
// //     <div className="w-full">
// //       <Autocomplete
// //         size="small"
// //         options={subsidiary}
// //         getOptionLabel={(option) => option?.identifier || ""}
// //         value={subsidiary.find((sub) => sub.recordId === selectedSubsidiary) || null} // Set the value correctly
// //         onChange={(event, newValue) => {
// //           setSelectedSubsidiary(newValue ? newValue.recordId : null); // Clear selection if no value is selected
// //         }}
// //         onOpen={() => {
// //           if (subsidiary.length === 0) {
// //             getAllSubsidiaries(); // Fetch data only when the dropdown is opened
// //           }
// //         }}
// //         loading={loading} // Optional: Shows loading indicator if data is being fetched
// //         renderInput={(params) => (
// //           <TextField
// //             {...params}
// //             label="Select Subsidiary"
// //             variant="standard"
// //             InputProps={{
// //               ...params.InputProps,
// //               endAdornment: (
// //                 <>
// //                   {loading ? <span>Loading...</span> : null}
// //                   {params.InputProps.endAdornment}
// //                 </>
// //               ),
// //             }}
// //           />
// //         )}
// //       />
// //     </div>
// //   );
// // }

// // export default SingleSelectSubsidiary;

import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { api } from "@/envfile/api";

function SingleSelectSubsidiary({
  selectedSubsidiary,
  setSelectedSubsidiary,
  initialload = false,
  dropdownName = "Select Subsidiary", // Default value if no name is provided
}) {
  console.log("selectedSubsidiary fetching subsidiaries:", selectedSubsidiary);

  const [subsidiary, setSubsidiary] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialload) {
      getAllSubsidiaries();
    }
  }, [initialload]);

  const getAllSubsidiaries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(api + "/admin/subsidiary/get");
      setSubsidiary(response.data.subsidiaries || []);
    } catch (error) {
      console.error("Error fetching subsidiaries:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Autocomplete
        size="small"
        options={subsidiary}
        getOptionLabel={(option) => option?.identifier || ""}
        value={subsidiary.find((sub) => sub.recordId === selectedSubsidiary) || null}
        onChange={(event, newValue) => {
          setSelectedSubsidiary(newValue ? newValue.recordId : null);
        }}
        onOpen={() => {
          if (!initialload && subsidiary.length === 0) {
            getAllSubsidiaries();
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
}

export default SingleSelectSubsidiary;
