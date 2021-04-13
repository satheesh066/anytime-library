export class UserRating {
    constructor(
        public Isbn: string,
        public Rating: number,
        public Review: string,
        public Name: string,
        public SubmittedBy: string,
        public SubmittedOn: Date
        ) {
    }
}
