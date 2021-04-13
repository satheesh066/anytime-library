import { Pipe, PipeTransform } from '@angular/core';
import { IssuedBook } from '../models/issuedBook';

@Pipe({
    name: 'UserBooksPipe'
})

export class UserBooksPipe implements PipeTransform {
    transform(values: IssuedBook[], userId?: string): any[] {
        if (!values) {
            return [];
        }
        if (!userId) {
            return values;
        }
        userId = userId.toLowerCase();
        return values.filter(issuedBook => {
            return (issuedBook.IssuedTo.toLowerCase().includes(userId!));
        });
      }
}
