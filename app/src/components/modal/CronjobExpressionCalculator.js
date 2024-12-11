"use client";
import { Modal, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import 'animate.css';
import { useDispatch } from "react-redux";
import { deleteCronExpression, getCronExpression } from "../../Redux/Slice/slice";

const CronCalculator = ({ isOpen, setIsModalOpen }) => {
  const [selectedMinutes, setSelectedMinutes] = useState([]);
  const [selectedHours, setSelectedHours] = useState([]);
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [cronExpression, setCronExpression] = useState("* * * * *");
  const [showMinutes, setShowMinutes] = useState(false);
  const [showHours, setShowHours] = useState(false);
  const [showDates, setShowDates] = useState(false);
  const [showMonths, setShowMonths] = useState(false);
  const [showDaysOfWeek, setShowDaysOfWeek] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(deleteCronExpression());
  }, [])
  

  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const daysOfWeekCron = ["0", "1", "2", "3", "4", "5", "6"];
  const dates = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
  const monthsCron = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  const toggleSelection = (value, setSelected) => {
    setSelected((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((v) => v !== value)
        : [...prevSelected, value]
    );
  };

  const toggleSelectAll = (items, setSelected, selected) => {
    if (selected.length === items.length) {
      setSelected([]);
    } else {
      setSelected(items);
    }
  };

  const generateCronExpression = () => {
    const minute = selectedMinutes.length ? selectedMinutes.join(",") : "*";
    const hour = selectedHours.length ? selectedHours.join(",") : "*";

    const date = selectedDates.length ? selectedDates.join(",") : "*";
    const month = selectedMonths.length
      ? selectedMonths
          .map((month) => monthsCron[months.indexOf(month)])
          .join(",")
      : "*";
    const dayOfWeek = selectedDaysOfWeek.length
      ? selectedDaysOfWeek
          .map((day) => daysOfWeekCron[daysOfWeek.indexOf(day)])
          .join(",")
      : "*";

    setCronExpression(`${minute} ${hour} ${date} ${month} ${dayOfWeek}`);
  };

  useEffect(() => {
    generateCronExpression();
  }, [
    selectedMinutes,
    selectedHours,
    selectedDates,
    selectedMonths,
    selectedDaysOfWeek,
  ]);
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <Modal open={isOpen} onClose={closeModal}>
      <div className="flex flex-col w-[100%] justify-start mt-10 items-center min-h-screen">
        <div className="bg-transparent w-[60%] flex flex-col relative justify-start items-center bg-white rounded-md g h-72">
          <div className="bg-black w-full flex flex-row justify-between items-center rounded-t-md p-2">
            <span className="font-semibold text-md text-white">
              Set-up the interval time
            </span>
            <div onClick={closeModal} className="cursor-pointer">
              <IoClose className="text-white text-xl" />
            </div>
          </div>
          <div className=" w-full gap-3 flex flex-row justify-center  items-center rounded-md p-4">
          <TextField
  variant="standard"
  size="small"
  fullWidth
  value={cronExpression}
  InputProps={{
    readOnly: true,
  }}
  className="text-mdtext-black font-mono w-[50%]"
/>

            <div
  onClick={() => {
    setCronExpression("* * * *");
    setSelectedMinutes([]);     // Clear selected minutes
    setSelectedDates([]);       // Clear selected dates
    setSelectedDaysOfWeek([]);  // Clear selected days of the week
    setSelectedMonths([]);      // Clear selected months
    setSelectedHours([]);      // Clear selected hours
  }}
  className="border p-2 rounded-md text-xs w-[70px] m-2 cursor-pointer text-white bg-[#cc0001] text-center"
>
  Clear
</div>
<div onClick={()=>{
  dispatch(getCronExpression(cronExpression));
  closeModal();
}}  className="border p-2 rounded-md text-xs w-[70px] m-2 cursor-pointer text-white bg-green-500 text-center"
>save</div>

          </div>
          <div className="text-center bg-white grid grid-cols-2 w-full p-2 gap-7 ">
            <div className="flex flex-col gap-2 w-full  items-center">
              <div className="flex flex-row gap-5 justify-between  w-[90%]">
                <h2 className="mb-4 text-md"> Minutes :</h2>
                <TextField
                  variant="standard"
                  size="small"
                  placeholder="Select Minutes"
                  onClick={() => {
                    setShowMinutes(!showMinutes);
                    setShowHours(false);
                    setShowDates(false);
                    setShowMonths(false);
                    setShowDaysOfWeek(false);
                  }}
                  value={selectedMinutes || ""}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full items-center">
              <div className="flex flex-row gap-5 justify-between  w-[90%]">
                <h2 className="mb-4 text-md">Hours :</h2>
                <TextField
                  variant="standard"
                  size="small"
                  placeholder="Select Hours"
                  onClick={() => {
                    setShowMinutes(false);
                    setShowHours(!showHours);
                    setShowDates(false);
                    setShowMonths(false);
                    setShowDaysOfWeek(false);
                  }}
                  value={selectedHours || ""}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full items-center">
              <div className="flex flex-row gap-5 justify-between  w-[90%]">
                <h2 className="mb-4 text-md">Date :</h2>
                <TextField
                  variant="standard"
                  size="small"
                  placeholder="Select Dates"
                  onClick={() => {
                    setShowMinutes(false);
                    setShowHours(false);
                    setShowDates(!showDates);
                    setShowMonths(false);
                    setShowDaysOfWeek(false);
                  }}
                  value={selectedDates || ""}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full items-center">
              <div className="flex flex-row gap-5 justify-between  w-[90%]">
                <h2 className="mb-4 text-md">Day :</h2>
                <TextField
                  variant="standard"
                  size="small"
                  placeholder="Select Days of week"
                  onClick={() => {
                    setShowMinutes(false);
                    setShowHours(false);
                    setShowDates(false);
                    setShowMonths(false);
                    setShowDaysOfWeek(!showDaysOfWeek);
                  }}
                  value={selectedDaysOfWeek || ""}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full items-center">
              <div className="flex flex-row gap-5 justify-between  w-[90%]">
                <h2 className="mb-4 text-md">Month :</h2>
                <TextField
                  variant="standard"
                  size="small"
                  placeholder="Select Month"
                  onClick={() => {
                    setShowMinutes(false);
                    setShowHours(false);
                    setShowDates(false);
                    setShowMonths(!showMonths);
                    setShowDaysOfWeek(false);
                  }}
                  value={selectedMonths || ""}
                />
              </div>
            </div>
          </div>
          {showHours && (
             <div className="w-full bg-white">
             <div className="flex flex-row gap-3 w-full justify-end">
             <div onClick={()=>{
               setSelectedHours([]); 
             }}  className="border p-2 rounded-md text-sm w-[70px] m-2 text-white bg-[#cc0001] text-center">
    clear
  </div>
  
  <div onClick={()=>{
               setShowHours(false); 
             }}  className="border p-2 rounded-md text-sm w-[70px] m-2 text-white bg-blue-500 text-center">
    save
  </div>
             </div>
            <div className="grid grid-cols-10 w-full gap-2 p-3 bg-black min-h-40 max-h-40 overflow-y-scroll">
              <div
                className={`${
                  selectedHours.length === hours.length
                    ? "bg-white text-black"
                    : "bg-transparent text-white"
                } border border-white rounded py-2 text-sm hover:bg-white hover:text-black`}
                onClick={() =>
                  toggleSelectAll(hours, setSelectedHours, selectedHours)
                }
              >
                Select All
              </div>
              {hours.map((hour) => (
                <div
                  key={hour}
                  className={`${
                    selectedHours.includes(hour)
                      ? "bg-white text-black"
                      : "bg-transparent text-white"
                  } border border-white rounded text-sm py-2 text-center hover:bg-white hover:text-black`}
                  onClick={() => toggleSelection(hour, setSelectedHours)}
                >
                  {hour}
                </div>
              ))}
            </div>
            </div>
          )}

          {showMinutes && (
            
            <div className="w-full bg-white">
                       <div className="flex flex-row gap-3 w-full justify-end">
                       <div onClick={()=>{
                         setSelectedMinutes([]); 
                       }}  className="border p-2 rounded-md text-sm w-[70px] m-2 text-white bg-[#cc0001] text-center cursor-pointer">
              clear
            </div>
            
            <div onClick={()=>{
                         setShowMinutes(false); 
                       }}  className="border p-2 rounded-md text-sm w-[70px] m-2 text-white bg-blue-500 text-center cursor-pointer">
              save
            </div>
                       </div>

            <div className="grid grid-cols-10 w-full gap-2 p-3 bg-black min-h-40 max-h-40 overflow-y-scroll">
              <div
                className={`${
                  selectedMinutes.length === minutes.length
                    ? "bg-white text-black"
                    : "bg-transparent text-white"
                } border border-white text-center cursor-pointer rounded py-2 text-sm hover:bg-white hover:text-black`}
                onClick={() =>
                  toggleSelectAll(minutes, setSelectedMinutes, selectedMinutes)
                }
              >
                Select All
              </div>
              {minutes.map((minute) => (
                <div
                  key={minute}
                  className={`${
                    selectedMinutes.includes(minute)
                      ? "bg-white text-black"
                      : "bg-transparent text-white"
                  } border border-white cursor-pointer rounded text-sm py-2 hover:bg-white text-center hover:text-black`}
                  onClick={() => toggleSelection(minute, setSelectedMinutes)}
                >
                  {minute}
                </div>
              ))}
            </div>
            </div>
          )}
          {showDates && (
             <div className="w-full bg-white">
             <div className="flex flex-row gap-3 w-full justify-end">
             <div onClick={()=>{
               setSelectedDates([]); 
             }}  className="border p-2 rounded-md  cursor-pointer text-sm w-[70px] m-2 text-white bg-[#cc0001] text-center">
    clear
  </div>
  
  <div onClick={()=>{
               setShowDates(false); 
             }}  className="border p-2 rounded-md text-sm w-[70px] m-2 text-white bg-blue-500 text-center cursor-pointer">
    save
  </div>
             </div>
            <div className="grid grid-cols-9 w-full gap-2 p-3 bg-black min-h-40 max-h-40 overflow-y-scroll">
              <div
                className={`${
                  selectedDates.length === dates.length
                    ? "bg-white text-black"
                    : "bg-transparent text-white"
                } border border-white rounded py-2 text-sm text-center cursor-pointer hover:bg-white hover:text-black`}
                onClick={() =>
                  toggleSelectAll(dates, setSelectedDates, selectedDates)
                }
              >
                Select All
              </div>
              {dates.map((date) => (
                <div
                  key={date}
                  className={`${
                    selectedDates.includes(date)
                      ? "bg-white text-black"
                      : "bg-transparent text-white"
                  } border border-white rounded py-2 text-sm text-center cursor-pointer hover:bg-white hover:text-black`}
                  onClick={() => toggleSelection(date, setSelectedDates)}
                >
                  {date}
                </div>
              ))}
            </div>
            </div>
          )}
          {showDaysOfWeek && (
             <div className="w-full bg-white">
             <div className="flex flex-row gap-3 w-full justify-end">
             <div onClick={()=>{
               setSelectedDaysOfWeek([]); 
             }}  className="border p-2 rounded-md text-sm w-[70px] m-2 text-white bg-[#cc0001] text-center cursor-pointer">
    clear
  </div>
  
  <div onClick={()=>{
               setShowDaysOfWeek(false); 
             }}  className="border p-2 rounded-md text-sm w-[70px] m-2 text-white bg-blue-500 text-center cursor-pointer">
    save
  </div>
             </div>
            <div className="grid grid-cols-5 w-full gap-2 p-3 bg-black min-h-40 max-h-40 overflow-y-scroll">
              <div
                className={`${
                  selectedDaysOfWeek.length === daysOfWeek.length
                    ? "bg-white text-black"
                    : "bg-transparent text-white"
                } border border-white rounded text-sm text-center cursor-pointer py-2 h-10 hover:bg-white hover:text-black`}
                onClick={() =>
                  toggleSelectAll(
                    daysOfWeek,
                    setSelectedDaysOfWeek,
                    selectedDaysOfWeek
                  )
                }
              >
                Select All
              </div>
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className={`${
                    selectedDaysOfWeek.includes(day)
                      ? "bg-white text-black"
                      : "bg-transparent text-white"
                  } border border-white rounded py-2 text-center cursor-pointer text-sm h-10 hover:bg-white hover:text-black`}
                  onClick={() => toggleSelection(day, setSelectedDaysOfWeek)}
                >
                  {day}
                </div>
              ))}
            </div>
            </div>
          )}
          {showMonths && (
             <div className="w-full bg-white">
             <div className="flex flex-row gap-3 w-full justify-end">
             <div onClick={()=>{
               setSelectedMonths([]); 
             }}  className="border p-2 rounded-md text-sm w-[70px] m-2  text-white bg-[#cc0001] text-center cursor-pointer">
    Clear
  </div>
  
  <div onClick={()=>{
               setShowMonths(false); 
             }}  className="border p-2 rounded-md text-sm w-[70px] m-2 text-white bg-blue-500 text-center cursor-pointer">
    Save
  </div>
             </div>
            <div className="grid grid-cols-5 w-full gap-2 p-3 bg-black min-h-40 max-h-40 overflow-y-scroll">
              <div
                className={`${
                  selectedMonths.length === months.length
                    ? "bg-white text-black"
                    : "bg-transparent text-white"
                } border border-white rounded py-2 text-center cursor-pointer text-sm h-10 hover:bg-white hover:text-black`}
                onClick={() =>
                  toggleSelectAll(months, setSelectedMonths, selectedMonths)
                }
              >
                Select All
              </div>
              {months.map((month) => (
                <div
                  key={month}
                  className={`${
                    selectedMonths.includes(month)
                      ? "bg-white text-black"
                      : "bg-transparent text-white"
                  } border border-white rounded py-2 text-center cursor-pointer text-sm h-10 hover:bg-white hover:text-black`}
                  onClick={() => toggleSelection(month, setSelectedMonths)}
                >
                  {month}
                </div>
              ))}
            </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CronCalculator;
