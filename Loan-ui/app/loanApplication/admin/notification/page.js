"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import Listingpage3cols from "@/app/src/components/ListingPageComponents/Listingpage3cols";
import { useDispatch, useSelector } from "react-redux";
import { clearAllEditRecordIds, resetDeleteStatus, setAdvanceFilterValue, setConfigureListingPageModal, setPageNumber } from "@/app/src/Redux/Slice/slice";

const notification = () => {
  const [token, setToken] = useState("");
  const [notification, setnotification] = useState([]);
  const [sizePerPage, setSizePerPage] = useState(50);
  const [totalRecord, setTotalRecord] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchFilterInputs = useSelector(
    (state) => state.tasks.fetchFilterInput
  );
  const fields = [
    { label: 'Text', value: 'text' },
    { label: 'Short Description', value: 'shortDescription' },
    { label: 'Status', value: 'status' },
    
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
      fetchEnvironment();
    }
    if (deleteStatus === "deleted") {
      fetchEnvironment();
      dispatch(resetDeleteStatus()); // Reset deleteStatus after the data is fetched
    }
  }, [token, currentpageNumber, sizePerPage, fetchFilterInputs,deleteStatus]);

  const advanceSearchInputs = useSelector((state) => state.tasks.advanceSearch);

  useEffect(() => {
    if(token) fetchEnvironment(true);
  }, [advanceSearchInputs]);


  const fetchEnvironment = async (isAdvance = false) => {
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      const headers = { Authorization: `Bearer ${token}` };
<<<<<<< HEAD:app/loanApplication/admin/notification/page.js
      const body = {
        page: currentpageNumber,
        sizePerPage: sizePerPage === totalRecord ? totalRecord : sizePerPage,
        notificationDtoList: fetchFilterInputs,
        // ...(fetchFilterInputs.length === 0 && { page: currentpageNumber }),
      };
      const response = await axios.post(`${api}/admin/notification`, body, { headers });
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
          environments: fetchFilterInputs,
        };
      }
      const response = await axios.post(`${api}/admin/environment`, body, { headers });
>>>>>>> d94f52ee6dee3781f0f2597d20dcbe3ce4d0c90e:app/cheil/admin/environment/page.js
      
      setnotification(response.data.notificationDtoList || []);
      setTotalRecord(response.data.totalRecords);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError("Error fetching notification data");
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
  

  const addnewroutepath = "/admin/notification/add-notification"
  const breadscrums = "Admin > notification"
  const cuurentpagemodelname = "notification"
  const editnewroutepath = "/admin/notification/edit-notification";
  const aresuremodal = "delete this items?";
  const exportDownloadContent =  [
    { value: "status", label: "Status" },
    { value: "node", label: "Node" },
    { value: "sourceTargetParamMappings", label: "SourceTargetParamMappings" },
    { value: "dataRelation", label: "DataRelation" },
    { value: "subsidiaries", label: "Subsidiaries" },
    { value: "shortDescription", label: "ShortDescription" },
    { value: "text", label: "text" }
  ];  const aresuremodaltype = "Delete";
  const apiroutepath = "notification";
  const deleteKeyField = "notificationDtoList";


  // Calculate startRecord and endRecord
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
        data={notification}
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
        exportDownloadContent={exportDownloadContent}        deleteKeyField={deleteKeyField}
      />
    </div>
  );
};


export default notification;
