export function Skeleton({functionName, contractAddress, logo}) {
  if(functionName) {
    return  (
      <span className="skeleton skeleton-text w-16 h-5"/>
    );
  }
  if(contractAddress) {
    return  (
      <span className="skeleton skeleton-text w-32 h-5"/>
    );
  }
  if(logo) {
    return  (
      <span className="skeleton w-5 h-5 rounded-full block mr-2"/>
    );
  }
  return (
    <span className="skeleton skeleton-text w-24 h-5"/>
  );
}
