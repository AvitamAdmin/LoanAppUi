import { TextField, MenuItem, Modal, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaSearchPlus } from "react-icons/fa";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import "tailwind-scrollbar";
import axios from "axios";
import { getCookie } from "cookies-next";
import { api } from "@/envfile/api";
import { useDispatch, useSelector } from "react-redux";
import { setAdvanceFilterValue, sethighlightSearchQuery } from "../../Redux/Slice/slice";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
const comparators = [
  { label: "Contains", value: "contains" },
  { label: "Equals", value: "equals" },
];

const dynamicSkelton = { attribute: "", comparator: "", value: "" };

const AdvanceSearch = ({
  isOpen,
  handleClose,
  apiroutepath,
  deleteKeyField,
}) => {
  const jwtToken = getCookie("jwtToken");
  const dispatch = useDispatch();
  const [staticFilters, setStaticFilters] = useState([]);
  const [dynamicLabels, setDynamicLabels] = useState([]);
  const [operator, setOperator] = useState("and");
  const [dynamicFilters, setDynamicFilters] = useState([{ ...dynamicSkelton }]);
  const [tabSwitch, setTabSwitch] = useState(true);
  const [savedQuery, setsavedQuery] = useState([]);
  const [selectedQueries, setSelectedQueries] = useState(null);
  const highlightSearchQuery = useSelector((state) => state.tasks.highlightSearchQuery);


  useEffect(() => {
    const getData = async () => {
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const response = await axios.get(
        `${api}/admin/${apiroutepath}/getAdvancedSearch`,
        {
          headers,
        }
      );
      const apiResponse = response?.data;

      // Separate static and dynamic attributes
      const staticAttributes = apiResponse.filter(
        (filter) => !filter.dynamicAttr
      );
      const dynamicAttributes = apiResponse.filter(
        (filter) => filter.dynamicAttr
      );

      // Initialize filter states
      setStaticFilters(
        staticAttributes.map((filter) => ({
          ...filter,
          comparator: "",
          value: "",
        }))
      );

      setDynamicLabels(
        dynamicAttributes.map((filter) => ({
          ...filter,
          comparator: "",
          value: "",
        }))
      );
    };

    getData();
  }, []);
  useEffect(() => {
    const getListPageData = async () => {
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = {
        page: 0,
        sizePerPage: 50,
      };
      const response = await axios.post(`${api}/admin/${apiroutepath}`, body, {
        headers,
      });
      const apiResponse = response.data.savedQuery;
      setsavedQuery(response.data.savedQuery);
      console.log(response.data.savedQuery, "savedQuery savedQuery");
    };

    getListPageData();
  }, []);

  const closeModal = () => {
    handleClose(false);
  };

  const addFilter = () => {
    setDynamicFilters([...dynamicFilters, { ...dynamicSkelton }]);
  };

  const removeFilter = (indexToRemove) => {
    setDynamicFilters((prevFilters) =>
      prevFilters.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSearch = () => {
    // Format data for submission
    const allFilters = [...staticFilters, ...dynamicFilters];

    // Filter and format valid filters
    const validFilters = allFilters
      .filter((item) => item?.value !== null && item?.value !== "")
      .map((item) => ({
        [item.attribute]: `${item.value}|${item.comparator}`,
      }));

    // Merge all valid filters into a single object
    const singleObject = validFilters.reduce((acc, curr) => {
      Object.keys(curr).forEach((key) => {
        acc[key] = curr[key]; // Add/merge the key-value pairs
      });
      return acc;
    }, {});
    // Construct the payload with "mapping" as the key
    const payload = {
      [deleteKeyField]: [singleObject],
      operator: operator,
    };
    console.log(apiroutepath, "apiroutepath apiroutepath");

    console.log(payload, "apiroutepath payload");
    dispatch(setAdvanceFilterValue(payload));
    // Debugging log
    handleClose(false);
  };

  const handleFilterChange = (index, type, field, value) => {
    const filters =
      type === "static" ? [...staticFilters] : [...dynamicFilters];
    filters[index][field] = value;

    if (type === "static") setStaticFilters(filters);
    else setDynamicFilters(filters);
  };

  const handleQueryClick = (queries,identifier) => {
    // Format the queries content into the desired structure

    const formattedQueries = {
      [deleteKeyField]: queries.map((query) => ({
        [query.attribute]: `${query.value}|${query.condition}`,
      })),
      operator: "or", // Defaulting to "or", modify if dynamic
    };
    setSelectedQueries(formattedQueries);
    dispatch(sethighlightSearchQuery(identifier));

  };
  const handleSaveQuery = ()=>{
    dispatch(setAdvanceFilterValue(selectedQueries));
    console.log(selectedQueries,"selectedQueries selectedQueries");
    handleClose(false);
  }

  const handleDelete = async (id) => {
    const headers = { Authorization: `Bearer ${jwtToken}` };
    const body = {recordId:`${id}`};
    const response = await axios.post(`${api}/admin/savedquery/delete`, body, {
      headers,
    });
    console.log(response.data.savedQuery, "savedQuery savedQuery");
  };
  
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      className="flex flex-col w-full  justify-center items-center backdrop-blur-sm p-2"
    >
      <div className="flex flex-col bg-gray-300  w-[70%] max-h-[700px] bg-transparent justify-center items-center">
        <div className="w-full flex flex-row justify-between items-center p-3 rounded-t-lg bg-black">
          <div className="text-white text-md">Advance Search</div>
          <div
            className="text-end cursor-pointer flex flex-row"
            onClick={closeModal}
          >
            <IoClose className="text-xl text-white" />
          </div>
        </div>
        <div className="w-full bg-gray-300  p-2 flex flex-row justify-between items-center ">
          <div
            onClick={() => {
              setTabSwitch(true);
            }}
            className={` cursor-pointer rounded-l-md px-3 py-2 w-[50%] text-center   ${
              tabSwitch === true
                ? "bg-[#1581ED] text-white"
                : "bg-white text-black"
            }`}
          >
            Advance Search
          </div>
          <div
            onClick={() => {
              setTabSwitch(false);
            }}
            className={` px-3 py-2 w-[50%] rounded-r-md cursor-pointer text-center ${
              tabSwitch === false
                ? "bg-[#1581ED] text-white"
                : "bg-white text-black"
            }`}
          >
            Saved Queries
          </div>
        </div>
        {tabSwitch === true ? (
          <div className="bg-gray-300 w-[100%] pb-4 flex flex-col rounded-b-xl gap-4 h-auto max-h-[600px]">
            {/* Modal Header */}

            {/* Content Section */}
            <div className="p-2  overflow-y-auto ">
              <div className="   py-0 mt-4 w-full flex items-center justify-center gap-5 flex-col">
                {staticFilters.map((item, index) => {
                  return (
                    <div className="flex items-center w-full gap-2">
                      <label className="w-[30%] p-2 border border-[#C5C5C5] rounded-md bg-white h-[50px] flex items-center">
                        {item.label}
                      </label>
                      <TextField
                        className="text-xs w-[30%] bg-white"
                        id="standard-select-file-format"
                        label="Select Comparator"
                        select
                        value={item?.comparator}
                        sx={{
                          height: "50px",
                          borderRadius: "4px",
                          "& .MuiInputBase-root": {
                            height: "50px",
                          },
                        }}
                        onChange={(e) =>
                          handleFilterChange(
                            index,
                            "static",
                            "comparator",
                            e.target.value
                          )
                        }
                      >
                        {comparators.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      <input
                        type="text"
                        placeholder="Enter search text"
                        className="w-[40%] p-2 border rounded-md h-[50px]"
                        value={item.value}
                        onChange={(e) =>
                          handleFilterChange(
                            index,
                            "static",
                            "value",
                            e.target.value
                          )
                        }
                      />
                      <span className="w-[24px]"></span>
                    </div>
                  );
                })}
                {dynamicFilters.map((item, index) => (
                  <div
                    key={item?.id}
                    className="flex items-center w-full gap-2"
                  >
                    <TextField
                      className="text-xs w-[30%] bg-white"
                      label="Select Attribute"
                      select
                      key={`attribute-${item.id}`}
                      value={item?.attribute}
                      sx={{
                        height: "50px",
                        borderRadius: "4px",
                        "& .MuiInputBase-root": {
                          height: "50px",
                        },
                      }}
                      onChange={(e) => {
                        handleFilterChange(
                          index,
                          "dynamic",
                          "attribute",
                          e.target.value
                        );
                      }}
                    >
                      {dynamicLabels?.map((option) => (
                        <MenuItem
                          key={`${item?.id}-${option.attribute}`}
                          value={option.attribute}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      className="text-xs w-[30%] bg-white"
                      label="Select Comparator"
                      select
                      key={`comparator-${item.id}`}
                      value={item?.comparator}
                      sx={{
                        height: "50px",
                        borderRadius: "4px",
                        "& .MuiInputBase-root": {
                          height: "50px",
                        },
                      }}
                      onChange={(e) =>
                        handleFilterChange(
                          index,
                          "dynamic",
                          "comparator",
                          e.target.value
                        )
                      }
                    >
                      {comparators.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                    <input
                      type="text"
                      placeholder="Enter search text"
                      className="w-[40%] p-2 border rounded-md h-[50px]"
                      value={item?.value}
                      onChange={(e) =>
                        handleFilterChange(
                          index,
                          "dynamic",
                          "value",
                          e.target.value
                        )
                      }
                    />
                    <IconButton
                      style={{
                        backgroundColor:
                          index === dynamicFilters.length - 1
                            ? "#28a745"
                            : "#ff4d4f",
                        color: "#fff",
                        borderRadius: "20%",
                        padding: "4px",
                      }}
                      onClick={() =>
                        index === dynamicFilters.length - 1
                          ? addFilter()
                          : removeFilter(index)
                      }
                    >
                      {index === dynamicFilters.length - 1 ? (
                        <AddIcon sx={{ fontSize: "12px" }} />
                      ) : (
                        <RemoveIcon sx={{ fontSize: "12px" }} />
                      )}
                    </IconButton>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mr-6">
              <span>Global Operator</span>
              <TextField
                className="text-xs  bg-white w-[100px]"
                id="standard-select-file-format"
                label=""
                select
                value={operator}
                sx={{
                  width: "100px",
                  height: "30px",
                  borderRadius: "4px",
                  "& .MuiInputBase-root": {
                    height: "30px",
                  },
                }}
                onChange={(e) => {
                  setOperator(e.target.value);
                  // dispatch(setAdvanceFilterOperator(e.target.value));
                }}
              >
                {[
                  { label: "And", value: "and" },
                  { label: "Or", value: "or" },
                ].map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="w-full flex flex-row px-[10px] gap-5 justify-between  py-0">
            <div
                className="bg-[#28a746] w-[50%] hover:bg-[#1d8034] transition-all ease-in-out  cursor-pointer items-center gap-2 text-white text-sm  px-0 py-[10px] rounded-md flex justify-center"
                onClick={handleSearch}
              >
                <TaskAltIcon className="text-white" />
                Save Query
              </div>
              <div
                className="bg-[#4d4d4d] w-[50%] cursor-pointer items-center gap-2 text-white text-sm  px-0 py-[10px] rounded-md flex justify-center"
                onClick={handleSearch}
              >
                <FaSearchPlus className="text-white text-xl" />
                Search
              </div>
              
            </div>
          </div>
        ) : (
          <div className=" bg-gray-300 rounded-b-xl p-2 gap-5 w-full">
           <div className="overflow-y-auto  gap-5 overflow-hidden mb-3 min-h-[500px]  max-h-[528px] flex flex-col ">
           {savedQuery.map((item, id) => {
              return (
                <div key={id}           onClick={() => handleQueryClick(item.queries,item.identifier)}
                className={`flex flex-row justify-between  cursor-pointer rounded-md ${highlightSearchQuery === item.identifier ? "bg-blue-400" : "bg-white"} p-2 w-full`}>
                 
                  <div className="w-[47%] border-gray-600 border-r-2 text-start">{item.identifier}</div>
                  <div className="w-[45%] text-start  ">{item.shortDescription}</div>
                  <div className="w-[5%]" onClick={()=>{
                    handleDelete(item.recordId)
                  }}>
                    <RemoveCircleIcon className="text-red-500"/>
                  </div>
                </div>
              );
            })}
           </div>
            <div
                className="bg-[#28a746] w-[100%] hover:bg-[#1d8034]  transition-all cursor-pointer items-center gap-2 text-white text-sm  px-0 py-[10px] rounded-md flex justify-center"
                onClick={handleSaveQuery}
              >
                <TaskAltIcon className="text-white" />
                Apply
              </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AdvanceSearch;
