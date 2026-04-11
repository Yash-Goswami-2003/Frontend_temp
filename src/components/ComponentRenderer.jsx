import { componentMap } from "./componentMap";

function ComponentRenderer({ config }) {
  const { c_name, ...rest } = config;

  const Component = componentMap[c_name];
  if(!Component) return null ;
  else {
    return <Component {...rest} />;
  }
}

export default ComponentRenderer;