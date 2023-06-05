"use client";

import { useState } from "react";
import { useEffect } from "react";
import { GoGraph } from "react-icons/go";

const StatBox = ({ title, data, lateData, lastUpdated }) => {
  const [percent, setPercent] = useState("+0%");

  useEffect(() => {
    getPercentChange(data, lateData);
  }, []);

  const getPercentChange = (data, late) => {
    var decreaseValue = data - late;
    var returnValue = (decreaseValue / data) * 100;
    if (returnValue > 0) {
      setPercent("+" + returnValue.toFixed(2));
    } else {
      setPercent(returnValue.toFixed(2));
    }
  };

  return (
    <div className="flex flex-col h-[300px] w-[300px] rounded-[10px] bg-slate-800 items-center justify-center relative m-[10px]">
      <button className="flex items-center justify-center w-[30px] h-[30px] bg-black/80 rounded-[8px] absolute top-[5px] right-[5px]">
        <GoGraph className="text-white" />
      </button>
      <p className="text-[18px] text-white text-center absolute top-[16px] left-[20px]">
        {title}
      </p>
      <p className="text-[130px] text-white text-center uppercase leading-[130px] font-face-sofia-pro">
        {data}
      </p>
      <p className="text-[30px] text-green-500 text-center uppercase">
        {percent}
      </p>
      <p className="text-white/20 text-[10px] mt-[-10px]">
        compared to yesterday ({lateData})
      </p>
      <p className="text-[12px] text-white/30 text-center uppercase absolute bottom-1">
        LAST UPDATED: {lastUpdated}
      </p>
    </div>
  );
};

export default StatBox;
