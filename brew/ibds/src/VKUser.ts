export class VKUser {

    constructor(public user_id : number, public first_name : string, public last_name : string, public photo : string) {
        this.user_id = user_id;
        this. first_name = first_name;
        this.last_name = last_name;
        this.photo = photo;
    }

    private config(): void {
        //example of function
    }

}
