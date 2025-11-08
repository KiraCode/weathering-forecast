import React from "react";
import CardLayout from "./ui/CardLayout";
import DayForecastCard from "./ui/DayForecastCard";
import Location from "../assets/images/location.svg";
import Temperature from "../assets/images/temperature.svg";
import Eye from "../assets/images/eye.svg";
import ThermoMini from "../assets/images/temperature-mini.svg";
import Windy from "../assets/images/windy.svg";
import Water from "../assets/images/water.svg";

import moment from "moment";
import { weatherCodesMapping } from "../assets/utils.js";

export default function SearchResult({
  currentWeatherData,
  forecastLocation,
  dailyForecast,
}) {
  return (
    <div className="search-result-container-div">
      <p className="forecast-title text-capitalize">
        {currentWeatherData[0]?.value?.weatherCondition}
      </p>
      <CardLayout>
        <div className="flex items-center justify-between">
          <div style={{ width: "30%" }}>
            <img
              src={
                weatherCodesMapping[currentWeatherData[0].value.weatherCode].img
              }
              alt="weather image"
              width={48}
              height={48}
            />
            <div className="flex items-center">
              <img src={Location} alt="map mark" />
              <p className="city-name">{forecastLocation?.label}</p>
            </div>
            <p className="text-blue" style={{ paddingLeft: "30px" }}>
              Today's {moment(currentWeatherData[0].date).format("MMM DD")}
            </p>
          </div>
          <div className="temp-container" style={{ width: "auto" }}>
            <img
              src={Temperature}
              className="thermometer-img"
              alt="thermometer image"
            />
            <div>
              <p style={{ fontSize: "144px" }}>
                {parseFloat(currentWeatherData[0].value?.temperature2m).toFixed(
                  0
                )}
              </p>
              <p>{currentWeatherData[0]?.value?.weatherCondtion}</p>
            </div>
            <p
              style={{
                fontSize: "24px",
                alignSelf: "start",
                paddingTop: "45px",
              }}
            >
              ℃
            </p>
          </div>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                columnGap: "16px",
              }}
            >
              <div className="weather-info-subtitle">
                <div className="flex">
                  <img src={Eye} alt="an eye" />
                  <p className="weather-params-label">Visibility</p>
                </div>
                <p>
                  {Math.floor(currentWeatherData[0].value?.visibility / 1000)}{" "}
                  km
                </p>
              </div>
              <p>|</p>
              <div className="weather-info-subtitle">
                <div className="flex">
                  <img src={ThermoMini} />
                  <p className="weather-params-label">Feels Like</p>
                </div>
                <p>
                  {Math.floor(currentWeatherData[0].value?.apparentTemperature)}{" "}
                  ℃
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                columnGap: "16px",
                marginTop: "24px",
              }}
            >
              <div className="weather-info-subtitle">
                <div className="flex">
                  <img src={Water} />
                  <p className="weather-params-label">Humidity</p>
                </div>
                <p>{Math.floor(currentWeatherData[0].value?.humidity)}%</p>
              </div>
              <p>|</p>
              <div className="weather-info-subtitle">
                <div className="flex">
                  <img src={Windy} />
                  <p className="weather-params-label">Wind</p>
                </div>
                <p>{Math.floor(currentWeatherData[0].value?.windSpeed)} km/h</p>
              </div>
            </div>
          </div>
        </div>
      </CardLayout>

      <div
        className="flex justify-between daily-forecast-section"
        style={{ marginTop: "24px", columnGap: "12px" }}
      >
        {Object.keys(dailyForecast)?.length > 0 &&
          Object.keys(dailyForecast).map((day) => {
            return (
              <DayForecastCard key={day} data={dailyForecast[day]} date={day} />
            );
          })}
      </div>
    </div>
  );
}
