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

const Role = () => {
  const [token, setToken] = useState("");
  const [role, setrole] = useState([]);
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
    { label: "Identifier", value: "identifier" },
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
        // dispatch(setAdvanceFilterOperator('and'))
        dispatch(setAdvanceFilterValue([]));
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchrole();
    }
    if (deleteStatus === "deleted") {
      fetchrole();
      dispatch(resetDeleteStatus()); // Reset deleteStatus after the data is fetched
    }
  }, [token, currentpageNumber, sizePerPage, fetchFilterInputs, deleteStatus]);

<<<<<<< HEAD:app/loanApplication/admin/role/page.js
  const fetchrole = async () => {
=======
  const advanceSearchInputs = useSelector((state) => state.tasks.advanceSearch);

  useEffect(() => {
    if(token) fetchRole(true);
  }, [advanceSearchInputs]);
  const fetchRole = async (isAdvance = false) => {
>>>>>>> d94f52ee6dee3781f0f2597d20dcbe3ce4d0c90e:app/cheil/roleandusers/role/page.js
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      const headers = { Authorization: `Bearer ${token}` };
<<<<<<< HEAD:app/loanApplication/admin/role/page.js
      const body = {
        page: currentpageNumber,
        sizePerPage: sizePerPage === totalRecord ? totalRecord : sizePerPage,
        roleDtoList: fetchFilterInputs,
        // ...(fetchFilterInputs.length === 0 && { page: currentpageNumber }),
      };
      console.log("req body",body);
      console.log("req body token",token);
      const response = await axios.post(`${api}/admin/role`, body, {
        headers,
      });

      setrole(response.data.roleDtoList || []);
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
          roles: fetchFilterInputs,
        };
      }

              // ...(fetchFilterInputs.length === 0 && { page: currentpageNumber }),

      const response = await axios.post(`${api}/admin/role`, body, { headers });
      setRoles(response.data.roles || []);
>>>>>>> d94f52ee6dee3781f0f2597d20dcbe3ce4d0c90e:app/cheil/roleandusers/role/page.js
      setTotalRecord(response.data.totalRecords);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Error fetching role data");
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
      setSizePerPage("all"); // Example: set a high number to show all items
    } else {
      setSizePerPage(parseInt(selectedSize)); // Convert string to number
    }
  };

  // Calculate startRecord and endRecord
  const startRecord = currentpageNumber * sizePerPage + 1;
  const endRecord = Math.min(startRecord + sizePerPage - 1, totalRecord);
  const addnewroutepath = "/admin/role/add-role";
  const breadscrums = "Admin > Role";
  const cuurentpagemodelname = "Role";
  const editnewroutepath = "/admin/role/edit-role";
  const aresuremodal = "delete this items?";
  const exportDownloadContent = [
    { value: "status", label: "Status" },
    { value: "node", label: "Node" },
    { value: "sourceTargetParamMappings", label: "SourceTargetParamMappings" },
    { value: "role", label: "Role" },
    { value: "subsidiaries", label: "Subsidiaries" },
    { value: "shortDescription", label: "ShortDescription" },
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
        fields={fields} // Pass the field configuration
        data={role}
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

export default Role;
