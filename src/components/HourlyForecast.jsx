import React from "react";
import CardLayout from "./ui/CardLayout";
import LeftNav from "../assets/images/left-nav.svg";
import RightNav from "../assets/images/right-nav.svg";
import LeftNavGray from "../assets/images/left-nav-gray.svg";
import RightNavGray from "../assets/images/right-nav-gray.svg";
import HourComp from "./HourComp";

const HourlyForecast = ({ hourlyData }) => {
  return (
    <div className="hourly-forecast-container">
      <div className="hourly-title-container">
        <p className="forecast-title">Hourly Weather</p>
        <div className="hourly-navigation-arrow">
          <img src={LeftNav} id="right-nav-btn" />
          <img src={RightNav} id="right-nav-btn" />
        </div>
      </div>
      <CardLayout className="p-0 hourly-forecast-card-layout">
        <div className="hourly-card-main-div">
          {hourlyData.map((elem, elemIndex) => (
            <HourComp
              key={elemIndex}
              currentTime={elem.isClosestTime}
              data={elem}
            />
          ))}
        </div>
      </CardLayout>
    </div>
  );
};

export default HourlyForecast;
