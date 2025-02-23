import React, { useState, useEffect, useCallback } from "react";
import GlobeComponent from "./Globe";

const educationSections = ["rabat", "nancy", "lyon", "stockholm"]; // Only education sections

const ScrollGlobe = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = useCallback((event: WheelEvent) => {
    event.preventDefault();
    if (event.deltaY > 0 && currentIndex < educationSections.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      console.log("currentIndex", currentIndex);
    } else if (event.deltaY < 0 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  useEffect(() => {
    window.addEventListener("wheel", handleScroll, { passive: false });
    return () => window.removeEventListener("wheel", handleScroll);
  }, [handleScroll]);

  return (
    <div className="fixed top-0 left-0 w-full h-screen -z-10">
      <GlobeComponent currentLocation={currentIndex} />
    </div>
  );
};

export default ScrollGlobe;