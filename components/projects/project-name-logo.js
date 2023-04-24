import {Logo} from './logo.js';
import {Skeleton} from "../skeleton.js";

export function ProjectNameLogo({operation, project, loading, short = true}) {

  const hasVersionOrIsERC20 = operation?.version || operation?.isERC20;

  const formatVersionOrIsERC20 = (operation) => {
    if (operation.isERC20) {
      return 'ERC20';
    }
    return operation.version;
  }

  return (
    <span className="flex items-center">
      {loading ?
        <>
          <Skeleton logo={true}/>
          <Skeleton/>
        </> :
        <>
          <Logo url={project.logoUrl} alt={project.name}/>
          <span className="ml-2 text-sm">
            {project.name}
            {hasVersionOrIsERC20 && !short && <span className="text-xs"> - {formatVersionOrIsERC20(operation)}</span>}
          </span>
        </>
      }
    </span>
  );
}
