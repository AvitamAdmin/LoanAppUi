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

const LoanScoreResult = () => {
  const [token, setToken] = useState("");
  const [loanScoreResult, setLoanScoreResult] = useState([]);
  const [sizePerPage, setSizePerPage] = useState(50);
  const [totalRecord, setTotalRecord] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFilterInputs = useSelector((state) => state.tasks.fetchFilterInput);
  const advanceSearchInputs = useSelector((state) => state.tasks.advanceSearch);
  const currentpageNumber = useSelector((state) => state.tasks.pageNumber);
  const deleteStatus = useSelector((state) => state.tasks.deleteStatus);
  const dispatch = useDispatch();

  const fields = [
    { label: "Name", value: "name" },
    { label: "Description", value: "description" },
    { label: "Status", value: "status" },
  ];

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      dispatch(clearAllEditRecordIds());
      dispatch(setConfigureListingPageModal([]));
    }
    return () => {
      dispatch(setAdvanceFilterValue([]));
    };
  }, [dispatch]);

  useEffect(() => {
    if (token) fetchData();
    if (deleteStatus === "deleted") {
      fetchData();
      dispatch(resetDeleteStatus());
    }
  }, [token, currentpageNumber, sizePerPage, fetchFilterInputs, deleteStatus, advanceSearchInputs]);

  const fetchData = async (isAdvance = false) => {
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
            loanScoreDtos: fetchFilterInputs,
          };

      const response = await axios.post(`${api}/loans/loanScoreResult`, body, {
        headers,
      });

      setLoanScoreResult(response.data.loanScoreDtos || []);
      setTotalRecord(response.data.totalRecords || 0);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError("Error fetching loan score result data.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(setPageNumber(newPage));
  };

  const handleSizeChange = (event) => {
    const selectedSize = event.target.value;
    if (selectedSize === "all") {
      setSizePerPage(totalRecord);
    } else {
      setSizePerPage(parseInt(selectedSize, 10));
    }
  };

  const addnewroutepath = "/loans/loanScoreResult/add-loanScoreResult";
  const breadscrums = "Admin > Loan Score Result";
  const cuurentpagemodelname = "Loan Score Result";
  const aresuremodal = "Are you sure you want to delete this item?";
  const exportDownloadContent = [
    { value: "status", label: "Status" },
    { value: "node", label: "Node" },
    { value: "sourceTargetParamMappings", label: "Source Target Param Mappings" },
    { value: "dataRelation", label: "Data Relation" },
    { value: "subsidiaries", label: "Subsidiaries" },
    { value: "shortDescription", label: "Short Description" },
    { value: "identifier", label: "Identifier" },
  ];
  const aresuremodaltype = "Delete";
  const apiroutepath = "loanScoreResult";
  const deleteKeyField = "loanScoreDtos";
  const editnewroutepath = "/loans/loanScoreResult/edit-loanScoreResult";

  const startRecord = (currentpageNumber - 1) * sizePerPage + 1;
  const endRecord = Math.min(startRecord + sizePerPage - 1, totalRecord);

  return (
    <div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Listingpage3cols
        cuurentpagemodelname={cuurentpagemodelname}
        breadscrums={breadscrums}
        addnewroutepath={addnewroutepath}
        fields={fields}
        data={loanScoreResult}
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
        apiroutepath={apiroutepath}
        exportDownloadContent={exportDownloadContent}
        deleteKeyField={deleteKeyField}
        editnewroutepath={editnewroutepath}
      />
    </div>
  );
};

export default LoanScoreResult;
