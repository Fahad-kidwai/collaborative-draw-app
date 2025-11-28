import { getToken } from "@/lib/api"
import { WS_URL } from "@/lib/ws"
import { useEffect, useState } from "react"
import { Canvas } from "./Canvas"


export function RoomCanvas({roomId}: {roomId: string}) {
    const [socket, setSocket] = useState<WebSocket|null>(null)
    const token = getToken()

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=${token}`)

        ws.onopen = () => {
            setSocket(ws);
            const data= {
                type: "join_room",
                roomId: roomId,
            }
            ws.send(JSON.stringify(data));
        }
    },[])

    if(!socket) return <div>Loading...</div>
    return <div><Canvas roomId={roomId} socket={socket} /></div>
}    