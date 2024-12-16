"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import Listingpage3cols from "@/app/src/components/ListingPageComponents/Listingpage3cols";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAllEditRecordIds,
  resetDeleteStatus,
  setAdvanceFilterValue,
  setPageNumber,
} from "@/app/src/Redux/Slice/slice";

const Role = () => {
  const [token, setToken] = useState("");
  const [role, setRole] = useState([]);
  const [sizePerPage, setSizePerPage] = useState(50);
  const [totalRecord, setTotalRecord] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const currentpageNumber = useSelector((state) => state.tasks.pageNumber);
  const fetchFilterInputs = useSelector((state) => state.tasks.fetchFilterInput);
  const advanceSearchInputs = useSelector((state) => state.tasks.advanceSearch);
  const deleteStatus = useSelector((state) => state.tasks.deleteStatus);

  const fields = [
    { label: "Identifier", value: "identifier" },
    { label: "Short Description", value: "shortDescription" },
    { label: "Status", value: "status" },
  ];

  // Fetch Token on Component Mount
  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      dispatch(clearAllEditRecordIds());
      dispatch(setAdvanceFilterValue([])); // Clear filters on load
    }
  }, []);

  // Fetch Data on Token or Dependencies Change
  useEffect(() => {
    if (token) fetchRole();
    if (deleteStatus === "deleted") {
      fetchRole();
      dispatch(resetDeleteStatus()); // Reset deleteStatus after fetching
    }
  }, [token, currentpageNumber, sizePerPage, fetchFilterInputs, deleteStatus]);

  // Fetch Data on Advanced Search Inputs Change
  useEffect(() => {
    if (token) fetchRole(true);
  }, [advanceSearchInputs]);

  // Fetch Role Data Function
  const fetchRole = async (isAdvance = false) => {
    setLoading(true);
    setError(null);

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = isAdvance
        ? {
            page: currentpageNumber,
            sizePerPage: sizePerPage === totalRecord ? totalRecord : sizePerPage,
            ...advanceSearchInputs,
          }
        : {
            page: currentpageNumber,
            sizePerPage: sizePerPage === totalRecord ? totalRecord : sizePerPage,
            roles: fetchFilterInputs,
          };

      const response = await axios.post(`${api}/admin/role`, body, { headers });

      setRole(response.data.roles || []);
      setTotalRecord(response.data.totalRecords || 0);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError("Error fetching role data");
    } finally {
      setLoading(false);
    }
  };

  // Handle Page Change
  const handlePageChange = (newPage) => {
    dispatch(setPageNumber(newPage));
  };

  // Handle Size Change
  const handleSizeChange = (event) => {
    const selectedSize = event.target.value;
    setSizePerPage(selectedSize === "all" ? totalRecord : parseInt(selectedSize));
  };

  // Calculate Start and End Records
  const startRecord = (currentpageNumber - 1) * sizePerPage + 1;
  const endRecord = Math.min(startRecord + sizePerPage - 1, totalRecord);

  // Configurations for Listingpage3cols
  const addnewroutepath = "/admin/role/add-role";
  const breadscrums = "Admin > Role";
  const cuurentpagemodelname = "Role";
  const editnewroutepath = "/admin/role/edit-role";
  const aresuremodal = "delete this item?";
  const exportDownloadContent = [
    { value: "status", label: "Status" },
    { value: "node", label: "Node" },
    { value: "sourceTargetParamMappings", label: "SourceTargetParamMappings" },
    { value: "role", label: "Role" },
    { value: "subsidiaries", label: "Subsidiaries" },
    { value: "shortDescription", label: "Short Description" },
    { value: "identifier", label: "Identifier" },
  ];
  const aresuremodaltype = "Delete";
  const apiroutepath = "role";
  const deleteKeyField = "role";

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      <Listingpage3cols
        cuurentpagemodelname={cuurentpagemodelname}
        addnewroutepath={addnewroutepath}
        breadscrums={breadscrums}
        fields={fields}
        data={role}
        currentPage={currentpageNumber}
        sizePerPage={sizePerPage}
        totalPages={totalPages}
        totalRecord={totalRecord}
        onPageChange={handlePageChange}
        onSizeChange={handleSizeChange}
        loading={loading}
        startRecord={startRecord}
        endRecord={endRecord}
        aresuremodal={aresuremodal}
        aresuremodaltype={aresuremodaltype}
        editnewroutepath={editnewroutepath}
        apiroutepath={apiroutepath}
        exportDownloadContent={exportDownloadContent}
        deleteKeyField={deleteKeyField}
      />
    </div>
  );
};

export default Role;
