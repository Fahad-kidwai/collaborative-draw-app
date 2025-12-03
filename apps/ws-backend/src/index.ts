import { WebSocketServer, WebSocket } from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    ws: WebSocket,
    rooms: string[],
    userId: string
}

const users: User[] = [];

function checkUser(token: string):string | null {
    try {
        const decoded = jwt.verify(token,JWT_SECRET)
        if(typeof decoded == "string"){return null}
        if(!decoded || !decoded.userId){return null}
        return decoded.userId 
    } catch (error) {
        return null
    }
}
wss.on("connection", (ws,request) => {  
    const url = request?.url;
    if(!url ){
        return
    }
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") ||"";
    const userId = checkUser(token);

    if(userId === null){
        ws.close();
        return;
    }

    users.push({
        ws,
        rooms: [],
        userId
    });


    ws.on("message", async function message(data){
        let parsedData
        if(typeof data !== "string"){
            parsedData = JSON.parse(data.toString());
        }else {
            parsedData = JSON.parse(data);
        }    

        if(parsedData.type === "join_room"){
            const user = users.find(x=> x.ws === ws)
            user?.rooms.push(parsedData.roomId)
        }
        
        if (parsedData.type === "leave_room") {
            const user = users.find(x => x.ws === ws);
            if (!user) {
                return;
            }
            user.rooms = user?.rooms.filter(x => x === parsedData.room);
        }

        console.log("message received")
        console.log(parsedData);

        if(parsedData.type === "shape"){
            const roomId = parsedData.roomId;
            const data = parsedData.shape;

            await prismaClient.shape.create({
                data: {
                    roomId: Number(roomId),
                    data,
                    userId: userId
                }
            })

            users.forEach(x=> {
                if(x.rooms.includes(roomId)){
                    x.ws.send(JSON.stringify({
                        type: "shape",
                        data,
                        roomId
                    }))
                }
            })
        }

        if(parsedData.type === "erase"){
            const roomId = parsedData.roomId;
            const data = parsedData.shape;

            await prismaClient.shape.delete({
                where: { id: data.id }
            })

            users.forEach(x=>{
                if(x.rooms.includes(roomId)){
                    x.ws.send(JSON.stringify({
                        type: "erase",
                        data,
                        roomId
                    }))
                }
            })
        }

    });
});

console.log("WebSocket server is running on ws://localhost:8080");
