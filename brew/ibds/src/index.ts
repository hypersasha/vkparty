import app from "./NetworkLayer";
import * as dotenv from "dotenv";
const PORT = 80;

dotenv.config();
app.listen(PORT, () => {
    console.log("Jeoparty server started on port " + PORT);
});