"use client"
import { useEffect, useRef, useState } from "react"
import { ToolBar } from "./ToolBar";
import { Tool } from "@/types";
import { Game } from "@/draw/Game";


export function Canvas({roomId,socket}:{roomId:string;socket:WebSocket;}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("pencil");

    useEffect(()=>{
        game?.setTool(selectedTool);
    },[selectedTool,game])

    useEffect(()=>{
        if(canvasRef.current){
            const g = new Game(canvasRef.current,roomId,socket)
            setGame(g);
             
            return ()=>{
                g.destroy();
            }
        }

    },[canvasRef])

    return <div className="h-screen overflow-hidden">
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        <ToolBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
}