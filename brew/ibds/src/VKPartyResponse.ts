export class VKPartyResponse {

    constructor(public isOK : Boolean, public message : string, public data : Object) {
        this.isOK = isOK;
        this. message = message;
        this.data = data;
    }

    private config(): void {
        //example of function
    }

}
