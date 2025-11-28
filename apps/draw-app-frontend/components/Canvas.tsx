import { useRef, useState } from "react"
import { ToolBar } from "./ToolBar";

type Tool = "circle" | "rect" | "pencil"


export function Canvas({roomId,socket}:{roomId:string;socket:WebSocket;}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState();
    const [selectedTool, setSelectedTool] = useState<Tool>("pencil");

    return <div className="h-screen overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
        <ToolBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
}