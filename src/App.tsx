import ScrollGlobe from "./components/ScrollGlobe";
import Sections from "./components/Sections";

function App() {
  return (
    <div className="relative min-h-screen text-white">
      {/* Fixed 3D Globe */}
      <ScrollGlobe />

      {/* Portfolio Sections */}
      <div className="relative z-10">
        <Sections />
      </div>
    </div>
  );
}

export default App;