import "./App.css";

import Home from "./pages/Home";
import init from "game-of-life-rs";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    init().catch(console.error);
  }, []);

  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;
