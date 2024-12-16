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

const LoanType = () => {
  const [token, setToken] = useState("");
  const [loanTypes, setLoanTypes] = useState([]);
  const [sizePerPage, setSizePerPage] = useState(50);
  const [totalRecord, setTotalRecord] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const deleteStatus = useSelector((state) => state.tasks.deleteStatus);
  const currentPageNumber = useSelector((state) => state.tasks.pageNumber);
  const fetchFilterInputs = useSelector((state) => state.tasks.fetchFilterInput);
  const advanceSearchInputs = useSelector((state) => state.tasks.advanceSearch);

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

  useEffect(() => {
    if (token) fetchLoanTypes();
    if (deleteStatus === "deleted") {
      fetchLoanTypes();
      dispatch(resetDeleteStatus());
    }
  }, [token, currentPageNumber, sizePerPage, fetchFilterInputs, deleteStatus]);

  useEffect(() => {
    if (token) fetchLoanTypes(true);
  }, [advanceSearchInputs]);

  const fetchLoanTypes = async (isAdvanced = false) => {
    setLoading(true);
    setError(null);

    try {
      const headers = { Authorization: `Bearer ${token}` };

      const body = isAdvanced
        ? { page: currentPageNumber, sizePerPage, ...advanceSearchInputs }
        : {
            page: currentPageNumber,
            sizePerPage,
            categories: fetchFilterInputs,
          };

      const response = await axios.post(`${api}/loans/loanType`, body, { headers });

      setLoanTypes(response.data.loanTypeDtoList || []);
      setTotalRecord(response.data.totalRecords);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
      setError("Error fetching loan type data.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(setPageNumber(newPage));
  };

  const handleSizeChange = (event) => {
    const selectedSize = event.target.value;
    setSizePerPage(selectedSize === "all" ? totalRecord : parseInt(selectedSize, 10));
  };

  const addNewRoutePath = "/loans/loanType/add-loanType";
  const breadcrumbs = "Admin > Loan Type";
  const currentPageModelName = "loanType";
  const areSureModal = "delete this item?";
  const exportDownloadContent = [
    { value: "status", label: "Status" },
    { value: "node", label: "Node" },
    { value: "shortDescription", label: "Short Description" },
    { value: "identifier", label: "Identifier" },
  ];
  const areSureModalType = "Delete";
  const apiRoutePath = "loanType";
  const deleteKeyField = "loanTypeDtoList";
  const editNewRoutePath = "/loans/loanType/edit-loanType";

  const startRecord = currentPageNumber * sizePerPage + 1;
  const endRecord = Math.min(startRecord + sizePerPage - 1, totalRecord);

  return (
    <div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Listingpage3cols
        currentPageModelName={currentPageModelName}
        breadcrumbs={breadcrumbs}
        addNewRoutePath={addNewRoutePath}
        fields={fields}
        data={loanTypes}
        currentPage={currentPageNumber}
        sizePerPage={sizePerPage}
        totalPages={totalPages}
        totalRecord={totalRecord}
        onPageChange={handlePageChange}
        onSizeChange={handleSizeChange}
        loading={loading}
        startRecord={startRecord}
        endRecord={endRecord}
        areSureModal={areSureModal}
        areSureModalType={areSureModalType}
        apiRoutePath={apiRoutePath}
        exportDownloadContent={exportDownloadContent}
        deleteKeyField={deleteKeyField}
        editNewRoutePath={editNewRoutePath}
      />
    </div>
  );
};

export default LoanType;
