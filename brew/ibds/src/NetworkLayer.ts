import * as express from "express";
import {Routes} from "./Routes";
import * as path from "path";
import {Mongo} from "./Mongo";

class NetworkLayer {

    public app: express.Application;
    public MongoDB : Mongo = new Mongo("27017", "vkpartydb");
    public routesMap: Routes = new Routes();

    constructor() {
        this.app = express();
        this.app.use('/uploads', express.static(path.resolve(__dirname, '../src/uploads')));
        this.config();
        this.routesMap.routes(this.app, this.MongoDB);
    }

    private config(): void {
        //example of function
    }

    public test() : void {
        console.log("Hello!");
    }

}

export default new NetworkLayer().app;