import {Db, MongoClient} from "mongodb";
import axios from "axios";
import {Movie} from "./Movie";
import {VKPartyResponse} from "./VKPartyResponse";
import {VKUser} from "./VKUser";

const db_name = "vkpartydb";

export class Mongo {

    public client: MongoClient;
    public db: Db;

    constructor(public port: string, public dbName: string) {
        MongoClient.connect("mongodb://localhost:" + port, {useNewUrlParser: true}, (err, client) => {
            console.log("Succesfully connected!");
            this.client = client;
            this.db = client.db(dbName);
        });
    }

    test(): void {
        console.log("Hello!");
    }

    //TODO: Change "any" type to something specific
    addNewParty(party_id: string, title: string, user_id: number, date: string, isPrivate: boolean): any {
        return new Promise((resolve, reject) => {
            let myobj = {pid: party_id, title: title, owner_id: user_id, date: date, private: isPrivate};
            this.db.collection("parties").insertOne(myobj, (err, res) => {
                if (err) reject(new VKPartyResponse(false, "Error while adding party to database", {error: err}));
                resolve(new VKPartyResponse(true, "Party was added!", {pid: party_id}));
            })
        });
    };

    addMovieToParty(movie_id: number, party_id: string, user_id: number): any {
        return new Promise((resolve, reject) => {
            let myobj = {movie: movie_id, user: user_id};
            this.db.collection("parties").updateOne({pid: party_id}, {$addToSet: {movies: myobj}}, (err, res) => {
                if (err) reject(new VKPartyResponse(false, "Error in database while adding movie to party", {error: err}));
                if (res.result.nModified === 0) {
                    reject(new VKPartyResponse(false, "This movie is already added to this party!", {}));
                } else {
                    let url: string = "https://api.themoviedb.org/3/movie/" + movie_id + "?api_key=" + process.env.API_KEY + "&language=ru-RU";
                    axios.get(url)
                        .then((response) => {
                            let movie = response.data;
                            let VKPartyMovie: Movie = new Movie(movie.id, movie.title, movie.poster_path, movie.vote_average, movie.release_date);
                            this.db.collection("movies").updateOne({m_id: movie.id}, {$set: VKPartyMovie}, {upsert: true}, (err, res) => {
                                if (err) reject(new VKPartyResponse(false, "Error while adding movie to movies collection in database", {error: err}));
                                resolve(new VKPartyResponse(true, "Movie was added to party!", VKPartyMovie));
                            })
                        })
                        .catch((error) => {
                            reject(new VKPartyResponse(false, "Error while attempting to get movie information from THEMOOVIEDB", {error: error}));
                        })
                }
            })
        })
    }

    //TODO: Add checking of private party
    getParty(party_id: string, user_id: number): any {
        return new Promise((resolve, reject) => {
            this.db.collection("parties").findOne({pid: party_id}, {projection: {_id: 0}}, (err, document) => {
                if (err) reject(new VKPartyResponse(false, "Error while trying to find party in database", {error: err}));
                if (document === null) {
                    reject(new VKPartyResponse(false, "No party was found with given id", {}))
                } else {
                    Promise.all(document.movies.map((item) => {
                        return new Promise((res, rej) => {
                            let result_object = {movie: {}, user: {}};
                            this.db.collection("movies").findOne({m_id: item.movie}, {projection: {_id: 0}}, (err, document) => {
                                if (err) rej(new VKPartyResponse(false, "Error while trying to find full movie info in database to add it to full party information", {error: err}));
                                if (document === null) {
                                    rej(new VKPartyResponse(false, "No movie was found with given id in movies collection", {}))
                                } else {
                                    result_object.movie = document;
                                    let url: string = "https://api.vk.com/method/users.get?fields=photo_200&user_ids=" + item.user + "&lang=ru&access_token=c98a4fd9c98a4fd9c98a4fd965c9e3a00ccc98ac98a4fd9953bc044101305f6e12bc00f&v=5.95";
                                    axios.get(url)
                                        .then((response) => {
                                            if (response.data.response.length === 0) {
                                                rej(new VKPartyResponse(false, "No VK user found who offered" + document.title, {movie_id: document.m_id}))
                                            } else {
                                                let user = response.data.response[0];
                                                result_object.user = new VKUser(user.id, user.first_name, user.last_name, user.photo_200);
                                                res(result_object);
                                            }
                                        })
                                        .catch((error) => {
                                            rej(new VKPartyResponse(false, "Error while trying to find VK user who offered" + document.ttile, {error: error}))
                                        })
                                }
                            })
                        });
                    })).then((response) => {
                        let detailed_document = document;
                        detailed_document.movies = response;
                        resolve(new VKPartyResponse(true, "Party was found!", detailed_document));
                    })
                        .catch((error) => {
                            resolve(error)
                        });
                }
            });
        });
    }

}
