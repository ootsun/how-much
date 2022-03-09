import {Logo} from './logo.js';

export function ProjectNameLogo({project}) {

  return (
    <span className="flex items-center">
      <Logo url={project.logoUrl} alt={project.name}/>
      <span className="ml-2">{project.name}</span>
    </span>
  );
}
