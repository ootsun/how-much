import resolveConfig from "tailwindcss/resolveConfig.js";
import tailwindConfig from "../../tailwind.config.js";
import {useEffect, useState} from "react";

export function useMobileDisplay() {

  const [isMobileDisplay, setIsMobileDisplay] = useState(true);

  useEffect(() => {
    const fullConfig = resolveConfig(tailwindConfig);
    const smNumber = Number.parseInt(fullConfig.theme.screens.sm.replace('px', ''));
    setIsMobileDisplay(typeof window !== 'undefined' && window.innerWidth < smNumber);
  }, []);

  return isMobileDisplay;
}
