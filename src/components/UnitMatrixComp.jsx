import React from "react";
import CardLayout from "./ui/CardLayout";
import SunMini from "../assets/images/sun-mini.svg"

const UnitMatrixComp = ({ label, value, unit }) => {
  return (
    <CardLayout className="unit-metrix-main-div flex items-start">
      <img src={SunMini} style={{ paddingTop: "2px" }} alt="" />
      <div>
        <p className="label-18 uppercase">{label}</p>
        <p className="label-18 font-30">
          {value ?? "N/A"}
          {unit ?? ""}
        </p>
      </div>
    </CardLayout>
  );
};

export default UnitMatrixComp;
