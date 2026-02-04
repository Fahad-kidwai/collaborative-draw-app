import { Circle, Eraser, Hand, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { IconButton } from "./IconButton";

type Tool = "circle" | "rect" | "pencil" | "erase" | "pan";

export function ToolBar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
}) {
  return (
    <div className="fixed bottom-12 left-5/12">
      <div className="flex gap-2 bg-card px-2 py-1 rounded-lg shadow-lg">
        <IconButton
          onClick={() => {
            setSelectedTool("pencil");
          }}
          activated={selectedTool === "pencil"}
          icon={<Pencil />}
        />
        <IconButton
          onClick={() => {
            setSelectedTool("rect");
          }}
          activated={selectedTool === "rect"}
          icon={<RectangleHorizontalIcon />}
        ></IconButton>
        <IconButton
          onClick={() => {
            setSelectedTool("circle");
          }}
          activated={selectedTool === "circle"}
          icon={<Circle />}
        ></IconButton>
        <IconButton
          onClick={() => {
            setSelectedTool("erase");
          }}
          activated={selectedTool === "erase"}
          icon={<Eraser />}
        ></IconButton>
        <IconButton
          onClick={() => {
            setSelectedTool("pan");
          }}
          activated={selectedTool === "pan"}
          icon={<Hand />}
        />
      </div>
    </div>
  );
}
