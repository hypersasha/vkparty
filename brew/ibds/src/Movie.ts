const poster_size = 185;

export class Movie {

    constructor(public m_id: number, public title: string, public poster_url: string, public score: number, public release: string) {
        this.m_id = m_id;
        this.title = title;
        this.poster_url = "http://image.tmdb.org/t/p/w" + poster_size + "/" + poster_url;
        this.score = score * 10;
        this.release = release.substring(0, 4);
    }

    private config(): void {
        //example of function
    }

}
