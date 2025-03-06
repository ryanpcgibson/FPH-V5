import React from "react";

interface TimelineHeaderProps {
  headerTexts: string[];
  headerStyles?: string[];
  cellWidth: number;
}

const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  headerTexts,
  cellWidth,
}) => {
  return (
    <div
      className="sticky top-0 z-50 bg-white w-full"
      id="column-header-container"
    >
      <div
        className="flex w-full justify-end border-background"
        id="column-headers"
      >
        {headerTexts.map((header, index) => (
          <div
            key={index}
            style={{ width: `${cellWidth}px` }}
            className="h-10 box-border flex items-center justify-center font-bold rounded-lg bg-foreground text-background border-x-2 border-b-2 border-background"
            id={`column-header-${index}`}
          >
            {header}
          </div>
        ))}
        {/* Blank cell to match the width of the timeline */}
        <div
          className="sticky right-0 z-20 w-[110px] h-10 flex bg-background"
          id="top-right-corner"
        />
      </div>
    </div>
  );
};

export default TimelineHeader;
