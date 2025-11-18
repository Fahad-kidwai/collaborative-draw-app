import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });


wss.on("connection", (ws) => {
    console.log("New client connected");
    ws.on("message", (message) => {
        ws.send(`Server received: ${message}`);
    });
});

console.log("WebSocket server is running on ws://localhost:8080");
