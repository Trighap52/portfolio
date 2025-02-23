import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import Globe from "react-globe.gl";

// Define locations
const locations = [
  { id: "rabat", lat: 34.020882, lng: -6.841650, zoom: 0.8 },
  { id: "nancy", lat: 48.692054, lng: 6.184417, zoom: 0.8 },
  { id: "lyon", lat: 45.764042, lng: 4.835659, zoom: 0.8 },
  { id: "stockholm", lat: 59.329323, lng: 18.068581, zoom: 0.8 },
];

// Define arcs between locations
const arcsData = [
  {
    startLat: locations[0].lat,
    startLng: locations[0].lng,
    endLat: locations[1].lat,
    endLng: locations[1].lng,
    label: "Rabat → Nancy",
  },
  {
    startLat: locations[1].lat,
    startLng: locations[1].lng,
    endLat: locations[2].lat,
    endLng: locations[2].lng,
    label: "Nancy → Lyon",
  },
  {
    startLat: locations[2].lat,
    startLng: locations[2].lng,
    endLat: locations[3].lat,
    endLng: locations[3].lng,
    label: "Lyon → Stockholm",
  },
];

const GlobeComponent = ({ currentLocation }: { currentLocation: number }) => {
  const globeRef = useRef<any>(null);
  const [, setGlobeReady] = useState(false);

  useEffect(() => {
    if (globeRef.current) {
      const { lat, lng, zoom } = locations[currentLocation];
      globeRef.current.pointOfView({ lat, lng, altitude: zoom }, 2000); // Smooth rotation + zoom
    }
  }, [currentLocation]);

  useEffect(() => {
    const globe = globeRef.current;

    // Auto-rotate
    // globe.controls().autoRotate = true;
    // globe.controls().autoRotateSpeed = 0.35;

    // Add clouds sphere
    const CLOUDS_IMG_URL = 'https://raw.githubusercontent.com/turban/webgl-earth/refs/heads/master/images/fair_clouds_4k.png'; // from https://github.com/turban/webgl-earth
    const CLOUDS_ALT = 0.004;
    const CLOUDS_ROTATION_SPEED = -0.006; // deg/frame

    new THREE.TextureLoader().load(CLOUDS_IMG_URL, cloudsTexture => {
      const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(globe.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
        new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
      );
      globe.scene().add(clouds);

      (function rotateClouds() {
        clouds.rotation.y += CLOUDS_ROTATION_SPEED * Math.PI / 180;
        requestAnimationFrame(rotateClouds);
      })();
    });
  }, []);

  return (
    <Globe
      ref={globeRef}
      animateIn={false}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png" // 🌌 Starry background
      backgroundColor="rgba(0,0,0,1)" // Ensure full visibility
      width={window.innerWidth}
      height={window.innerHeight}
      arcsData={arcsData}
      arcStartLat="startLat"
      arcStartLng="startLng"
      arcEndLat="endLat"
      arcEndLng="endLng"
      arcLabel="label"
      arcColor={() => ["#ff6600", "#ffff00"]} // Gradient from orange to yellow
      arcAltitude={0.3} // How high the arc rises
      arcStroke={0.5} // Thickness of the arc
      arcDashLength={0.5}
      arcDashGap={0.2}
      arcDashInitialGap={() => Math.random()} // Vary dash patterns
      arcDashAnimateTime={4000} // Speed of arc animation
      onGlobeReady={() => setGlobeReady(true)}
    />
  );
};

export default GlobeComponent;