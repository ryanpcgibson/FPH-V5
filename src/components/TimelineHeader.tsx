import React from "react";
import { Card } from "@/components/ui/card";

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
    <div className="sticky top-0 z-50 w-full" id="column-header-container">
      <div
        className="flex w-full justify-end border-background"
        id="column-headers"
      >
        <div className="absolute top-0 left-0 w-full h-1/2 bg-background z-0" />
        {headerTexts.map((header, index) => (
          // Would be cool to have shadow, but need to figure out bleed below sticky spacer
          <Card
            key={index}
            style={{ width: `${cellWidth}px` }}
            className="h-10  flex items-center justify-center m-x-2 text-background bg-foreground z-10 shadow-none "
          >
            {header}
          </Card>
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
