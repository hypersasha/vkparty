import app from "./NetworkLayer";
import * as dotenv from "dotenv";
const PORT = 3000;

dotenv.config();
app.listen(PORT, () => {
    console.log("Jeoparty server started on port " + PORT);
});