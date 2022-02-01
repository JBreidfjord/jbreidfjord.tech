import "./Portfolio.css";

import { ReactComponent as GitHub } from "../assets/link-icons/github.svg";
import { ReactComponent as JavaScript } from "../assets/lang-icons/javascript.svg";
import { ReactComponent as Link } from "../assets/link-icons/link.svg";
import Project from "./Project";
import { ReactComponent as Python } from "../assets/lang-icons/python.svg";
import { ReactComponent as React } from "../assets/lang-icons/react.svg";
import { ReactComponent as Rust } from "../assets/lang-icons/rust.svg";
import { ReactComponent as SQL } from "../assets/lang-icons/sql.svg";
import { ReactComponent as TypeScript } from "../assets/lang-icons/typescript.svg";
import { ReactComponent as YouTube } from "../assets/link-icons/youtube.svg";
import portfolio from "../portfolio.json";

const getIconComponent = (icon) => {
  switch (icon) {
    case "github":
      return <GitHub />;
    case "link":
      return <Link />;
    case "youtube":
      return <YouTube />;
    case "python":
      return <Python />;
    case "react":
      return <React />;
    case "rust":
      return <Rust />;
    case "sql":
      return <SQL />;
    case "javascript":
      return <JavaScript />;
    case "typescript":
      return <TypeScript />;
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
          <Project key={i} project={project} getIconComponent={getIconComponent} />
        ))}
      </div>
    </div>
  );
}
