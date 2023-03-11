import {Logo} from './logo.js';
import {Skeleton} from "../skeleton.js";

export function ProjectNameLogo({project, loading}) {

  return (
    <span className="flex items-center">
      {loading ?
        <>
          <Skeleton logo={true}/>
          <Skeleton/>
        </> :
        <>
          <Logo url={project.logoUrl} alt={project.name} isERC20={project.isERC20}/>
          <span className="ml-2 text-sm">{project.name}</span>
        </>
      }
    </span>
  );
}
