import { getExistingShapes } from "@/lib/api";
import { Shape, Tool } from "@/types";

// import { Shape } from "@repo/common/types";

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[]
    private roomId: string;
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private selectedTool: Tool = "pencil";

    socket:WebSocket;

    constructor(canvas: HTMLCanvasElement,roomId: string, socket: WebSocket){
        this.canvas = canvas;
        this.socket = socket;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.existingShapes = [];
        this.roomId = roomId;
        this.clicked = false;

        this.init()
        this.initHandlers();
        this.initMouseHandlers();

    }

    destroy(){
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)

        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)

        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }

    setTool(tool: Tool){
        this.selectedTool = tool;
    }
    
    async init(){
        const shapes = await getExistingShapes(this.roomId);
        console.log(shapes)
        this.existingShapes = shapes;
        this.clearCanvas();
    }

    initHandlers(){
        this.socket.onmessage = (event)=>{
            const message = JSON.parse(event.data);
            if(message.type === 'shape'){
                const parsedShape = JSON.parse(message.data)
                this.existingShapes.push(parsedShape)
                this.clearCanvas();
            }
        }
    }

    clearCanvas(){
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgb(0,0,0)";
        this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);

        this.existingShapes.forEach(shape=>{
            this.drawShape(shape);
        });    
    }    

    drawRect(shape: Extract<Shape, { type: 'rect' }>){
        this.ctx.strokeStyle = "rgb(255,255,255)";
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }

    drawCircle(shape: Extract<Shape, { type: 'circle' }>){
        this.ctx.beginPath();
        this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawPencil(shape: Extract<Shape, { type: 'pencil' }>){
        const points = shape.points;
        if(points.length === 0) return;
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        points.forEach(point => {
            this.ctx.lineTo(point.x, point.y);
        });
        this.ctx.stroke();
    }

    drawShape(shape: Shape){
        const type = shape.type;
        switch(type){
            case 'rect':
                this.drawRect(shape);
                break;
            case 'circle':
                this.drawCircle(shape);
                break;
            case 'pencil':
                this.drawPencil(shape);
                break;
        }
    }

    mouseDownHandler = (e:MouseEvent)=>{
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;

        if(this.selectedTool === 'pencil'){
            this.existingShapes.push({
                type: 'pencil',
                points: [{x:this.startX,y:this.startY}]
            })    
        }

    }

    mouseUpHandler = (e:MouseEvent)=>{
        this.clicked = false;
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;

        const selectedTool = this.selectedTool;
        let shape:Shape|null = null;

        if(selectedTool === 'rect'){
            shape = {
                type: 'rect',
                x: this.startX,
                y:this.startY,
                width,
                height,
            }
        }else if(selectedTool === 'circle'){
            const radius = Math.max(width,height)/2
            shape = {
                type: 'circle',
                centerX: this.startX +radius,
                centerY: this.startY +radius,
                radius,
            }
        }else if(selectedTool === 'pencil'){
            const currentShape:Shape = this.existingShapes[this.existingShapes.length - 1]
            if(currentShape.type === 'pencil'){
                shape = {
                    type: 'pencil',
                    points: currentShape.points,
                }
            }
        }

        if(!shape) return;

        this.existingShapes.push(shape);

        this.socket.send(JSON.stringify({
            type: 'shape',
            shape: JSON.stringify(shape),
            roomId: this.roomId,
        }))
    }

    mouseMoveHandler = (e:MouseEvent)=> {
        if(!this.clicked) return;
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;
        this.clearCanvas();
        this.ctx.strokeStyle = "rgba(255, 255, 255)"
        const selectedTool = this.selectedTool;
        console.log(selectedTool)
        if (selectedTool === "rect") {
            this.drawRect({
                type: 'rect',
                x: this.startX,
                y: this.startY,
                width,
                height,
            });   
        } else if (selectedTool === "circle") {
            const radius = Math.max(width, height) / 2;
            this.drawCircle({
                type: 'circle',
                centerX: this.startX + radius,
                centerY: this.startY + radius,
                radius,
            });                
        }else if(selectedTool === 'pencil'){
            const currentShape:Shape = this.existingShapes[this.existingShapes.length - 1]
            if(currentShape.type === 'pencil'){
                currentShape.points.push({ x: e.clientX, y: e.clientY })
                this.drawPencil(currentShape);
            }
        }
        
    }

    initMouseHandlers(){
        this.canvas.addEventListener('mousedown', this.mouseDownHandler);
        this.canvas.addEventListener('mouseup', this.mouseUpHandler);
        this.canvas.addEventListener('mousemove', this.mouseMoveHandler);
    }
}