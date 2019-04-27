import app from "./NetworkLayer";
import * as dotenv from "dotenv";
import * as https from "https";
import * as fs from "fs";

const PORT = 3000;

dotenv.config();
https.createServer({
    key: fs.readFileSync('./private.key'),
    cert: fs.readFileSync('./certificate.crt'),
    passphrase: 'coldmove'
}, app).listen(443, () => {
    console.log("server started")
});