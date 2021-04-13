import { Pipe, PipeTransform } from '@angular/core';
import { Book } from '../models/book';

@Pipe({
    name: 'SearchBookPipe'
})

export class SearchBookPipe implements PipeTransform {
    transform(values: Book[], searchParam?: any): any[] {
        if (!values) {
            return [];
        }
        if (!searchParam) {
            return values;
        }
        searchParam = searchParam.toLowerCase();
        return values.filter(book => {
            return (book.Title.toLowerCase().includes(searchParam) ||
                        book.Authors[0].toLowerCase().includes(searchParam) ||
                            book.Category.toLowerCase().includes(searchParam));
        });
      }
}
