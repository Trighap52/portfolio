import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Globe from "react-globe.gl";
import gsap from "gsap";

// Define locations
const locations = [
  { id: "rabat", lat: 34.020882, lng: -6.84165, zoom: 0.8 },
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
    color: ["#ff6600", "#ffff00"], // Gradient from orange to yellow
  },
  {
    startLat: locations[1].lat,
    startLng: locations[1].lng,
    endLat: locations[2].lat,
    endLng: locations[2].lng,
    label: "Nancy → Lyon",
    color: ["#0000ff", "#b2b2ff"], // Gradient from green to blue
  },
  {
    startLat: locations[2].lat,
    startLng: locations[2].lng,
    endLat: locations[3].lat,
    endLng: locations[3].lng,
    label: "Lyon → Stockholm",
    color: ["#ff0000", "#ffb2b2"], // Gradient from red to cyan
  },
];

const ThreeScene = ({ currentSection }: { currentSection: number }) => {
  const sceneRef = useRef<any>(null);
  const globeRef = useRef<any>(null);
  const [, setGlobeReady] = useState(false);
  const [computer, setComputer] = useState<THREE.Object3D | null>(null);
  const [currentObject, setCurrentObject] = useState("computer");

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Fix for high DPI screens
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100vw";
    renderer.domElement.style.height = "100vh";
    sceneRef.current.appendChild(renderer.domElement);

    // Load the computer model
    const loader = new GLTFLoader();
    loader.load(
      "3d/retro_computer.glb",
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(200, 200, 200);
        model.position.set(-10, 0, 0);
        scene.add(model);
        setComputer(model);
      },
      undefined, // Optional progress callback
      (error) => {
        console.error("Error loading model:", error);
      }
    );

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const globe = globeRef.current;
    if (globe) {
      // Add clouds sphere
      const CLOUDS_IMG_URL =
        "https://raw.githubusercontent.com/turban/webgl-earth/refs/heads/master/images/fair_clouds_4k.png"; // from https://github.com/turban/webgl-earth
      const CLOUDS_ALT = 0.004;
      const CLOUDS_ROTATION_SPEED = -0.006; // deg/frame

      new THREE.TextureLoader().load(CLOUDS_IMG_URL, (cloudsTexture) => {
        const clouds = new THREE.Mesh(
          new THREE.SphereGeometry(
            globe.getGlobeRadius() * (1 + CLOUDS_ALT),
            75,
            75
          ),
          new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
        );
        globe.scene().add(clouds);

        (function rotateClouds() {
          clouds.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180;
          requestAnimationFrame(rotateClouds);
        })();
      });
    }
  }, []);

  useEffect(() => {
    if (currentSection === 0 && computer) {
      if (currentObject === "earth" && globeRef.current) {
        setCurrentObject("computer");
        gsap.to(computer.position, {
          x: -10,
          y: 0,
          z: 0,
          duration: 1.5,
        });
      } else {
        gsap.to(computer.rotation, {
          y: -Math.PI / 2,
          opacity: 0,
          duration: 1.5,
        });
      }
      gsap.to(computer.position, { x: 1, duration: 1.5 });
    } else if (currentSection === 1 && computer) {
      if (currentObject === "computer") {
        gsap.to(computer.position, {
          x: 0,
          y: -0.5,
          z: 4,
          duration: 1.5,
          onComplete: () => setCurrentObject("earth"),
        });
      }
      // if (currentObject === "earth") {
      //   setCurrentObject("computer");
      //   gsap.to(computer.rotation, {
      //     y: -Math.PI / 2,
      //     opacity: 0,
      //     duration: 1.5,
      //   });
      // }
    } else if (0 < currentSection && currentSection < 5 && computer) {
      setCurrentObject("earth");
      if (globeRef.current) {
        globeRef.current.pointOfView(
          { lat: locations[0].lat, lng: locations[0].lng, altitude: 0.8 },
          2000
        );
      }
    } else if (currentSection === 5 && computer) {
      setCurrentObject("computer");
      gsap.to(computer.position, {
        x: 1,
        y: 0,
        z: 0,
        duration: 1.5,
      });
    }
  }, [currentSection, computer, currentObject]);

  useEffect(() => {
    if (globeRef.current) {
      if (
        currentObject === "earth" &&
        0 < currentSection &&
        currentSection < 5
      ) {
        const { lat, lng, zoom } = locations[currentSection - 1];
        globeRef.current.pointOfView({ lat, lng, altitude: zoom }, 2000); // Smooth rotation + zoom
      }
    }
  }, [currentObject, currentSection]);

  return (
    <div
      ref={sceneRef}
      className="fixed top-0 left-0 w-full h-screen -z-10 bg-black"
    >
      {currentObject === "earth" && (
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
          arcColor={(d: any) => d.color} // Use the color defined in arcsData
          arcAltitude={0.1} // How high the arc rises
          arcStroke={0.2} // Thickness of the arc
          arcDashLength={1}
          arcDashGap={0.2}
          arcDashInitialGap={() => Math.random()} // Vary dash patterns
          arcDashAnimateTime={4000} // Speed of arc animation
          onGlobeReady={() => setGlobeReady(true)}
        />
      )}
    </div>
  );
};

export default ThreeScene;
