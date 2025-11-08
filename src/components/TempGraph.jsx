import React from "react";
import CardLayout from "./ui/CardLayout";
import Clock from "../assets/images/clock.svg";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import moment from "moment";

Chart.register(...registerables);
const LineChart = ({ timeHours, temperatureData }) => {
  const data = {
    labels: timeHours.map((hour) => `${hour}`),
    datasets: [
      {
        label: "Temperature (℃)",
        data: temperatureData,
        fill: false,
        borderColor: "#FFC355",
        pointRadiu: 5,
        pointBackgroundColor: "#FFC355",
        pointHoverRadius: 0,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "white" },
        title: {
          display: true,
          text: "Hour",
          color: "white",
        },
        border: {
          color: "white",
        },
      },
      y: {
        grid: { display: false },
        ticks: { color: "white" },
        title: {
          display: true,
          text: "Temperature",
          color: "white",
        },
        border: {
          color: "white",
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };
  return <Line data={data} options={chartOptions} />;
};

const TempGraph = ({ hourlyData }) => {
  const timeHours =
    hourlyData?.length > 0
      ? hourlyData?.map((item) => moment(new Date(item.date)).format("h:mm a"))
      : [];

       const temperatureData =
    hourlyData?.length > 0
      ? hourlyData?.map((item) =>Math.floor(item.value?.temperature2m))
      : [];
  return (
    <CardLayout className="temp-graph-layout">
      <div className="flex items-center">
        <img src={Clock} alt="clock" />
        <p className="item-format-text">24-hour Forecast</p>
      </div>
      <LineChart timeHours={timeHours} temperatureData={temperatureData} />
    </CardLayout>
  );
};

export default TempGraph;
