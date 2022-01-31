import "./Home.css";

import { ReactComponent as GitHub } from "../assets/github.svg";
import { ReactComponent as LinkedIn } from "../assets/linkedin.svg";
import Portfolio from "../components/Portfolio";

export default function Home() {
  return (
    <div className="home">
      <div className="info-container">
        <img className="headshot" src="assets/images/headshot.png" alt="Headshot" />
        <div className="info">
          <h2>Jonathan Breidfjord</h2>
          <h4>Software Engineering Student</h4>
          <div className="links">
            <a href="https://github.com/JBreidfjord">
              <GitHub />
            </a>
            <a href="https://www.linkedin.com/in/jbreidfjord/">
              <LinkedIn />
            </a>
          </div>
        </div>
      </div>
      <Portfolio />
    </div>
  );
}
