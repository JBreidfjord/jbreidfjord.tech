import "./Portfolio.css";

import { ReactComponent as GitHub } from "../assets/github.svg";
import { ReactComponent as Link } from "../assets/link.svg";
import Project from "./Project";
import { ReactComponent as YouTube } from "../assets/youtube.svg";
import portfolio from "../portfolio.json";

const getIconComponent = (icon) => {
  switch (icon) {
    case "github":
      return <GitHub />;
    case "link":
      return <Link />;
    case "youtube":
      return <YouTube />;
    default:
      return null;
  }
};

export default function Portfolio() {
  return (
    <div className="portfolio">
      <h2>Portfolio</h2>
      <div className="project-list">
        {portfolio.map((project, i) => (
          <div className="project" key={i}>
            <Project project={project} getIconComponent={getIconComponent} />
          </div>
        ))}
      </div>
    </div>
  );
}
