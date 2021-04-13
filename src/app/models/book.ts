export class Book {
    constructor(
        public Isbn: string,
        public Title: string,
        public Authors: string,
        public Description: string,
        public ImageUrl: string,
        public Category: string,
        public Location: string,
        public Quantity: number,
        public AvgRating: number) {
    }
}
