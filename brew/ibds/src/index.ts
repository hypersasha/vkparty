import app from "./NetworkLayer";
import * as dotenv from "dotenv";
import * as https from "https";
import * as fs from "fs";

const PORT = 443;

dotenv.config();
https.createServer({
    key: fs.readFileSync('./private.key'),
    cert: fs.readFileSync('./certificate.crt'),
    passphrase: 'coldmove'
}, app).listen(PORT, () => {
    console.log("VK Rave Server started on port " + PORT)
});