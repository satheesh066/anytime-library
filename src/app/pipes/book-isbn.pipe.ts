import { Pipe, PipeTransform } from '@angular/core';
import { Book } from '../models/book';

@Pipe({
    name: 'BookIsbnPipe'
})

export class BookIsbnPipe implements PipeTransform {
    transform(values: Book[], bookIsbn?: string): any[] {
        if (!values) {
            return [];
        }
        if (!bookIsbn) {
            return values;
        }
        bookIsbn = bookIsbn.toLowerCase();
        return values.filter(book => {
            return (book.Isbn.toLowerCase() === bookIsbn) ;
        });
      }
}
