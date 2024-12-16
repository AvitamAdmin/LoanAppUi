"use client";
import React, { useEffect, useState, useCallback } from "react";
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

const LoanLimit = () => {
  const [token, setToken] = useState("");
  const [loanLimit, setLoanLimit] = useState([]);
  const [sizePerPage, setSizePerPage] = useState(50);
  const [totalRecord, setTotalRecord] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFilterInputs = useSelector((state) => state.tasks.fetchFilterInput);
  const advanceSearchInputs = useSelector((state) => state.tasks.advanceSearch);
  const deleteStatus = useSelector((state) => state.tasks.deleteStatus);
  const currentPageNumber = useSelector((state) => state.tasks.pageNumber);
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
      return () => {
        dispatch(setAdvanceFilterValue([]));
      };
    }
  }, [dispatch]);

  const fetchModel = useCallback(
    async (isAdvance = false) => {
      setLoading(true);
      setError(null);
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const body = isAdvance
          ? { page: currentPageNumber, sizePerPage, ...advanceSearchInputs }
          : { page: currentPageNumber, sizePerPage, loanLimitDtos: fetchFilterInputs };

        const response = await axios.post(`${api}/loans/loanLimit`, body, { headers });

        setLoanLimit(response.data.loanLimitDtos || []);
        setTotalRecord(response.data.totalRecords);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError("Error fetching model data");
      }
    },
    [token, currentPageNumber, sizePerPage, fetchFilterInputs, advanceSearchInputs]
  );

  useEffect(() => {
    if (token) fetchModel();
  }, [token, fetchModel]);

  useEffect(() => {
    if (deleteStatus === "deleted") {
      fetchModel();
      dispatch(resetDeleteStatus());
    }
  }, [deleteStatus, fetchModel, dispatch]);

  useEffect(() => {
    if (token) fetchModel(true);
  }, [advanceSearchInputs, fetchModel, token]);

  const handlePageChange = (newPage) => {
    dispatch(setPageNumber(newPage));
  };

  const handleSizeChange = (event) => {
    const selectedSize = event.target.value;
    setSizePerPage(selectedSize === "all" ? totalRecord : parseInt(selectedSize));
  };

  const addnewroutepath = "/loans/loanLimit/add-loanLimit";
  const breadcrumbs = "Admin > Loan Limit";
  const currentModelName = "loanLimit";
  const areYouSureModal = "Delete this item?";
  const exportDownloadContent = [
    { value: "status", label: "Status" },
    { value: "node", label: "Node" },
    { value: "sourceTargetParamMappings", label: "Source Target Param Mappings" },
    { value: "dataRelation", label: "Data Relation" },
    { value: "subsidiaries", label: "Subsidiaries" },
    { value: "shortDescription", label: "Short Description" },
    { value: "identifier", label: "Identifier" },
  ];

  const startRecord = (currentPageNumber - 1) * sizePerPage + 1;
  const endRecord = Math.min(startRecord + sizePerPage - 1, totalRecord);

  return (
    <div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Listingpage3cols
        currentPageModelName={currentModelName}
        breadcrumbs={breadcrumbs}
        addnewroutepath={addnewroutepath}
        fields={fields}
        data={loanLimit}
        currentPage={currentPageNumber}
        sizePerPage={sizePerPage}
        totalPages={totalPages}
        totalRecord={totalRecord}
        onPageChange={handlePageChange}
        onSizeChange={handleSizeChange}
        loading={loading}
        startRecord={startRecord}
        endRecord={endRecord}
        areYouSureModal={areYouSureModal}
        exportDownloadContent={exportDownloadContent}
        deleteKeyField="loanLimitDtos"
        editNewRoutePath="/loans/loanLimit/edit-loanLimit"
      />
    </div>
  );
};

export default LoanLimit;
