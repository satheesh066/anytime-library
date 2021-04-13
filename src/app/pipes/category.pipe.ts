import { Pipe, PipeTransform } from '@angular/core';
import { Book } from '../models/book';

@Pipe({
    name: 'CategoryPipe'
})

export class CategoryPipe implements PipeTransform {
    transform(values: Book[], category?: string): any[] {
        if (!values) {
            return [];
        }
        if (!category) {
            return values;
        }
        if (category === 'Select Category' || category === 'All') { return values; }
        category = category.toLowerCase();
        return values.filter(book => {
            return (book.Category.toLowerCase() === category) ;
        });
      }
}
