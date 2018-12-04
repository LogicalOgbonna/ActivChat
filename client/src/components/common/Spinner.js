import React from "react";
import spiner from "./spinner.gif";

export default function Spinner() {
  return (
    <div>
      <img
        style={{ width: "200px", margin: "auto", display: "block" }}
        src={spiner}
        alt="loading..."
      />
    </div>
  );
}
