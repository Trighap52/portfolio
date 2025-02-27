import { useState } from "react";
import Sections from "./components/Sections";
import ThreeScene from "./components/ThreeScene";

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSectionChange = (sectionIndex: number) => {
    setCurrentIndex(sectionIndex);
  };
  return (
    <div className="relative min-h-screen text-white">
      {/* Fixed 3D Globe */}
      <div className="fixed top-0 left-0 w-full h-screen -z-10">
        <ThreeScene currentSection={currentIndex} />
      </div>

      {/* Portfolio Sections */}
      <div className="relative z-10">
        <Sections onSectionChange={handleSectionChange} />
      </div>
    </div>
  );
}

export default App;
