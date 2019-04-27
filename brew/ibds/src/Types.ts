export interface MovieInParty {
    movie: number;
    user: number;
}

export interface VKPartyMovie {
    mid: number;
    title: string;
    poster_url: string;
    score: number;
    release: string;
}

export interface VKUser {
    user_id : number,
    first_name : string,
    last_name : string,
    photo: string
}
