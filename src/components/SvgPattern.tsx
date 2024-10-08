import React from "react";

interface SvgPatternProps {
  patternId: string;
}

// Use import.meta.glob to import all SVG files from the patterns directory
const patternModules = import.meta.glob("@/assets/patterns/*.svg", {
  eager: true,
});

// Create a dictionary of all patterns
const patterns: { [key: string]: string } = {};
Object.entries(patternModules).forEach(([path, module]) => {
  const patternId = path.split("/").pop()?.replace(".svg", "");
  if (patternId) {
    patterns[patternId] = (module as { default: string }).default;
  }
});

const SvgPattern: React.FC<SvgPatternProps> = ({ patternId }) => {
  const patternSrc = patterns[patternId];

  if (!patternSrc) {
    console.warn(`Pattern with id "${patternId}" not found.`);
    return null;
  }

  return (
    <div
      className="inset-0 bg-gray-100 w-full h-full"
      style={{
        backgroundImage: `url(${patternSrc})`,
        backgroundRepeat: "repeat",
      }}
    />
  );
};

export default SvgPattern;
