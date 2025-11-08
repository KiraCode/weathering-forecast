import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import "./assets/style/index.css";
import DefaultScreen from "./components/DefaultScreen";
import { fetchWeatherApi } from "openmeteo";
import { weatherCodesMapping } from "./assets/utils";
import SearchResult from "./components/SearchResult";
const App = () => {
  const [dailyForecast, setDailyForecast] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [showResultScreen, setshowResultScreen] = useState();

  const [dataLoading, setDataLoading] = useState(false);
  const [forecastLocation, setForecastLocation] = useState({
    label: "London",
    lat: 51.5085,
    lon: -0.1257,
  });
  // to convert data into desired format
  function filterAndFlagClosestTime(data) {
    const currentDate = new Date();
    const entries = Object.entries(data);
    const todayData = entries.filter(([dateString]) => {
      const date = new Date(dateString); // converting string value to date
      return (
        date.getDate() === currentDate.getDate() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear()
      );
    });

    let closestTimeDiff = Math.abs(currentDate - new Date(todayData[0][0]));
    let closestTimeIndex = 0;
    todayData.forEach(([dateString], index) => {
      let timeDiff = Math.abs(currentDate - new Date(dateString));

      if (timeDiff < closestTimeDiff) {
        closestTimeDiff = timeDiff;
        closestTimeIndex = index;
      }
    });
    // add a flag to the closest time entry
    const result = todayData.map(([dateString, value], index) => ({
      date: dateString,
      value,
      isClosestTime: index === closestTimeIndex,
    }));
    return result;
  }

  // to convert the data into desired format
  function processData(hourly, daily) {
    function convertTimeToObjectArray(times, values) {
      // early return if no data
      if (!times || !values || !values.weatherCode) {
        return {};
      }
      const obj = {};
      // times is an array, so we want to distribue the data inside, into one object according to the time
      times.forEach((time, timeIndex) => {
        // skip if time is null/undefined
        if (!time) return;

        const weatherProperties = {};
        Object.keys(values).forEach((property) => {
          if (values[property] && values[property][timeIndex] !== undefined) {
            weatherProperties[property] = values[property][timeIndex];
          }
        });

        const weatherCode = values.weatherCode?.[timeIndex];
        const weatherCondition = weatherCodesMapping[weatherCode]?.label;

        obj[time] = {
          ...weatherProperties,
          weatherCondition,
        };
        // console.log(obj);
      });
      return obj;
    }
    let dailyData = convertTimeToObjectArray(daily.time, {
      weatherCode: daily.weatherCode,
      temperature2mMax: daily.temperature2mMax,
      temperature2mMin: daily.temperature2mMin,
      apparentTemperatureMax: daily.apparentTemperatureMax,
      apparentTemperatureMin: daily.apparentTemperatureMin,
      uvIndexMax: daily.uvIndexMax,
      precipitationSum: daily.precipitationSum,
      windSpeed10Max: daily.windSpeed10Max,
      windDirection10mDominant: daily.windDirection10mDominant,
    });
    let hourlyFormatted = convertTimeToObjectArray(hourly.time, {
      temperature2m: hourly.temperature2m,
      visibility: hourly.visibility,
      windDirection10m: hourly.windDirection10m,
      apparentTemperature: hourly.apparentTemperature,
      precipitationSum: hourly.precipitationSum,
      humidity: hourly.humidity,
      windSpeed: hourly.windSpeed,
      weatherCode: hourly.weatherCode,
    });
    const hourlyData = filterAndFlagClosestTime(hourlyFormatted);
    return { hourlyData, dailyData };
  }

  const fetchWeather = async (lat, lon, switchToResultScreen) => {
    const params = {
      latitude: lat ?? 28.6139,
      longitude: lon ?? 77.209,
      hourly: [
        "temperature_2m",
        "weather_code",
        "visibility",
        "wind_direction_10m",
        "apparent_temperature",
        "precipitation_probability",
        "relative_humidity_2m",
        "wind_speed_10m",
      ],
      daily: [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "apparent_temperature_max",
        "apparent_temperature_min",
        "sunset",
        "uv_index_max",
        "precipitation_sum",
        "wind_speed_10m_max",
        "wind_direction_10m_dominant",
        "sunrise",
      ],
      timezone: "auto",
    };

    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Helper function to form time ranges
    const range = (start, stop, step) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const hourly = response.hourly();
    const daily = response.daily();

    // const sunset = daily.variables(5);
    // const sunrise = daily.variables(10);

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      hourly: {
        time: range(
          Number(hourly.time()),
          Number(hourly.timeEnd()),
          hourly.interval()
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        temperature2m: hourly.variables(0).valuesArray(),
        weatherCode: hourly.variables(1).valuesArray(),
        visibility: hourly.variables(2).valuesArray(),
        windDirection10m: hourly.variables(3).valuesArray(),
        apparentTemperature: hourly.variables(4).valuesArray(),
        precipitation_probability: hourly.variables(5).valuesArray(),
        humidity: hourly.variables(6).valuesArray(),
        windSpeed: hourly.variables(7).valuesArray(),
      },
      daily: {
        time: range(
          Number(daily.time()),
          Number(daily.timeEnd()),
          daily.interval()
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        weatherCode: daily.variables(0).valuesArray(),
        temperature2mMax: daily.variables(1).valuesArray(),
        temperature2mMin: daily.variables(2).valuesArray(),
        apparentTemperatureMax: daily.variables(3).valuesArray(),
        apparentTemperatureMin: daily.variables(4).valuesArray(),
        // sunset: daily.variables(5).valuesArray(),
        // sunset: [...Array(sunset.valuesInt64Length())].map(
        //   (_, i) =>
        //     new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
        // ),
        uvIndexMax: daily.variables(6).valuesArray(),
        precipitation_probability: daily.variables(7).valuesArray(),
        windSpeed10Max: daily.variables(8).valuesArray(),
        windDirection10mDominant: daily.variables(9).valuesArray(),
        // sunrise: [...Array(sunrise.valuesInt64Length())].map(
        //   (_, i) =>
        //     new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
        // ),
      },
    };

    const { hourlyData, dailyData } = processData(
      weatherData.hourly,
      weatherData.daily
    );

    setHourlyForecast(hourlyData);
    setDailyForecast(dailyData);
    setDataLoading(false);
    if (switchToResultScreen) {
      setshowResultScreen(true);
    }
  };

  useEffect(() => {
    setDataLoading(true);
    fetchWeather();
  }, []);

  const clickHandler = (searchItem) => {
    setDataLoading(true);
    setForecastLocation({
      label: searchItem.label,
      lat: searchItem.lat,
      lon: searchItem.lon,
    });
    fetchWeather(searchItem.lat, searchItem.lon, true);
  };
  return (
    <div className="app">
      <Header />
      {!dataLoading && !showResultScreen && (
        <DefaultScreen
          currentWeatherData={
            hourlyForecast?.length
              ? hourlyForecast.filter((hour) => hour.isClosestTime)
              : []
          }
          forecastLocation={forecastLocation}
          onClickHandler={clickHandler}
        />
      )}
      {showResultScreen && !dataLoading && (
        <SearchResult
          currentWeatherData={
            hourlyForecast?.length
              ? hourlyForecast.filter((hour) => hour.isClosestTime)
              : []
          }
          dailyForecast={dailyForecast}
          forecastLocation={forecastLocation}
        />
      )}
      <p className="copyright-text">&copy; WSA. All Rights Reserved</p>
    </div>
  );
};

export default App;
