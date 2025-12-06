import { Injectable } from "@nestjs/common";
import { WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@Injectable()
export class WsService {
    private server: Server | null = null;

    setServer(server: Server){
        this.server = server
    }

    getServer():Server | null {
        return this.server;
    }

    emitToUser(userId:string, event:string, data:any):boolean{
        if(this.server == null) return false
        this.server.to(`user:${userId}`).emit(event,data)
        return true;
    }

    emitToAll(event: string, data:any):boolean{
        if(!this.server) return false;
        this.server.emit(event, data)
        return true;
    }
}