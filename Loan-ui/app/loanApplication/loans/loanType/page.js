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

const loanType = () => {
  const [token, setToken] = useState("");
  const [loanTypes, setloanTypes] = useState([]);
  const [sizePerPage, setSizePerPage] = useState(50);
  const [totalRecord, setTotalRecord] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchFilterInputs = useSelector(
    (state) => state.tasks.fetchFilterInput
  );
  const dispatch = useDispatch();
  const deleteStatus = useSelector((state) => state.tasks.deleteStatus);
  const currentpageNumber = useSelector((state) => state.tasks.pageNumber);

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
        // dispatch(setAdvanceFilterOperator('and'))
        dispatch(setAdvanceFilterValue([]));
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchloanType();
    }
    if (deleteStatus === "deleted") {
      fetchloanType();
      dispatch(resetDeleteStatus()); // Reset deleteStatus after the data is fetched
    }
  }, [token, currentpageNumber, sizePerPage, fetchFilterInputs, deleteStatus]);

<<<<<<< HEAD:app/loanApplication/loans/loanType/page.js
  const fetchloanType = async () => {
=======
  const advanceSearchInputs = useSelector((state) => state.tasks.advanceSearch);

  useEffect(() => {
    if(token) fetchCategory(true);
  }, [advanceSearchInputs]);

  const fetchCategory = async (isAdvance = false) => {
>>>>>>> d94f52ee6dee3781f0f2597d20dcbe3ce4d0c90e:app/cheil/data/category/page.js
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      const headers = { Authorization: `Bearer ${token}` };
<<<<<<< HEAD:app/loanApplication/loans/loanType/page.js
      const body = {
        page: currentpageNumber,
        sizePerPage: sizePerPage === totalRecord ? totalRecord : sizePerPage,
        // ...(fetchFilterInputs.length === 0 && { page: currentpageNumber }),
        categories: fetchFilterInputs,
      };
      const response = await axios.post(`${api}/loans/loanType`, body, {
=======
      var body;
      if (isAdvance) {
        body = {
          page:currentpageNumber,
          sizePerPage: sizePerPage === totalRecord ? totalRecord : sizePerPage,
          ...advanceSearchInputs,
        };
      } else {
        body = {
          page:currentpageNumber,
          sizePerPage: sizePerPage === totalRecord ? totalRecord : sizePerPage,
          categories: fetchFilterInputs,
        };
      }
      const response = await axios.post(`${api}/admin/category`, body, {
>>>>>>> d94f52ee6dee3781f0f2597d20dcbe3ce4d0c90e:app/cheil/data/category/page.js
        headers,
      });
console.log(response,"response from api");

      setloanTypes(response.data.loanTypeDtoList || []);
      setTotalRecord(response.data.totalRecords);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError("Error fetching loanType data");
    }
  };
  const handlePageChange = (newPage) => {
    dispatch(setPageNumber(newPage));
  };

  const handleSizeChange = (event) => {
    const selectedSize = event.target.value;
    if (selectedSize === "all") {
      setSizePerPage(totalRecord); // Set to totalRecord to fetch all items
    } else {
      setSizePerPage(parseInt(selectedSize)); // Convert string to number
    }
  };

  const addnewroutepath = "/loans/loanType/add-loanType";
  const breadscrums = "Admin > loanType";
  const cuurentpagemodelname = "loanType";
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
  const apiroutepath = "loanType";
  const deleteKeyField = "loanTypeDtoList";
  const editnewroutepath = "/loans/loanType/edit-loanType";

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
        data={loanTypes}
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
        apiroutepath={apiroutepath}
        exportDownloadContent={exportDownloadContent}
        deleteKeyField={deleteKeyField}
        editnewroutepath={editnewroutepath}
      />
    </div>
  );
};

export default loanType;
