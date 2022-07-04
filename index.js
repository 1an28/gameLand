const { Socket } = require('dgram');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const roomList = []; 

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (Socket) => {
    console.log('[LOG] a [' + Socket.id + '] connected');

    let usedRoomNumber = -1;

    Socket.on('match search', () => {
        if (roomList.length === 0) {
            roomList.push(0);
        } else if (roomList[roomList.length - 1] === 2) {
            roomList.push(0);
        }

        usedRoomNumber = roomList.length;
        Socket.join(usedRoomNumber.toString());
        roomList[usedRoomNumber - 1] = roomList[usedRoomNumber - 1] + 1;
        
        console.log(roomList);

        Socket.emit('join log', usedRoomNumber);
    });

    Socket.on('disconnect', () => {        
        roomList[usedRoomNumber - 1] = roomList[usedRoomNumber - 1] - 1;
        Socket.leave(usedRoomNumber.toString());

        console.log('[LOG] [' + Socket.id + '] disconnected');
    });
});

server.listen(3000, () => {
    console.log('[LOG] listening on *:3000');
});