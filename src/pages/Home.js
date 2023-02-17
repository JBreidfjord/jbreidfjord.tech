import "./Home.css";

import Canvas from "../components/Canvas";
import { ReactComponent as GitHub } from "../assets/link-icons/github.svg";
import { ReactComponent as LinkedIn } from "../assets/link-icons/linkedin.svg";
import Portfolio from "../components/Portfolio";

export default function Home() {
  return (
    <div className="home">
      <Canvas />
      <div className="info-container">
        <img className="headshot" src="assets/images/headshot.png" alt="Headshot" />
        <div className="info">
          <h2>Jonathan Breidfjord</h2>
          <h4>Software Engineering Student</h4>
          <div className="links">
            <a href="https://github.com/JBreidfjord" target="_blank" rel="noreferrer">
              <GitHub className="icon" />
            </a>
            <a href="https://www.linkedin.com/in/jbreidfjord/" target="_blank" rel="noreferrer">
              <LinkedIn className="icon" />
            </a>
          </div>
        </div>
      </div>
      <Portfolio />
    </div>
  );
}
