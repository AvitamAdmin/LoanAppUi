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
  setConfigureListingPageModal,
  setPageNumber,
} from "@/app/src/Redux/Slice/slice";

const customer = () => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState([]);
  const [sizePerPage, setSizePerPage] = useState(50);
  const [totalRecord, setTotalRecord] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFilterInputs = useSelector(
    (state) => state.tasks.fetchFilterInput
  );

  const fields = [
    { label: "Name", value: "firstName" },
    { label: "Email", value: "email" },
    { label: "Status", value: "status" },
  ];

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      dispatch(clearAllEditRecordIds());
      dispatch(setConfigureListingPageModal([]));
      return () => {
        // dispatch(setAdvanceFilterOperator('and'))
        dispatch(setAdvanceFilterValue([]));
      }
    }
  }, []);
  const dispatch = useDispatch();
  const deleteStatus = useSelector((state) => state.tasks.deleteStatus);
  const currentpageNumber = useSelector((state) => state.tasks.pageNumber);

  useEffect(() => {
    if (token) {
      fetchDashboardProfile();
    }
    if (deleteStatus === "deleted") {
      fetchDashboardProfile();
      dispatch(resetDeleteStatus()); // Reset deleteStatus after the data is fetched
    }
  }, [token, currentpageNumber, sizePerPage, fetchFilterInputs, deleteStatus]);
  
  const handlePageChange = (newPage) => {
    dispatch(setPageNumber(newPage));
  };

  const fetchDashboardProfile = async () => {
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        page: currentpageNumber,
        sizePerPage: sizePerPage === totalRecord ? totalRecord : sizePerPage,
        dashboardProfiles: fetchFilterInputs,
      };
      const response = await axios.post(`${api}/admin/customer`, body, {
        headers,
      });

      setUser(response.data.customerDtoList || []);
      setTotalRecord(response.data.totalRecords);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError("Error fetching customer data");
    }
  };

  const handleSizeChange = (event) => {
    const selectedSize = event.target.value;
    if (selectedSize === "all") {
      setSizePerPage(totalRecord); // Set to totalRecord to fetch all items
    } else {
      setSizePerPage(parseInt(selectedSize)); // Convert string to number
    }
  };

  const addnewroutepath = "/admin/customer/add-customer";
  const breadscrums = "Admin > Customer";
  const cuurentpagemodelname = "customer";
  const editnewroutepath = "/admin/customer/edit-customer";
  const aresuremodal = "delete this items?";
  const exportDownloadContent = [
    { value: "status", label: "Status" },
    { value: "node", label: "Node" },
    { value: "sourceTargetParamMappings", label: "SourceTargetParamMappings" },
    { value: "dataRelation", label: "DataRelation" },
    { value: "subsidiaries", label: "Subsidiaries" },
    { value: "shortDescription", label: "ShortDescription" },
    { value: "identifier", label: "Identifier" },
  ];
  const aresuremodaltype = "Delete";
  const apiroutepath = "customer";
  const deleteKeyField = "customer";

  const startRecord = currentpageNumber * sizePerPage + 1;
  const endRecord = Math.min(startRecord + sizePerPage - 1, totalRecord);

  return (
    <div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Listingpage3cols
        cuurentpagemodelname={cuurentpagemodelname}
        breadscrums={breadscrums}
        addnewroutepath={addnewroutepath}
        fields={fields} // Pass the field configuration
        data={user}
        currentPage={currentpageNumber}
        sizePerPage={sizePerPage}
        totalPages={totalPages}
        totalRecord={totalRecord}
        onPageChange={handlePageChange}
        onSizeChange={handleSizeChange}
        loading={loading}
        startRecord={startRecord} // Pass calculated startRecord
        endRecord={endRecord} // Pass calculated endRecord
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

export default customer;
