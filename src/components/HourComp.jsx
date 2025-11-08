import moment from "moment";
import React from "react";
import { weatherCodesMapping } from "../assets/utils.js";
import ArrowLeft from '../assets/images/arrow-left.svg'
import ArrowRight from '../assets/images/arrow-right.svg'
import ArrowStraight from '../assets/images/arrow-straight.svg'
import VerticalLine from  "../assets/images/vartical-line.svg"

const HourComp = ({ currentTime, data }) => {
  return (
    <>
      <div
        className={`hour-comp-main-div ${
          currentTime ? "time-highlight" : ""
        }`}
      >
        <p className="label-18">
          {currentTime ? "Now" : moment(data.date).format("HH:mm")}
        </p>
        <img
          src={weatherCodesMapping[data?.value?.weatherCode].img}
          width={48}
          height={48}
          alt=""
        />
        <p className="label-18">{Math.floor(data?.value?.temperature2m)}</p>
        <img
          src={
            Math.floor(data?.value?.windDirection10m) < 90 ||
            Math.floor(data?.value?.windDirection10m) > 270
              ? ArrowRight
              : Math.floor(data?.vlue?.windDirection10m) > 90 ||
                Math.floor(data?.value?.windDirection10m) < 270
              ? ArrowLeft
              : ArrowStraight
          }
          alt=""
        />
        <p className="label-18">{Math.floor(data?.value?.windSpeed)}</p>
      </div>
      <img src={VerticalLine} alt="" />
    </>
  );
};

export default HourComp;
