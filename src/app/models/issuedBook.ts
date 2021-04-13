export class IssuedBook {
    constructor(
        public Id: string,
        public Isbn: string,
        public Title: string,
        public Category: string,
        public ImageUrl: string,
        public Authors: string,
        public IssuedTo: string,
        public IssuedDate: Date,
        public ReturnDate: Date,
        public NoOfCopies: number) {
    }
}
