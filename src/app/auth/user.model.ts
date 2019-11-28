export class User {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public photoURL: string,
        private _token: string,
        private _tokenExpirationDate: Date,
        public bio?: string,
        public fb?: string,
        public insta?: string,
        public twitter?: string
    ) { }

    get token() {
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }
        return this._token;
    }
}