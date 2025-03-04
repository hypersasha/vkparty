import {Db, MongoClient} from "mongodb";
import axios from "axios";
import {Movie} from "./Movie";
import {VKPartyResponse} from "./VKPartyResponse";
import {VKPartyMovie, VKUser} from "./Types";

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

    addNewParty(party_id: string, title: string, user_id: number, date: string, isPrivate: boolean, max_movies: number, info: string): Promise<VKPartyResponse> {
        return new Promise((resolve, reject) => {
            let owner: VKUser;
            this.getVkUser(user_id)
                .then((VkUserResponse: VKUser) => {
                    let guests_array: Array<VKUser> = [];
                    let event_date: Date = new Date(date);
                    event_date.setHours(23, 59, 59);
                    let myobj = {
                        pid: party_id,
                        title: title,
                        owner: VkUserResponse,
                        guests: guests_array,
                        date: event_date,
                        private: isPrivate,
                        max_movies: max_movies,
                        info: info
                    };
                    this.db.collection("parties").insertOne(myobj, (err, res) => {
                        if (err) reject(new VKPartyResponse(false, "Error while adding party to database", {error: err}));
                        resolve(new VKPartyResponse(true, "Party was added!", {pid: party_id}));
                    })
                })
                .catch((error: VKPartyResponse) => {
                    reject(error);
                })
        });
    };

    addMovieToParty(movie_id: number, party_id: string, user_id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.collection("parties").findOne({pid: party_id}, (err, document) => {
                if (err) reject({status:500, info :new VKPartyResponse(false, "Can't get party with given id", {party_id: party_id})});
                if (document === null) {
                    reject({status:404, info :new VKPartyResponse(false, "No party was found with given id", {party_id: party_id})})
                } else if (!document.movies) {
                    this.getVkPartyMovie(movie_id)
                        .then((VkPartyMovieResponse: VKPartyMovie) => {
                            this.getVkUser(user_id)
                                .then((VkUserResponse: VKUser) => {
                                    let detailed_movie = new Movie(VkPartyMovieResponse, VkUserResponse);
                                    this.db.collection("parties").updateOne({pid: party_id}, {$addToSet: {movies: detailed_movie}}, (err, res) => {
                                        if (err) reject({status : 500, info : new VKPartyResponse(false, "Error in database while adding movie to party", {error: err})});
                                        resolve({status: 201, info : new VKPartyResponse(true, "Movie was added to party!", detailed_movie)});
                                    })
                                })
                                .catch((error: VKPartyResponse) => {
                                    reject({status: 500, info :error});
                                })
                        })
                        .catch((error: VKPartyResponse) => {
                            reject({status: 500, info :error});
                        })
                } else if (this.maxMovieChecker(document.max_movies, document.movies, user_id, document.owner.user_id)) {
                    reject({status:403, info :new VKPartyResponse(false, "You have maximum movies added to this party", {})});
                } else {
                    Promise.all(document.movies.map((movie_info: Movie) => {
                            return new Promise((res, rej) => {
                                if (movie_info.movie.mid === movie_id)
                                    rej({status: 409, info :new VKPartyResponse(false, "This movie was already added", movie_info)});
                                else {
                                    res();
                                }
                            });
                        })
                    ).then(() => {
                        this.getVkPartyMovie(movie_id)
                            .then((VkPartyMovieResponse: VKPartyMovie) => {
                                this.getVkUser(user_id)
                                    .then((VkUserResponse: VKUser) => {
                                        let detailed_movie = new Movie(VkPartyMovieResponse, VkUserResponse);
                                        this.db.collection("parties").updateOne({pid: party_id}, {$addToSet: {movies: detailed_movie}}, (err, res) => {
                                            if (err) reject({status : 500, info :new VKPartyResponse(false, "Error in database while adding movie to party", {error: err})});
                                            resolve({status: 201, info :new VKPartyResponse(true, "Movie was added to party!", detailed_movie)});
                                        })
                                    })
                                    .catch((error: VKPartyResponse) => {
                                        reject({status: 500, info : error});
                                    })
                            })
                            .catch((error: VKPartyResponse) => {
                                reject({status : 500, info : error});
                            })
                    }).catch((error) => {
                        reject(error);
                    });
                }
            });
        })
    }

    addGuestsToParty(party_id: string, guests: Array<VKUser>): Promise<VKPartyResponse> {
        return new Promise((resolve, reject) => {
            this.db.collection("parties").updateOne({pid: party_id}, {$addToSet: {guests: {$each: guests}}}, (err, result) => {
                if (err) reject(new VKPartyResponse(false, "Error while trying to add guests to this party in database", err));
                if (result.modifiedCount === 0) reject(new VKPartyResponse(false, "All of the guests you provide already added to this party", guests));
                resolve(new VKPartyResponse(true, "New guests were added to party!", {}));
            });
        });
    }

    deleteGuest(party_id: string, guest_id: number): Promise<VKPartyResponse> {
        return new Promise((resolve, reject) => {
            this.db.collection("parties").updateOne({pid: party_id}, {$pull: {guests: {user_id: guest_id}}}, (err, result) => {
                if (err) reject(new VKPartyResponse(false, "Error while trying to delete a guest from this party", err));
                if (result.modifiedCount === 0) reject(new VKPartyResponse(false, "No such guest to delete from this party", {guest_id: guest_id}));
                resolve(new VKPartyResponse(true, "Guest was deleted!", {}));
            })
        })
    }

    deleteMovie(party_id: string, movie_id: number): Promise<VKPartyResponse> {
        return new Promise((resolve, reject) => {
            this.db.collection("parties").updateOne({pid: party_id}, {$pull: {movies: {"movie.mid": movie_id}}}, (err, result) => {
                if (err) reject(new VKPartyResponse(false, "Error while trying to delete a movie from this party", err));
                if (result.modifiedCount === 0) reject(new VKPartyResponse(false, "No such movie to delete from this party", {movie_id: movie_id}));
                resolve(new VKPartyResponse(true, "Movie was deleted!", {}));
            })
        })
    }

    getVkPartyMovie(movie_id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            let url: string = "https://api.themoviedb.org/3/movie/" + movie_id + "?api_key=" + process.env.API_KEY + "&language=ru-RU";
            axios.get(url)
                .then((response) => {
                    let movie = response.data;
                    let VKPartyMovie: VKPartyMovie = {
                        mid: movie.id,
                        title: movie.title,
                        poster_url: movie.poster_path,
                        score: movie.vote_average,
                        release: movie.release_date
                    };
                    resolve(VKPartyMovie);
                })
                .catch((error) => {
                    reject(new VKPartyResponse(false, "Error while attempting to get movie information from THEMOOVIEDB", {error: error.response.data}));
                })

        })
    }

    getVkUser(user_id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            let url: string = "https://api.vk.com/method/users.get?fields=photo_200&user_ids=" + user_id + "&lang=ru&access_token=c98a4fd9c98a4fd9c98a4fd965c9e3a00ccc98ac98a4fd9953bc044101305f6e12bc00f&v=5.95";
            axios.get(url)
                .then((response) => {
                    if (response.data.response.length === 0) {
                        reject(new VKPartyResponse(false, "No VK user found who offered this movie", {}));
                    } else {
                        let user = response.data.response[0];
                        let vk_user: VKUser = {
                            user_id: user.id,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            photo: user.photo_200
                        };
                        resolve(vk_user);
                    }
                })
                .catch((error) => {
                    reject(new VKPartyResponse(false, "Error while trying to find VK user who offered this movie", {error: error}))
                })
        });
    }

    getParty(party_id: string, user_id: number): Promise<VKPartyResponse> {
        return new Promise((resolve, reject) => {
            this.db.collection("parties").findOne({pid: party_id}, {projection: {_id: 0}}, (err, document) => {
                if (err) reject(new VKPartyResponse(false, "Error while trying to find party in database", {error: err}));
                if (document === null) {
                    reject(new VKPartyResponse(false, "No party was found with given id", {party_id: party_id}))
                }
                //Check if user has access to the party
                else if (document.private && (!document.guests.some((e: VKUser) => e.user_id === user_id) && user_id !== document.owner.user_id)) {
                    reject(new VKPartyResponse(false, "You don't have access to this party", {}));
                } else {
                    resolve(new VKPartyResponse(true, "Party was found!", document));
                }
            });
        });
    }

    getParties(user_id: number): Promise<VKPartyResponse> {
        return new Promise((resolve, reject) => {
            this.db.collection("parties").find({
                $and: [{
                    $or:
                        [
                            {"owner.user_id": user_id},
                            {guests: {$elemMatch: {user_id: user_id}}}

                        ]
                },
                    {
                        date: {$gte: new Date()}
                    }]
            }, {projection: {_id: 0}}).toArray((err, results) => {
                if (results.length === 0) {
                    reject(new VKPartyResponse(false, "No upcoming parties were found for user with this id", {user_id: user_id}))
                } else {
                    Promise.all(results.map((party) => {
                        return new Promise((res, rej) => {
                            this.getParty(party.pid, user_id)
                                .then((getPartyResponse: VKPartyResponse) => {
                                    res(getPartyResponse.data);
                                })
                                .catch((getPartyResponse: VKPartyResponse) => {
                                    rej(getPartyResponse);
                                })
                        })
                    }))
                        .then((response) => {
                            resolve(new VKPartyResponse(true, "Upcoming parties for this user", response))
                        })
                        .catch((error) => {
                            reject(error);
                        })
                }
            });

        })
    }

    maxMovieChecker(max_movies: number, movies: Array<Movie>, user_id: number, owner_id: number): Boolean {
        if (user_id === owner_id) {
            return false;
        }
        let count: number = 0;
        for (let i = 0; i < movies.length; i++) {
            if (movies[i].user.user_id === user_id) {
                count++;
            }
            if (count === max_movies) {
                return true;
            }
        }
        return false;
    }

    updateParty(party_id: string, user_id: number, patchObject: any): Promise<VKPartyResponse> {
        return new Promise((resolve, reject) => {
            this.db.collection("parties").findOne({pid: party_id}, (err, document) => {
                if (err) reject(new VKPartyResponse(false, "Error while trying to get party from database", err));
                if (user_id !== document.owner.user_id) reject(new VKPartyResponse(false, "You are not the owner of this party!", {}));
                else {
                    if (patchObject.date) {
                        let date: Date = new Date(patchObject.date);
                        date.setHours(23, 59, 59);
                        patchObject.date = date;
                    }
                    this.db.collection("parties").updateOne({pid: party_id}, {$set: patchObject}, (err, result) => {
                        if (err) reject(new VKPartyResponse(false, "Error while updating party object in database", err));
                        resolve(new VKPartyResponse(true, "Party updated!", Object.assign(document, patchObject)));
                    });
                }
            })
        });
    }

}
