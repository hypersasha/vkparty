import app from "./NetworkLayer";
import * as dotenv from "dotenv";
import * as https from "https";
import * as fs from "fs";
import * as SocketIO from "socket.io";

const PORT = 3000;

dotenv.config();
let server = https.createServer({
    key: fs.readFileSync('./private.key'),
    cert: fs.readFileSync('./certificate.crt'),
    passphrase: 'coldmove'
}, app).listen(PORT, () => {
    console.log("VK Rave Server started on port " + PORT)
});

let io = require("socket.io").listen(server);


io.on('connection', (socket: any) => {
    console.log("Connection!");
    socket.on('ping', () => {
        console.log("Ping event!");
        io.emit('pong', {});
    });
    socket.on('disconnect', () => {
        console.log("Disconnected");
    })
});
