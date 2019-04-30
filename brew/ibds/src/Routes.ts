import {Request, Response, Application, response} from "express";
import * as fs from "fs";
import * as path from "path";
import * as Busboy from "busboy";
import * as bodyParser from "body-parser";

import axios from "axios";

import {FileUploader} from "./RequestHandlers/FileUploader";
import {Movie} from "./Movie";
import {Mongo} from "./Mongo";
import {VKPartyResponse} from "./VKPartyResponse";
import {VKPartyMovie} from "./Types";

export class Routes {

    public routes(app: Application, MongoDB : Mongo): void {

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));

        // Allow Cross-Origin access to this server.
        app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
            res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
            next();
        });

        app.get('/test', (req, res) => {
            res.end("That's all folks, yeah!");
        });

        app.patch('/party' , (req, res) => {
            MongoDB.updateParty(req.body.party_id, req.body.user_id, req.body.patch)
                .then((response) => {
                    res.send(response);
                })
                .catch ((error) => {
                    res.send(error);
                })
        })

        app.get('/search', (req, res) => {

            let url = encodeURI("https://api.themoviedb.org/3/search/movie?api_key=" + process.env.API_KEY + "&language=ru-RU&page=1&query=" + req.query.query);

            axios.get(url)
                .then((response)=> {
                    if (response.data.results.length === 0) {
                        res.send(new VKPartyResponse(false, "No such movie. Try different name!", {}));
                    }
                    else {
                        let result = response.data.results;
                        let movies_to_send : Array<VKPartyMovie> = [];
                        result.forEach((movie : any) => {
                            let movie_to_push : VKPartyMovie =  new Movie ({mid : movie.id, title : movie.title, poster_url : movie.poster_path, score : movie.vote_average, release : movie.release_date}).movie;
                            movies_to_send.push(movie_to_push);
                        });
                        res.send(new VKPartyResponse(true, "Movies matching your query", movies_to_send));
                    }

                })
                .catch((error) => {
                    console.log(error);
                    res.send(new VKPartyResponse(false, "Error happened while getting movies from THEMOOVIEDB", {}));
                })
        });

        app.get('/party', (req, res) => {
            MongoDB.getParty(req.query.pid, parseInt(req.query.user_id, 10))
                .then((response : VKPartyResponse) => {
                    res.send(response);
                })
                .catch((response : VKPartyResponse) => {
                    res.send(response);
                })
        });

        app.get('/parties', (req, res) => {
           MongoDB.getParties(parseInt(req.query.user_id))
               .then((response : VKPartyResponse) => {
                   res.send(response);
               })
               .catch((error : VKPartyResponse) => {
                   res.send(error);
               })
        });

        // Uploads a new file on the server.
        app.post('/upload', (req, res) => {
            let saveDir = path.resolve('./uploads/');
            let fu : FileUploader = new FileUploader(saveDir,31457280, 10); // 30 MB and 1 file maximum

            // Lets create config for busboy
            let config = {
                headers: req.headers,
                limits: {
                    fileSize: fu.MaxFileSize,
                    files: fu.FilesCount
                }
            };

            let busboy = new Busboy(config);
            req.pipe(busboy);

            let uploadedFiles:Array<string> = [];
            busboy.on('file', (fieldname, file, filename, encoding, mimeType) => {
                fu.OnFile(fieldname, file, filename, encoding, mimeType);
                // Save name of uploaded file to array.
                file.on('end', () => {
                    uploadedFiles.push(filename);
                });
            });

            busboy.on('finish', () => {
                console.log('Upload complete');
                res.writeHead(200, {'Connection': 'close'});
                let response = {
                    uploaded: uploadedFiles
                };
                res.end(JSON.stringify(response));
            });
        });

        app.post('/party', (req, res) => {

            let partyId : string = this.makeid(32);

           MongoDB.addNewParty(partyId, req.body.title, req.body.user_id, req.body.date, req.body.isPrivate)
               .then((response : VKPartyResponse) => {
                   res.send(response);
               })
               .catch((response : VKPartyResponse) => {
                   res.send(response)
               })
        });

        app.post('/movie', (req, res) => {
           MongoDB.addMovieToParty(req.body.mid, req.body.pid, req.body.user_id)
               .then((response : VKPartyResponse) => {
                   res.send(response);
               })
               .catch((response : VKPartyResponse) => {
                   res.send(response);
               })
        });
    }

    //TODO: Apply escapeHtml to important parts of code
    private escapeHtml(text : string) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };

        //return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    private makeid(length : number) : string {
        let text : string = "";
        let possible : string = "abcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

}