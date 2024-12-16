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

const Notification = () => {
  const [token, setToken] = useState("");
  const [notification, setNotification] = useState([]);
  const [sizePerPage, setSizePerPage] = useState(50);
  const [totalRecord, setTotalRecord] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const deleteStatus = useSelector((state) => state.tasks.deleteStatus);
  const currentpageNumber = useSelector((state) => state.tasks.pageNumber);
  const fetchFilterInputs = useSelector((state) => state.tasks.fetchFilterInput);
  const advanceSearchInputs = useSelector((state) => state.tasks.advanceSearch);

  const fields = [
    { label: "Text", value: "text" },
    { label: "Short Description", value: "shortDescription" },
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
    if (token) {
      fetchEnvironment();
    }
    if (deleteStatus === "deleted") {
      fetchEnvironment();
      dispatch(resetDeleteStatus());
    }
  }, [token, currentpageNumber, sizePerPage, fetchFilterInputs, deleteStatus]);

  useEffect(() => {
    if (token) fetchEnvironment(true);
  }, [advanceSearchInputs, token]);

  const fetchEnvironment = async (isAdvance = false) => {
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
            notificationDtoList: fetchFilterInputs,
          };

      const response = await axios.post(`${api}/admin/notification`, body, { headers });

      setNotification(response.data.notificationDtoList || []);
      setTotalRecord(response.data.totalRecords);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Error fetching notification data");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(setPageNumber(newPage));
  };

  const handleSizeChange = (event) => {
    const selectedSize = event.target.value;
    setSizePerPage(selectedSize === "all" ? totalRecord : parseInt(selectedSize));
  };

  const startRecord = (currentpageNumber - 1) * sizePerPage + 1;
  const endRecord = Math.min(startRecord + sizePerPage - 1, totalRecord);

  return (
    <div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Listingpage3cols
        cuurentpagemodelname="notification"
        breadscrums="Admin > notification"
        addnewroutepath="/admin/notification/add-notification"
        fields={fields}
        data={notification}
        currentPage={currentpageNumber}
        sizePerPage={sizePerPage}
        totalPages={totalPages}
        totalRecord={totalRecord}
        onPageChange={handlePageChange}
        onSizeChange={handleSizeChange}
        loading={loading}
        startRecord={startRecord}
        endRecord={endRecord}
        aresuremodal="delete this items?"
        aresuremodaltype="Delete"
        editnewroutepath="/admin/notification/edit-notification"
        apiroutepath="notification"
        exportDownloadContent={[
          { value: "status", label: "Status" },
          { value: "node", label: "Node" },
          { value: "sourceTargetParamMappings", label: "SourceTargetParamMappings" },
          { value: "dataRelation", label: "DataRelation" },
          { value: "subsidiaries", label: "Subsidiaries" },
          { value: "shortDescription", label: "ShortDescription" },
          { value: "text", label: "text" },
        ]}
        deleteKeyField="notificationDtoList"
      />
    </div>
  );
};

export default Notification;
