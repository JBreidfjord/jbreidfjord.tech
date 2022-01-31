import "./Project.css";

export default function Project({ project, getIconComponent }) {
  return (
    <div className="project">
      <h3>{project.title}</h3>
      <h5>{project.subtitle}</h5>
      <p>{project.description}</p>
      <div className="links">
        {project.links.map((link, i) => (
          <a href={link.url} key={i}>
            {getIconComponent(link.icon)}
          </a>
        ))}
      </div>
    </div>
  );
}
