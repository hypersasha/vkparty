import {VKPartyMovie, VKUser} from "./Types";

const poster_size = 185;

export class Movie {

    constructor(public movie : VKPartyMovie, public user : VKUser = {user_id : 1, first_name : "Generic", last_name : "User", photo : "none"}) {
        this.movie.mid = movie.mid;
        this.movie.title = movie.title;
        this.movie.poster_url = "http://image.tmdb.org/t/p/w" + poster_size + "/" + movie.poster_url;
        this.movie.score = movie.score * 10;
        this.movie.release = movie.release.substring(0, 4);

        this.user = user;
    }

    private config(): void {
        //example of function
    }

}
