import {Server} from "socket.io"
import http from "http"
import express from "express"

const app = express()
const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:["http://localhost:5173"]
    }
})

export function getReceiverSocketId(userId){
    return userSocketMap[userId]
}

const userSocketMap = {}

io.on("connection", (socket) => {
    console.log("A User connected",socket.id)

    const UserId = socket.handshake.query.UserId
    if(UserId) userSocketMap[UserId] = socket.id

    //io.emit is used to send events to all the connected users
    io.emit("getOnlineUser",Object.keys(userSocketMap))

    socket.on("disconnect", () =>{
        console.log("User disconnected",socket.id)
        delete userSocketMap[UserId]
        io.emit("getOnlineUser",Object.keys(userSocketMap))
    })
})

export {io, app, server} 