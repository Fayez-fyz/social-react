import React, { useState } from "react";

const ParallaxBG = ({ url, children = "MERNCAMP" }) => {
  return (
    <div
      className="container-fluid"
      style={{
        backgroundImage: "url(" +  url  + ")",
        backgroundAttachment: "fixed",
        padding: "80px 0px 50px 0px",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        display: "block",
      }}
    >
      <p className="display-1 font weight-bold text-center">{children}</p>
      {/* <p className="text-light"></p> */}
    </div>
  );
};

export default ParallaxBG;
